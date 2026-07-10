import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji, colorClass } from "@/lib/kpodji-store";
import villageImg from "@/assets/village.jpg";
import { ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Village,
});

function Village() {
  const { childName, districts } = useKpodji();

  return (
    <PhoneFrame>
      <TopBar />

      {/* Hero village */}
      <div className="px-5">
        <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-lg">
          <img
            src={villageImg}
            alt="Le village de Kpodji"
            className="w-full h-40 object-cover"
            loading="eager"
            width={1024}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/70 via-deep-blue/10 to-transparent" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <p className="text-white/80 text-[11px] font-display font-bold uppercase tracking-widest">Bienvenue</p>
            <h1 className="font-display text-white text-2xl font-extrabold leading-tight">Salut {childName} ! 👋</h1>
          </div>
          <div className="absolute -top-2 -right-2">
            <Mascot size={80} />
          </div>
        </div>
      </div>

      {/* Défi du jour */}
      <div className="px-5 mt-4">
        <Link
          to="/defi"
          className="block relative overflow-hidden bg-deep-blue text-deep-blue-foreground rounded-3xl p-4 shadow-xl active:scale-[0.98] transition-transform"
        >
          <div className="wax-dots absolute inset-0 opacity-30" />
          <div className="relative flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-ocre grid place-items-center shrink-0 shadow-lg">
              <Sparkles className="size-6 text-deep-blue" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre">Défi du jour</p>
              <p className="font-display font-extrabold text-lg leading-tight truncate">Le mystère des mangues</p>
              <p className="text-white/70 text-[11px]">5 minutes · +15 graines</p>
            </div>
            <ChevronRight className="size-5 shrink-0" />
          </div>
        </Link>
      </div>

      {/* Village map */}
      <div className="px-5 mt-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-extrabold text-deep-blue">Le Village</h2>
          <span className="text-[11px] font-display font-bold text-muted-foreground">4 quartiers</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {districts.map((d, i) => {
            const c = colorClass(d.color);
            return (
              <Link
                key={d.id}
                to="/exercise/$district"
                params={{ district: d.id }}
                className="animate-pop-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={`aspect-square rounded-3xl bg-white shadow-md border-b-[6px] ${c.border} p-3 flex flex-col active:translate-y-0.5 transition-transform`}
                >
                  <div className={`${c.soft} rounded-2xl flex-1 grid place-items-center text-4xl`}>
                    <span>{d.emoji}</span>
                  </div>
                  <div className="mt-2">
                    <p className="font-display font-extrabold text-deep-blue text-sm leading-tight">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{d.subject}</p>
                    <div className="mt-1.5 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bg}`} style={{ width: `${d.progress}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Comptines shortcut */}
        <Link
          to="/comptines"
          className="mt-4 flex items-center gap-3 bg-ocre/15 border border-ocre/30 rounded-3xl p-3 active:scale-[0.98] transition-transform"
        >
          <div className="size-11 rounded-2xl bg-ocre grid place-items-center text-xl">🎵</div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-extrabold text-deep-blue text-sm">Comptines & chansons</p>
            <p className="text-[11px] text-deep-blue/60">Chante en français et en anglais</p>
          </div>
          <ChevronRight className="size-5 text-deep-blue/40" />
        </Link>

        <div className="mt-4 text-center">
          <Link to="/parents" className="text-[11px] font-display font-bold text-muted-foreground underline underline-offset-2">
            Espace parent / enseignant
          </Link>
        </div>
      </div>

      <div className="h-4" />
      <BottomNav />
    </PhoneFrame>
  );
}
