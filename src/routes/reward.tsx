import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import { Sprout, Sparkles } from "lucide-react";

export const Route = createFileRoute("/reward")({
  component: Reward,
});

function Reward() {
  const { childName } = useKpodji();
  const navigate = useNavigate();

  return (
    <PhoneFrame dark>
      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-ocre animate-sparkle"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: 12 + (i % 3) * 6,
              height: 12 + (i % 3) * 6,
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-ocre blur-3xl opacity-50 animate-pulse" />
          <div className="relative size-48 rounded-full bg-gradient-to-br from-ocre to-terracotta grid place-items-center shadow-2xl">
            <Mascot size={140} float />
          </div>
        </div>

        <h1 className="font-display text-4xl font-extrabold text-white text-center mb-2">
          Bravo, {childName} !
        </h1>
        <p className="text-white/70 text-center leading-relaxed mb-6 text-balance">
          Tu as gagné <span className="font-extrabold text-ocre">10 graines de baobab</span>.
          Ton jardin grandit !
        </p>

        <div className="flex gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/10">
            <Sprout className="size-4 text-leaf" />
            <span className="font-display font-extrabold text-white">+10</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/10">
            <span className="text-lg">⭐</span>
            <span className="font-display font-extrabold text-white">+1</span>
          </div>
        </div>

        {/* Garden glimpse */}
        <Link to="/jardin" className="w-full bg-white/10 backdrop-blur rounded-3xl p-5 border border-white/10 active:scale-[0.98] transition-transform">
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre mb-3">Ton jardin</p>
          <div className="flex items-end justify-around gap-2 h-24">
            {[24, 40, 60, 32, 20].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-xl bg-gradient-to-t from-leaf to-leaf/50 animate-grow-up"
                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <div className="h-3 rounded-b-xl bg-terracotta/60 -mt-px" />
        </Link>
      </div>

      <div className="p-5 pb-8 relative z-10">
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full h-16 bg-white text-deep-blue rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide shadow-xl active:scale-[0.98]"
        >
          Retour au village
        </button>
      </div>
    </PhoneFrame>
  );
}
