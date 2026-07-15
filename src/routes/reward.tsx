import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import { Sprout, Star } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/reward")({
  component: Reward,
});

/* Mini confetti particle */
function Confetti({ index }: { index: number }) {
  const colors = [
    "oklch(0.76 0.18 78)",
    "oklch(0.58 0.20 38)",
    "oklch(0.52 0.16 148)",
    "oklch(0.62 0.15 228)",
    "oklch(0.90 0.18 90)",
  ];
  const color = colors[index % colors.length];
  const size = 6 + (index % 5) * 3;
  const left = `${(index * 7 + 5) % 95}%`;
  const delay = `${(index * 0.15) % 1.8}s`;
  const duration = `${1.6 + (index % 4) * 0.4}s`;
  const shape = index % 3 === 0 ? "50%" : index % 3 === 1 ? "2px" : "0%";

  return (
    <div
      className="absolute top-0"
      style={{
        left,
        width: size,
        height: size * 1.4,
        background: color,
        borderRadius: shape,
        animation: `confetti-drop ${duration} ease-in ${delay} infinite`,
        opacity: 0.9,
      }}
    />
  );
}

/* Sparkle star */
function SparkStar({ index }: { index: number }) {
  return (
    <div
      className="absolute animate-sparkle"
      style={{
        top: `${(index * 37) % 85}%`,
        left: `${(index * 53) % 90}%`,
        animationDelay: `${index * 0.22}s`,
        animationIterationCount: "infinite",
      }}
    >
      <svg width={10 + (index % 3) * 8} height={10 + (index % 3) * 8} viewBox="0 0 12 12">
        <path
          d="M6 0 L6.8 5.2 L12 6 L6.8 6.8 L6 12 L5.2 6.8 L0 6 L5.2 5.2 Z"
          fill={["oklch(0.85 0.18 80)", "oklch(0.78 0.18 55)", "oklch(1 0 0)"][index % 3]}
        />
      </svg>
    </div>
  );
}

function Reward() {
  const { childName } = useKpodji();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <PhoneFrame dark>
      {/* ── Background particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Confetti rain */}
        {Array.from({ length: 24 }).map((_, i) => <Confetti key={i} index={i} />)}
        {/* Star sparkles */}
        {Array.from({ length: 12 }).map((_, i) => <SparkStar key={i} index={i} />)}
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.76 0.18 78 / 20%) 0%, transparent 70%)", filter: "blur(20px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.58 0.20 38 / 20%) 0%, transparent 70%)", filter: "blur(16px)" }} />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 gap-6">

        {/* Mascot hero */}
        <div
          className={`relative transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          {/* Glow halo */}
          <div
            className="absolute inset-[-20px] rounded-full animate-glow-ocre"
            style={{ background: "radial-gradient(circle, oklch(0.76 0.18 78 / 30%) 0%, transparent 70%)" }}
          />
          {/* Circle bg */}
          <div
            className="size-48 rounded-full grid place-items-center relative"
            style={{
              background: "linear-gradient(145deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 60%, oklch(0.40 0.18 28) 100%)",
              boxShadow: "0 0 0 6px oklch(1 0 0 / 15%), 0 20px 60px oklch(0.58 0.20 38 / 60%)",
            }}
          >
            <Mascot size={140} variant="happy" animate="bounce" />
          </div>
        </div>

        {/* Text */}
        <div className={`text-center transition-all duration-500 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="font-display text-4xl font-extrabold text-white leading-tight">
            Bravo, <span className="text-gradient-sun">{childName}</span> !
          </h1>
          <p className="text-white/65 mt-2 leading-relaxed text-balance text-sm">
            Tu as terminé l'exercice et gagné<br />
            <span className="font-extrabold text-ocre text-base">10 graines de baobab</span>. 🌱
          </p>
        </div>

        {/* Rewards pills */}
        <div
          className={`flex gap-3 transition-all duration-500 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {[
            { icon: <Sprout className="size-5 text-leaf" />, label: "+10 graines" },
            { icon: <Star className="size-5 text-ocre fill-ocre" />, label: "+1 étoile" },
            { icon: <span className="text-lg">🔥</span>, label: "Série !" },
          ].map(({ icon, label }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 glass rounded-2xl px-4 py-3 animate-bounce-in"
              style={{ animationDelay: `${0.5 + i * 0.12}s` }}
            >
              {icon}
              <span className="font-display font-extrabold text-white text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* Garden preview */}
        <Link
          to="/jardin"
          className={`w-full glass-dark rounded-3xl p-4 active:scale-[0.98] transition-all duration-500 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre mb-3">Ton jardin</p>
          <div className="flex items-end justify-around gap-1 h-20">
            {[28, 45, 65, 38, 22, 55, 18].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-xl animate-grow-up"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, oklch(0.52 0.16 148) 0%, oklch(0.65 0.16 155) 100%)`,
                  boxShadow: "0 -2px 8px oklch(0.52 0.16 148 / 40%)",
                  animationDelay: `${0.7 + i * 0.08}s`,
                }}
              />
            ))}
          </div>
          <div className="h-2.5 rounded-b-xl mt-0" style={{ background: "oklch(0.42 0.12 42)" }} />
        </Link>
      </div>

      {/* ── CTA ── */}
      <div className="p-5 pb-8 relative z-10">
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full h-16 rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide text-deep-blue relative overflow-hidden active:scale-[0.98] transition-transform animate-slide-up"
          style={{
            background: "linear-gradient(135deg, oklch(0.95 0.10 85) 0%, oklch(0.82 0.18 75) 100%)",
            boxShadow: "0 8px 32px oklch(0.76 0.18 78 / 50%), inset 0 1px 0 oklch(1 0 0 / 40%)",
            animationDelay: "0.9s",
          }}
        >
          <span className="relative z-10">Retour au village 🌳</span>
          <div className="absolute inset-0 animate-shimmer opacity-60 pointer-events-none" />
        </button>
      </div>
    </PhoneFrame>
  );
}
