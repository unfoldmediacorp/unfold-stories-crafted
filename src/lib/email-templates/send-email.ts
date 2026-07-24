import React from "react";
import { render } from "@react-email/render";
import { sendLovableEmail, EmailAPIError } from "@lovable.dev/email-js";
import { TEMPLATES, type TemplateName } from "./registry";

const SENDER_DOMAIN = process.env.LOVABLE_EMAIL_SENDER_DOMAIN ?? "unfoldmediacorp.com";
const FROM_ADDRESS = `Unfold Media Corp <hello@${SENDER_DOMAIN}>`;

interface SendTemplateEmailOptions {
  templateData: Record<string, unknown>;
  replyTo?: string;
  idempotencyKey?: string;
}

export async function sendTemplateEmail(
  templateName: TemplateName,
  to: string,
  options: SendTemplateEmailOptions
) {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Email template "${String(templateName)}" not found.`);
  }

  const element = React.createElement(template.component, options.templateData);
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  try {
    const result = await sendLovableEmail(
      {
        to,
        from: FROM_ADDRESS,
        sender_domain: SENDER_DOMAIN,
        subject: template.subject,
        html,
        text,
        reply_to: options.replyTo,
        idempotency_key: options.idempotencyKey,
      },
      { apiKey: process.env.LOVABLE_API_KEY! }
    );
    return { sent: true as const, ...result };
  } catch (error) {
    if (error instanceof EmailAPIError && error.code === "recipient_suppressed") {
      return { sent: false as const, reason: "recipient_suppressed" as const };
    }
    throw error;
  }
}
