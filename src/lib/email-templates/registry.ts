import { template as enquiry } from "./enquiry";
import type { TemplateEntry } from "./types";

export const TEMPLATES = {
  enquiry: enquiry as unknown as TemplateEntry,
} as const;

export type TemplateName = keyof typeof TEMPLATES;
