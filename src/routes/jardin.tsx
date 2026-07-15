import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { MascotRing } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import jardinImg from "@/assets/jardin.jpg";

export const Route = createFileRoute("/jardin")({
  component: Jardin,
});

const plants = [
  { emoji: "🌱", stage: "Petite pousse", grown: true,  size: 32 },
  { emoji: "🌿", stage: "Jeune plante",  grown: true,  size: 38 },
  { emoji: "🌾", stage: "Herbe haute",   grown: true,  size: 44 },
  { emoji: "🌸", stage: "Fleur",         grown: true,  size: 40 },
  { emoji: "🌳", stage: "Arbre",         grown: true,  size: 52 },
  { emoji: "🌻", stage: "Tournesol",     grown: false, size: 38 },
  { emoji: "🌴", stage: "Palmier",       grown: false, size: 44 },
  { emoji: "🥭", stage: "Manguier",      grown: false, size: 40 },
];

function Jardin() {
  const { seeds } = useKpodji();
  const pct = Math.min(100, Math.round((seeds / 150) * 100));
  const nextPlant = Math.max(0, 150 - seeds);

  return (
    <PhoneFrame>
      <TopBar />

      {/* Header */}
      <div className="px-4 pb-1">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Mon jardin</p>
        <h1 className="font-display text-2xl font-extrabold text-deep-blue mt-0.5">Un jardin qui grandit</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Chaque graine gagnée fait pousser une plante.</p>
      </div>

      {/* Garden scene — photo + plants overlay */}
      <div className="mx-4 mt-3 relative rounded-3xl overflow-hidden h-52 animate-fade-scale"
        style={{ boxShadow: "0 16px 48px oklch(0.18 0.10 255 / 30%)" }}
      >
        {/* Background photo */}
        <img src={jardinImg} alt="Jardin" className="absolute inset-0 w-full h-full object-cover" />
        {/* Overlay pour assombrir légèrement */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, oklch(0.18 0.08 140 / 75%) 0%, oklch(0.20 0.08 140 / 15%) 55%, transparent 100%)" }}
        />

        {/* Mascot avec anneau */}
        <div className="absolute top-2 right-2">
          <MascotRing size={56} color="leaf" />
        </div>

        {/* Plants growing on top */}
        <div className="absolute bottom-2 inset-x-0 flex justify-around items-end px-6">
          {plants.filter((p) => p.grown).map((p, i) => (
            <div
              key={i}
              className="animate-grow-up"
              style={{
                animationDelay: `${i * 110}ms`,
                fontSize: p.size,
                filter: "drop-shadow(0 4px 8px oklch(0.18 0.08 255 / 40%))",
                lineHeight: 1,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Seeds stat card */}
      <div className="px-4 mt-4">
        <div
          className="rounded-2xl p-4 flex items-center gap-4 animate-slide-up"
          style={{
            background: "linear-gradient(135deg, oklch(0.52 0.16 148 / 10%) 0%, oklch(0.62 0.14 160 / 8%) 100%)",
            border: "1px solid oklch(0.52 0.16 148 / 25%)",
          }}
        >
          <div className="flex-1">
            <p className="font-display font-extrabold text-leaf text-base">{seeds} graines récoltées</p>
            <p className="text-[11px] text-leaf/70 mt-0.5">
              {nextPlant > 0 ? `Encore ${nextPlant} pour la prochaine plante !` : "Jardin complet ! 🎉"}
            </p>
            {/* Progress bar */}
            <div className="mt-2.5 h-2 bg-leaf/15 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, oklch(0.52 0.16 148), oklch(0.65 0.16 155))",
                  boxShadow: "0 0 10px oklch(0.52 0.16 148 / 60%)",
                }}
              />
            </div>
          </div>

          {/* SVG circle progress */}
          <div className="relative size-14 shrink-0">
            <svg className="size-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="oklch(0.52 0.16 148 / 18%)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke="oklch(0.52 0.16 148)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
                style={{
                  transition: "stroke-dashoffset 1.2s var(--ease-smooth)",
                  filter: "drop-shadow(0 0 6px oklch(0.52 0.16 148 / 70%))",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-extrabold text-leaf text-xs">{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plant collection grid */}
      <div className="px-4 mt-4">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2.5">
          Plantes à faire pousser
        </p>
        <div className="grid grid-cols-4 gap-2">
          {plants.map((p, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl grid place-items-center relative overflow-hidden animate-pop-in"
              title={p.stage}
              style={{
                animationDelay: `${i * 55}ms`,
                ...(p.grown ? {
                  background: "linear-gradient(135deg, oklch(0.52 0.16 148 / 12%) 0%, oklch(0.62 0.14 160 / 8%) 100%)",
                  border: "1.5px solid oklch(0.52 0.16 148 / 35%)",
                  boxShadow: "0 2px 12px oklch(0.52 0.16 148 / 15%)",
                } : {
                  background: "oklch(0.93 0.015 80)",
                  border: "1.5px dashed oklch(0.82 0.02 80)",
                  filter: "grayscale(1)",
                  opacity: "0.45",
                }),
              }}
            >
              {p.grown && (
                <div
                  className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent 0%, oklch(0.52 0.16 148 / 25%) 50%, transparent 100%)", backgroundSize: "200% auto" }}
                />
              )}
              <span style={{ fontSize: p.size - 10 }}>{p.emoji}</span>
              {p.grown && (
                <div
                  className="absolute bottom-1 right-1 size-2 rounded-full animate-heartbeat"
                  style={{ background: "oklch(0.52 0.16 148)", boxShadow: "0 0 6px oklch(0.52 0.16 148)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
      <BottomNav />
    </PhoneFrame>
  );
}
