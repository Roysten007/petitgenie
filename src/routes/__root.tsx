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

// Duolingo Sidebar Navigation Icons

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
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
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

const SIDEBAR_ITEMS = [
  { to: "/", label: "APPRENDRE", iconClass: "fa-solid fa-house" },
  { to: "/alphabet", label: "ALPHABET", iconClass: "fa-solid fa-font" },
  { to: "/histoires", label: "HISTOIRES", iconClass: "fa-solid fa-book-open" },
  { to: "/badges", label: "TOTEMS", iconClass: "fa-solid fa-award" },
  { to: "/avatar", label: "APPRENTI", iconClass: "fa-solid fa-user" },
  { to: "/parents", label: "PARENTS", iconClass: "fa-solid fa-user-shield" },
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <KpodjiProvider>
        {/* Responsive Desktop Sidebar + Fluid Main Shell */}
        <div className="min-h-screen w-full bg-white text-[#3c3c3c] flex">
          
          {/* Left Sidebar (Desktop Only) */}
          <aside className="hidden md:flex md:w-64 bg-white border-r border-[#e5e5e5] flex-col p-6 space-y-8 shrink-0 select-none">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-ocre to-terracotta flex items-center justify-center font-display font-extrabold text-white text-lg shadow-sm">
                Pg
              </div>
              <span className="font-display font-extrabold text-xl tracking-wide text-deep-blue">petit génie</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 flex flex-col gap-2">
              {SIDEBAR_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-display font-extrabold text-xs tracking-wider transition-all duration-200 border-2 border-transparent hover:bg-neutral-100 hover:scale-[1.02]"
                  activeProps={{
                    className: "bg-[#ddf4ff] text-[#1899d6] border-[#84d8ff]"
                  }}
                >
                  <i className={`${item.iconClass} text-lg w-5 shrink-0 text-center`} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Bottom Credits */}
            <div className="text-[10px] text-muted-foreground font-bold px-2">
              © {new Date().getFullYear()} Petit Génie Inc.
            </div>
          </aside>

          {/* Main App Workspace Container - Removed maximum layout constraints to allow full-width grid sharing */}
          <main className="flex-1 flex min-h-screen">
            <Outlet />
          </main>
          
        </div>
      </KpodjiProvider>
    </QueryClientProvider>
  );
}
