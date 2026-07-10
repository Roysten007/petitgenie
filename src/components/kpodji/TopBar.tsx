import { Link } from "@tanstack/react-router";
import { Sprout, Flame } from "lucide-react";
import { useKpodji } from "@/lib/kpodji-store";

export function TopBar({ showStreak = true }: { showStreak?: boolean }) {
  const { seeds, streak, lang, setLang, avatar } = useKpodji();
  const faces = ["🙂", "😃", "😊", "🤗"];
  return (
    <div className="px-5 pt-12 pb-3 flex items-center justify-between gap-3 z-20">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5">
          <Sprout className="size-4 text-leaf" />
          <span className="font-display text-deep-blue text-sm font-extrabold tabular-nums">{seeds}</span>
        </div>
        {showStreak && (
          <div className="flex items-center gap-1 bg-terracotta/10 px-2.5 py-1.5 rounded-full">
            <Flame className="size-4 text-terracotta" />
            <span className="font-display text-terracotta text-sm font-extrabold">{streak}j</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          className="text-[11px] font-display font-extrabold uppercase tracking-widest bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-full shadow-sm ring-1 ring-black/5 text-deep-blue"
          aria-label="Changer de langue"
        >
          {lang === "fr" ? "FR · en" : "EN · fr"}
        </button>
        <Link to="/avatar" aria-label="Mon avatar">
          <div className="size-10 bg-ocre rounded-full border-2 border-white shadow flex items-center justify-center text-lg">
            {faces[avatar.face] ?? "🙂"}
          </div>
        </Link>
      </div>
    </div>
  );
}
