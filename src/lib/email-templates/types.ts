import type { ComponentType } from "react";

export interface TemplateEntry<Props = Record<string, unknown>> {
  component: ComponentType<Props>;
  subject: string;
  displayName?: string;
  previewData?: Props;
}
