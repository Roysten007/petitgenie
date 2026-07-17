import mascotImg from "@/assets/mascot.png";
import mascotHappyImg from "@/assets/mascot_happy.jpg";
import mascotWalkImg from "@/assets/mascot_walk.jpg";
import mascotJumpImg from "@/assets/mascot_jump.jpg";
import mascotLandImg from "@/assets/mascot_land.jpg";
import mascotIdleImg from "@/assets/mascot_idle.jpg";

interface MascotProps {
  size?: number;
  className?: string;
  variant?: "default" | "happy" | "bounce" | "walk" | "jump" | "land" | "idle";
  animate?: "float" | "breathe" | "bounce" | "none" | "walk" | "jump" | "land" | "idle";
}

export function Mascot({
  size = 120,
  className = "",
  variant = "default",
  animate = "float",
}: MascotProps) {
  let src = mascotImg;
  if (variant === "happy") src = mascotHappyImg;
  else if (variant === "walk") src = mascotWalkImg;
  else if (variant === "jump") src = mascotJumpImg;
  else if (variant === "land") src = mascotLandImg;
  else if (variant === "idle") src = mascotIdleImg;

  const animClass =
    animate === "float"   ? "animate-float" :
    animate === "breathe" ? "animate-breathe" :
    animate === "bounce"  ? "animate-mascot-bounce" :
    animate === "jump"    ? "animate-bounce" : // standard bouncy animation for jumps
    animate === "walk"    ? "animate-pulse" :  // subtle pulse or side-to-side for walk
    "";

  return (
    <img
      src={src}
      alt="Petit Génie"
      width={size}
      height={size}
      className={`${animClass} select-none ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        mixBlendMode: "multiply",
        filter: "drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.15))",
      }}
      loading="lazy"
      draggable={false}
    />
  );
}

export function MascotBubble({
  text,
  className = "",
  variant = "default",
}: {
  text: string;
  className?: string;
  variant?: "default" | "happy";
}) {
  return (
    <div className={`flex items-end gap-2 animate-slide-up ${className}`}>
      <Mascot size={72} variant={variant} animate="breathe" />
      <div
        className="relative px-4 py-2.5 rounded-3xl rounded-bl-none max-w-[200px] mb-2 animate-pop-in"
        style={{
          background: "oklch(1 0 0 / 95%)",
          border: "1px solid oklch(0.76 0.18 78 / 30%)",
          boxShadow: "0 4px 20px oklch(0.58 0.20 38 / 15%)",
        }}
      >
        {/* Tail */}
        <div
          className="absolute -bottom-2 left-3 w-4 h-4"
          style={{
            background: "oklch(1 0 0 / 95%)",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            border: "1px solid oklch(0.76 0.18 78 / 30%)",
          }}
        />
        <p className="text-[12px] font-display font-bold text-deep-blue leading-tight relative z-10">{text}</p>
      </div>
    </div>
  );
}

/* Particules dorées autour du mascot */
export function MascotWithParticles({ size = 96 }: { size?: number }) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <Mascot size={size} animate="float" />
      {/* Sparkles */}
      {[
        { top: "5%",  left: "80%", delay: "0s",    s: 10 },
        { top: "20%", left: "10%", delay: "0.6s",  s: 7 },
        { top: "70%", left: "85%", delay: "1.1s",  s: 8 },
        { top: "80%", left: "15%", delay: "0.3s",  s: 6 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{ top: p.top, left: p.left, animationDelay: p.delay, animationIterationCount: "infinite" }}
        >
          <svg width={p.s} height={p.s} viewBox="0 0 10 10">
            <path d="M5 0 L5.5 4.5 L10 5 L5.5 5.5 L5 10 L4.5 5.5 L0 5 L4.5 4.5 Z"
              fill="oklch(0.85 0.18 80)" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* Anneau pulsant autour du mascot */
export function MascotRing({ size = 96, color = "terra" }: { size?: number; color?: "terra" | "ocre" | "leaf" }) {
  const ringColor =
    color === "terra" ? "oklch(0.58 0.20 38 / 40%)" :
    color === "ocre"  ? "oklch(0.76 0.18 78 / 40%)" :
                        "oklch(0.52 0.16 148 / 40%)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size + 24, height: size + 24 }}>
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${ringColor}` }} />
      <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${ringColor}`, animationDelay: "0.4s" }} />
      <Mascot size={size} animate="breathe" />
    </div>
  );
}
