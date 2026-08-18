import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { checkRateLimit } from "@/lib/rate-limit";

// unexpected top-level fields (e.g. a scripted client adding extra params) are
// rejected outright rather than silently stripped.
const contactSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(255),
    company: z.string().trim().max(100).optional().or(z.literal("")),
    phone: z.string().trim().max(50).optional().or(z.literal("")),
    brief: z.string().trim().min(1, "Project brief is required").max(2000),
    // Honeypot: a field real visitors never see or fill. Bots that
    // autofill every input trip it. Optional/empty for legitimate submits.
    website: z.string().max(200).optional().or(z.literal("")),
  })
  .strict();

// Hard ceiling on request body size, checked before JSON parsing so an
// oversized payload never reaches the parser or the DB/email path.
const MAX_BODY_BYTES = 20_000;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(request.headers.get("content-length") ?? "0");
        if (contentLength > MAX_BODY_BYTES) {
          return Response.json({ error: "Request body too large." }, { status: 413 });
        }

        const ip = getClientIp(request);
        const rateLimitResult = checkRateLimit(ip);
        if (!rateLimitResult.allowed) {
          return Response.json(
            { error: "Too many requests. Please try again later." },
            { status: 429, headers: { "Retry-After": String(rateLimitResult.retryAfterSeconds) } },
          );
        }

        const rawBody = await request.text();
        if (rawBody.length > MAX_BODY_BYTES) {
          return Response.json({ error: "Request body too large." }, { status: 413 });
        }

        let body: unknown;
        try {
          body = JSON.parse(rawBody);
        } catch {
          return Response.json({ error: "Invalid JSON body." }, { status: 400 });
        }

        const parseResult = contactSchema.safeParse(body);
        if (!parseResult.success) {
          return Response.json(
            { error: "Validation failed.", issues: parseResult.error.issues },
            { status: 400 },
          );
        }

        const { name, email, company, phone, brief, website } = parseResult.data;

        // Honeypot tripped: pretend success so the bot doesn't learn to
        // avoid the field, but skip the DB write and the email entirely.
        if (website) {
          return Response.json({ success: true });
        }

        const { supabase } = await import("@/integrations/supabase/client");
        const { error: dbError } = await supabase.from("enquiries").insert({
          name,
          email,
          company: company || null,
          phone: phone || null,
          brief,
        });

        if (dbError) {
          console.error("Failed to save enquiry:", dbError);
          return Response.json(
            { error: "Unable to save your enquiry. Please try again." },
            { status: 500 },
          );
        }

        try {
          await sendTemplateEmail("enquiry", "Unfoldmediacorp@gmail.com", {
            templateData: { name, email, company, phone, brief },
            replyTo: email,
            idempotencyKey: `enquiry-${Date.now()}-${email}`,
          });
        } catch (error) {
          console.error("Failed to send enquiry email:", error);
        }

        return Response.json({ success: true });
      },
    },
  },
});
