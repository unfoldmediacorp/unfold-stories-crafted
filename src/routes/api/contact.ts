import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  brief: z.string().trim().min(1, "Project brief is required").max(2000),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
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

        const { name, email, company, phone, brief } = parseResult.data;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error: dbError } = await supabaseAdmin.from("enquiries").insert({
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
