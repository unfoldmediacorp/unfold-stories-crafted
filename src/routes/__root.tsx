import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, studioJsonLd } from "../lib/site";
import { CtaAnchor, CtaButton, CtaLink } from "../components/CtaButton";
import { CustomCursor } from "../components/CustomCursor";
import { LoadingScreen } from "../components/LoadingScreen";
import { PageTransition } from "../components/PageTransition";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <span className="label label-eyebrow text-accent-ink block mb-8">404 / Off script</span>
        <h1 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter mb-8">
          This page hasn't been filmed.
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          The URL you followed doesn't exist in our archive.
        </p>
        <CtaLink to="/">Return home</CtaLink>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <span className="label label-eyebrow text-accent-ink block mb-8">Error</span>
        <h1 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter mb-8">
          Something interrupted the reel.
        </h1>
        <p className="text-sm text-muted-foreground mb-12">Please try again or return home.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <CtaButton
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </CtaButton>
          <CtaAnchor href="/" variant="outline">
            Go home
          </CtaAnchor>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} | Cinematic Storytelling Studio, Coimbatore` },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      {
        property: "og:title",
        content: `${SITE_NAME} | Cinematic Storytelling Studio, Coimbatore`,
      },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: `${SITE_NAME} | Cinematic Storytelling Studio, Coimbatore`,
      },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/RziJEjVnxuOXklGmBiSJe7pfzPA3/social-images/social-1784537282788-WALL.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/RziJEjVnxuOXklGmBiSJe7pfzPA3/social-images/social-1784537282788-WALL.webp",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(studioJsonLd()),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingScreen />
      <CustomCursor />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </QueryClientProvider>
  );
}
