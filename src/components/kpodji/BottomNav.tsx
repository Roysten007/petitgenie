import { Link, useLocation } from "@tanstack/react-router";
import { Home, Sprout, BookOpen, Trophy, User } from "lucide-react";

const items = [
  { to: "/", label: "Village", Icon: Home },
  { to: "/jardin", label: "Jardin", Icon: Sprout },
  { to: "/histoires", label: "Histoires", Icon: BookOpen },
  { to: "/badges", label: "Badges", Icon: Trophy },
  { to: "/avatar", label: "Profil", Icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-black/5 px-4 pt-2 pb-6 grid grid-cols-5 gap-1 z-30">
      {items.map(({ to, label, Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 py-1.5 rounded-2xl"
          >
            <div
              className={`size-11 grid place-items-center rounded-2xl transition-all ${
                active ? "bg-terracotta text-terracotta-foreground shadow-lg -translate-y-1" : "bg-transparent text-deep-blue/50"
              }`}
            >
              <Icon className="size-5" strokeWidth={2.5} />
            </div>
            <span className={`text-[10px] font-display font-extrabold ${active ? "text-terracotta" : "text-deep-blue/50"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
