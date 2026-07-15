import { Link } from "@tanstack/react-router";
import { Sprout, Flame, Star } from "lucide-react";
import { useKpodji } from "@/lib/kpodji-store";

export function TopBar({ showStreak = true }: { showStreak?: boolean }) {
  const { seeds, streak, stars, lang, setLang, avatar } = useKpodji();
  const faces = ["🙂", "😃", "😊", "🤗", "😎", "🤩"];

  return (
    <div className="px-3 pt-4 pb-1.5 flex items-center justify-between gap-2 z-20">
      {/* Stats row */}
      <div className="flex items-center gap-2">
        {/* Seeds pill */}
        <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 shadow-sm">
          <Sprout className="size-4 text-leaf" strokeWidth={2.5} />
          <span className="font-display text-deep-blue text-sm font-extrabold tabular-nums">{seeds}</span>
        </div>

        {/* Stars pill */}
        <div className="flex items-center gap-1 glass rounded-full px-2.5 py-1.5 shadow-sm">
          <Star className="size-4 text-ocre fill-ocre" strokeWidth={2} />
          <span className="font-display text-deep-blue text-sm font-extrabold tabular-nums">{stars}</span>
        </div>

        {/* Streak pill */}
        {showStreak && streak > 0 && (
          <div className="flex items-center gap-1 rounded-full px-2.5 py-1.5"
            style={{ background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.68 0.18 55) 100%)" }}
          >
            <Flame className="size-4 text-white" strokeWidth={2.5} />
            <span className="font-display text-white text-sm font-extrabold">{streak}j</span>
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Lang toggle */}
        <button
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          className="text-[11px] font-display font-extrabold uppercase tracking-widest glass rounded-full px-3 py-1.5 shadow-sm text-deep-blue transition-transform active:scale-95"
          aria-label="Changer de langue"
        >
          {lang === "fr" ? "FR · en" : "EN · fr"}
        </button>

        {/* Avatar */}
        <Link to="/avatar" aria-label="Mon avatar">
          <div className="relative size-10 rounded-full flex items-center justify-center text-lg"
            style={{
              background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 100%)",
              boxShadow: "0 0 0 2px white, 0 4px 12px oklch(0.58 0.20 38 / 40%)",
            }}
          >
            {faces[avatar.face] ?? "🙂"}
          </div>
        </Link>
      </div>
    </div>
  );
}
