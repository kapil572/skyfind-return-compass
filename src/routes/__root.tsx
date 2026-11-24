import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SkyAssist — Airport Lost & Found" },
      { name: "description", content: "Match lost and found items at the airport and verify ownership." },
      { property: "og:title", content: "SkyAssist — Airport Lost & Found" },
      { property: "og:description", content: "Match lost and found items at the airport and verify ownership." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" },
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

const NAV = [
  ["/", "00", "Dashboard"], ["/passengers", "01", "Passengers"], ["/lost", "02", "Lost reports"],
  ["/found", "03", "Found items"], ["/matches", "04", "Matching"], ["/claims", "05", "Claims"], ["/about", "06", "About"],
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div className="min-h-screen md:flex">
        <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
          <div className="flex items-center justify-between p-4 md:block md:p-6">
            <Link to="/" className="font-display text-2xl uppercase tracking-wider">Sky<span className="text-sidebar-primary">Assist</span></Link>
            <p className="hidden font-mono text-xs text-sidebar-foreground/60 md:mt-1 md:block">LOST &amp; FOUND DESK</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-1 md:flex-col md:px-3 md:pb-0">
            {NAV.map(([to, code, label]) => (
              <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
                className="flex shrink-0 items-center gap-3 rounded px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent [&.active]:bg-sidebar-primary [&.active]:text-sidebar-primary-foreground">
                <span className="font-mono text-xs opacity-70">{code}</span>{label}
              </Link>
            ))}
            <span className="w-6 shrink-0 md:hidden" />
          </nav>
          <p className="px-4 pb-2 font-mono text-[10px] uppercase tracking-wider text-sidebar-foreground/70 md:hidden">Swipe for more pages →</p>
        </aside>
        <main className="flex-1 px-4 py-8 md:px-10"><div className="mx-auto max-w-6xl"><Outlet /></div></main>
      </div>
    </QueryClientProvider>
  );
}
