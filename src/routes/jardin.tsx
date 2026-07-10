import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";

export const Route = createFileRoute("/jardin")({
  component: Jardin,
});

const plants = [
  { emoji: "🌱", stage: "Petite pousse", grown: true },
  { emoji: "🌿", stage: "Jeune plante", grown: true },
  { emoji: "🌾", stage: "Herbe haute", grown: true },
  { emoji: "🌸", stage: "Fleur", grown: true },
  { emoji: "🌳", stage: "Arbre", grown: true },
  { emoji: "🌻", stage: "Tournesol", grown: false },
  { emoji: "🌴", stage: "Palmier", grown: false },
  { emoji: "🥭", stage: "Manguier", grown: false },
];

function Jardin() {
  const { seeds } = useKpodji();
  return (
    <PhoneFrame>
      <TopBar />
      <div className="px-5 pb-2">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Mon jardin</p>
        <h1 className="font-display text-2xl font-extrabold text-deep-blue">Un jardin qui grandit</h1>
        <p className="text-sm text-muted-foreground mt-1">Chaque graine gagnée fait pousser une plante.</p>
      </div>

      {/* Garden scene */}
      <div className="mx-5 mt-3 relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-200 via-ocre/20 to-leaf/30 h-64 shadow-inner">
        <div className="absolute inset-0 wax-dots opacity-30" />
        <div className="absolute top-3 left-4 text-4xl">☀️</div>
        <Mascot size={70} className="absolute top-2 right-3" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-terracotta/70" />
        <div className="absolute bottom-3 inset-x-0 flex justify-around items-end px-4">
          {plants.filter((p) => p.grown).map((p, i) => (
            <div
              key={i}
              className="text-5xl animate-grow-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-leaf/10 border border-leaf/30 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="font-display font-extrabold text-leaf text-sm">{seeds} graines récoltées</p>
            <p className="text-[11px] text-leaf/70">Encore 26 pour la prochaine plante !</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-leaf grid place-items-center text-white font-display font-extrabold shadow">
            {Math.min(100, Math.round((seeds / 150) * 100))}%
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Plantes à faire pousser</p>
        <div className="grid grid-cols-4 gap-2">
          {plants.map((p, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl grid place-items-center text-3xl border-2 ${
                p.grown ? "bg-leaf/10 border-leaf/30" : "bg-neutral-100 border-neutral-200 grayscale opacity-40"
              }`}
              title={p.stage}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="h-6" />
      <BottomNav />
    </PhoneFrame>
  );
}
