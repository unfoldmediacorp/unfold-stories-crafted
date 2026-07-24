import { type ComponentType } from "react";
import { EnquiryEmail } from "./EnquiryEmail";
import type { TemplateEntry } from "./types";

export const template = {
  component: EnquiryEmail as unknown as ComponentType<Record<string, unknown>>,
  subject: "New enquiry from unfoldmediacorp.com",
  displayName: "Enquiry notification",
  previewData: {
    name: "Jane Doe",
    email: "jane@example.com",
    company: "Example Co",
    phone: "+91 98765 43210",
    brief: "We are looking for a cinematic brand film for our product launch.",
  },
} satisfies TemplateEntry;
