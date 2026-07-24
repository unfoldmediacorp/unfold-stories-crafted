import type { ComponentType } from "react";

export interface TemplateEntry {
  component: ComponentType<Record<string, unknown>>;
  subject: string;
  displayName?: string;
  previewData?: Record<string, unknown>;
}
