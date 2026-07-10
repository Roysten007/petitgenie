import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { KpodjiProvider } from "@/lib/kpodji-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-extrabold text-terracotta">404</h1>
        <h2 className="mt-4 text-xl font-display font-bold text-deep-blue">Chemin perdu dans le village</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas. Retourne à la place du village.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-terracotta px-5 py-3 text-sm font-display font-bold text-terracotta-foreground shadow-lg hover:opacity-90"
          >
            Retour au village
          </Link>
        </div>
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
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display font-bold text-deep-blue">Oups, quelque chose a bougé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          On réessaie ensemble ?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-terracotta px-5 py-3 text-sm font-display font-bold text-terracotta-foreground shadow-lg"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-5 py-3 text-sm font-display font-bold text-deep-blue"
          >
            Village
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Kpodji — Le village qui apprend" },
      { name: "description", content: "Application éducative bilingue français/anglais pour les enfants d'Afrique de l'Ouest. Maths et anglais dans un village virtuel joyeux." },
      { name: "author", content: "Kpodji" },
      { name: "theme-color", content: "#a34e36" },
      { property: "og:title", content: "Kpodji — Le village qui apprend" },
      { property: "og:description", content: "Un village virtuel pour apprendre les maths et l'anglais en s'amusant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
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
      <KpodjiProvider>
        <Outlet />
      </KpodjiProvider>
    </QueryClientProvider>
  );
}
