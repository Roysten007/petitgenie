import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import { ArrowLeft, Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/defi")({
  component: DefiPage,
});

function DefiPage() {
  const { streak } = useKpodji();
  return (
    <PhoneFrame>
      <TopBar />
      <div className="px-5 flex items-center gap-3">
        <Link to="/" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <h1 className="font-display text-xl font-extrabold text-deep-blue">Défi du jour</h1>
      </div>

      <div className="mx-5 mt-4 relative rounded-3xl bg-deep-blue text-deep-blue-foreground p-6 overflow-hidden shadow-xl">
        <div className="wax-dots absolute inset-0 opacity-30" />
        <div className="relative flex items-center gap-4">
          <Mascot size={90} />
          <div>
            <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre">5 minutes</p>
            <h2 className="font-display text-xl font-extrabold leading-tight">Le mystère des mangues</h2>
            <p className="text-white/70 text-xs mt-1">Compter, additionner, gagner 15 graines.</p>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="px-5 mt-5">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
          Ta série
        </p>
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-14 rounded-full bg-terracotta grid place-items-center shadow-lg">
              <Flame className="size-7 text-white" fill="currentColor" />
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-terracotta leading-none">{streak} jours</p>
              <p className="text-[11px] text-muted-foreground font-bold">Continue, tu es incroyable !</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-display font-extrabold text-muted-foreground">{d}</span>
                <div
                  className={`size-8 rounded-xl grid place-items-center text-[10px] font-display font-extrabold ${
                    i < streak ? "bg-terracotta text-white" : i === streak ? "bg-ocre text-deep-blue ring-2 ring-terracotta" : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {i < streak ? "🔥" : i === streak ? "!" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-ocre/15 border border-ocre/30 rounded-2xl p-3 flex items-start gap-2">
          <Sparkles className="size-4 text-terracotta shrink-0 mt-0.5" />
          <p className="text-[11px] text-deep-blue font-bold leading-snug">
            Une série encourageante, jamais culpabilisante. Chaque jour compte, à ton rythme.
          </p>
        </div>
      </div>

      <div className="p-5 mt-auto">
        <Link
          to="/exercise/$district"
          params={{ district: "marche" }}
          className="w-full h-16 bg-terracotta text-terracotta-foreground rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide shadow-xl shadow-terracotta/30 active:scale-[0.98] grid place-items-center"
        >
          Commencer !
        </Link>
      </div>
    </PhoneFrame>
  );
}
