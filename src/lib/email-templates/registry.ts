import { template as enquiry } from "./enquiry";
import type { TemplateEntry } from "./types";

export const TEMPLATES: Record<string, TemplateEntry> = {
  enquiry,
};

export type TemplateName = keyof typeof TEMPLATES;
