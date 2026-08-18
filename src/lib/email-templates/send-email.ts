import React from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { TEMPLATES, type TemplateName } from "./registry";

const FROM_ADDRESS = "Unfold Media Corp <hello@unfoldmediacorp.com>";

interface SendTemplateEmailOptions {
  templateData: Record<string, unknown>;
  replyTo?: string;
  idempotencyKey?: string;
}

let _resend: Resend | undefined;

function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable.");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export async function sendTemplateEmail(
  templateName: TemplateName,
  to: string,
  options: SendTemplateEmailOptions,
) {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Email template "${String(templateName)}" not found.`);
  }

  const element = React.createElement(template.component, options.templateData);
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);

  const { data, error } = await getResendClient().emails.send(
    {
      from: FROM_ADDRESS,
      to,
      subject: template.subject,
      html,
      text,
      replyTo: options.replyTo,
    },
    options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined,
  );

  if (error) {
    console.error("[Resend] Email send failed:", error.name, error.message);
    throw new Error(`Resend email send failed: ${error.message}`);
  }

  return { sent: true as const, id: data.id };
}
