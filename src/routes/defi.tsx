import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { MascotBubble } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import { ArrowLeft, Flame, Zap, Star } from "lucide-react";

export const Route = createFileRoute("/defi")({
  component: DefiPage,
});

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

function DefiPage() {
  const { streak } = useKpodji();

  return (
    <PhoneFrame>
      <TopBar />

      {/* Header */}
      <div className="px-4 flex items-center gap-3">
        <Link
          to="/"
          className="size-9 glass rounded-full shadow-sm grid place-items-center transition-transform active:scale-90 shrink-0"
        >
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-terracotta">Aujourd'hui</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue leading-tight">Défi du jour</h1>
        </div>
      </div>

      {/* ── Mascot speech ── */}
      <div className="px-4 mt-3">
        <MascotBubble
          text="Salut ! Tu es prêt pour le défi d'aujourd'hui ? 💪"
          variant="default"
        />
      </div>

      {/* ── Hero card ── */}
      <div
        className="mx-4 mt-3 relative rounded-3xl overflow-hidden animate-fade-scale"
        style={{
          background: "linear-gradient(145deg, oklch(0.20 0.10 255) 0%, oklch(0.15 0.08 268) 100%)",
          boxShadow: "0 20px 60px oklch(0.18 0.10 255 / 55%), inset 0 1px 0 oklch(1 0 0 / 10%)",
        }}
      >
        <div className="wax-dots-light absolute inset-0 opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.76 0.18 78 / 70%), transparent)" }} />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="size-7 rounded-full grid place-items-center animate-glow-ocre"
                  style={{ background: "linear-gradient(135deg, oklch(0.82 0.18 85) 0%, oklch(0.62 0.20 60) 100%)" }}
                >
                  <Zap className="size-3.5 text-white" fill="currentColor" />
                </div>
                <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre">5 min · Maths & Langues</span>
              </div>
              <h2 className="font-display text-xl font-extrabold text-white leading-tight">
                Le mystère des mangues 🥭
              </h2>
              <p className="text-white/50 text-xs mt-1.5 leading-relaxed">
                Compte, additionne et gagne <span className="text-ocre font-bold">+15 graines</span> de baobab.
              </p>
            </div>

            {/* Stars to earn */}
            <div className="glass rounded-2xl px-3 py-2 flex flex-col items-center shrink-0">
              <Star className="size-5 text-ocre fill-ocre" />
              <span className="font-display font-extrabold text-white text-sm mt-0.5">+3</span>
            </div>
          </div>

          {/* Topics */}
          <div className="flex gap-2 flex-wrap">
            {["Comptage", "Addition", "Bilingue"].map((t) => (
              <span
                key={t}
                className="text-[10px] font-display font-bold px-2.5 py-1 rounded-full"
                style={{ background: "oklch(1 0 0 / 12%)", color: "oklch(1 0 0 / 75%)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Streak tracker ── */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
          Ta série de jours
        </p>

        <div className="glass-card rounded-3xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="size-14 rounded-2xl grid place-items-center animate-glow-terra"
              style={{
                background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.68 0.18 55) 100%)",
                boxShadow: "0 6px 24px oklch(0.58 0.20 38 / 50%)",
              }}
            >
              <Flame className="size-7 text-white" fill="currentColor" />
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-deep-blue leading-none">
                {streak} <span className="text-lg text-muted-foreground">jours</span>
              </p>
              <p className="text-[11px] text-muted-foreground font-bold mt-0.5">
                {streak === 0 ? "Lance ta première série aujourd'hui !" : "Continue, tu es incroyable ! 🔥"}
              </p>
            </div>
          </div>

          {/* Day dots */}
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((d, i) => {
              const done = i < streak;
              const today = i === streak;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-display font-extrabold text-muted-foreground">{d}</span>
                  <div
                    className={`size-9 rounded-xl grid place-items-center text-sm font-display font-extrabold transition-all ${
                      today ? "ring-2 ring-offset-1 ring-terracotta scale-110 animate-heartbeat" : ""
                    }`}
                    style={done ? {
                      background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.68 0.18 55) 100%)",
                      boxShadow: "0 3px 12px oklch(0.58 0.20 38 / 45%)",
                      color: "white",
                    } : today ? {
                      background: "oklch(0.76 0.18 78 / 20%)",
                      color: "oklch(0.58 0.20 38)",
                    } : {
                      background: "oklch(0.93 0.015 80)",
                      color: "oklch(0.7 0.02 80)",
                    }}
                  >
                    {done ? "🔥" : today ? "⚡" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Info tip ── */}
      <div className="px-4 mt-3">
        <div
          className="rounded-2xl p-3 flex items-start gap-2"
          style={{
            background: "linear-gradient(135deg, oklch(0.76 0.18 78 / 10%) 0%, oklch(0.58 0.20 38 / 6%) 100%)",
            border: "1px solid oklch(0.76 0.18 78 / 20%)",
          }}
        >
          <span className="text-base shrink-0">💡</span>
          <p className="text-[11px] text-deep-blue/70 font-bold leading-snug">
            Une série encourageante, jamais culpabilisante. Chaque jour compte, à ton rythme !
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="p-4 mt-auto">
        <Link
          to="/exercise/$district"
          params={{ district: "marche" }}
          className="w-full h-16 rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide text-white grid place-items-center active:scale-[0.98] transition-transform relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.48 0.22 28) 100%)",
            boxShadow: "0 8px 32px oklch(0.58 0.20 38 / 55%), inset 0 1px 0 oklch(1 0 0 / 20%)",
          }}
        >
          <span className="relative z-10">Commencer le défi ! ⚡</span>
          <div className="absolute inset-0 animate-shimmer opacity-60 pointer-events-none" />
        </Link>
      </div>
    </PhoneFrame>
  );
}
