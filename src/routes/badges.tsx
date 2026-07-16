import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";

export const Route = createFileRoute("/badges")({
  component: BadgesPage,
});

function BadgesPage() {
  const { badges } = useKpodji();
  const unlocked = badges.filter((b) => b.unlocked).length;
  const pct = Math.round((unlocked / badges.length) * 100);

  return (
    <PhoneFrame>
      <TopBar />

      {/* Header */}
      <div className="px-3">
        <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre flex items-center gap-1.5">
          <i className="fa-solid fa-trophy text-xs" /> Mon Coffre aux Totems
        </p>
        <h1 className="font-display text-2xl font-extrabold text-deep-blue mt-0.5 leading-tight">Les Totems de Petit Génie</h1>

        {/* Progress summary */}
        <div className="flex items-center gap-3 mt-3 bg-black/5 p-3 rounded-2xl">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-display font-extrabold text-deep-blue uppercase tracking-wider">
                {unlocked} / {badges.length} Totems Libérés !
              </span>
              <span className="text-[11px] font-display font-extrabold text-terracotta">{pct}%</span>
            </div>
            <div className="h-2.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 100%)",
                  boxShadow: "0 0 10px oklch(0.58 0.20 38 / 50%)",
                }}
              />
            </div>
          </div>
          <div
            className="size-11 rounded-xl grid place-items-center shrink-0 animate-bounce"
            style={{
              background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 100%)",
            }}
          >
            <i className="fa-solid fa-award text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Badges list - compact and colorful */}
      <div className="px-3 mt-4 flex-1 overflow-y-auto pb-2 space-y-2">
        {badges.map((b, i) => (
          <div
            key={b.id}
            className="flex items-center gap-3 rounded-2xl p-3 relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
            style={{
              background: b.unlocked 
                ? "linear-gradient(145deg, oklch(1 0 0 / 95%) 0%, oklch(0.97 0.02 78 / 90%) 100%)"
                : "oklch(0.95 0.01 80)",
              border: b.unlocked 
                ? "1.5px solid oklch(0.76 0.18 78 / 30%)"
                : "1.5px dashed oklch(0.85 0.01 80)",
              boxShadow: b.unlocked ? "0 4px 14px oklch(0.58 0.20 38 / 10%)" : "none"
            }}
          >
            {/* Shimmer for unlocked */}
            {b.unlocked && <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />}

            {/* Circular badge container */}
            <div
              className={`size-14 rounded-full flex items-center justify-center shrink-0 relative ${
                b.unlocked 
                  ? "bg-gradient-to-br from-ocre/20 to-terracotta/20 border-2 border-ocre" 
                  : "bg-black/5"
              }`}
            >
              {b.unlocked ? (
                <span className="text-3xl animate-pulse">{b.emoji}</span>
              ) : (
                <i className="fa-solid fa-lock text-[#afafaf] text-lg" />
              )}
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`font-display font-extrabold text-sm truncate ${
                  b.unlocked ? "text-deep-blue" : "text-muted-foreground/50"
                }`}>
                  {b.name}
                </p>
                {b.unlocked && <i className="fa-solid fa-wand-magic-sparkles text-ocre text-[10px] animate-pulse" />}
              </div>
              <p className={`text-[11px] leading-tight mt-0.5 ${
                b.unlocked ? "text-muted-foreground" : "text-muted-foreground/45"
              }`}>
                {b.unlocked ? b.desc : "Continue ton voyage avec Petit Génie pour libérer l'esprit de ce totem !"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PhoneFrame>
  );
}
