import { Link, useLocation } from "@tanstack/react-router";

const items = [
  { to: "/",          label: "Village",  iconClass: "fa-solid fa-house" },
  { to: "/alphabet",  label: "ABC",      iconClass: "fa-solid fa-font" },
  { to: "/histoires", label: "Contes",    iconClass: "fa-solid fa-book-open" },
  { to: "/badges",    label: "Totems",   iconClass: "fa-solid fa-award" },
  { to: "/jardin",    label: "Jardin",   iconClass: "fa-solid fa-seedling" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <div className="sticky bottom-0 z-30 px-4 pb-6 pt-2">
      <nav
        className="glass rounded-3xl px-3 py-2.5 grid grid-cols-5 gap-1"
        style={{
          boxShadow: "0 8px 32px oklch(0.18 0.08 255 / 18%), 0 2px 8px oklch(0.18 0.08 255 / 12%)",
        }}
      >
        {items.map(({ to, label, iconClass }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 py-1 transition-transform active:scale-90"
            >
              <div
                className={`size-11 grid place-items-center rounded-2xl transition-all duration-300 ${
                  active ? "-translate-y-1" : ""
                }`}
                style={active ? {
                  background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.68 0.18 55) 100%)",
                  boxShadow: "0 6px 20px oklch(0.58 0.20 38 / 50%)",
                } : {}}
              >
                <i
                  className={`${iconClass} text-lg transition-colors duration-300 ${active ? "text-white" : "text-deep-blue/40"}`}
                />
              </div>
              <span className={`text-[9px] font-display font-extrabold transition-colors duration-300 ${active ? "text-terracotta" : "text-deep-blue/35"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
