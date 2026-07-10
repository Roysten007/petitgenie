import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/histoires")({
  component: HistoiresPage,
});

function HistoiresPage() {
  const { stories, lang } = useKpodji();
  const [playing, setPlaying] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const featured = stories[current];

  return (
    <PhoneFrame>
      <TopBar />
      <div className="px-5">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Bibliothèque</p>
        <h1 className="font-display text-2xl font-extrabold text-deep-blue">Histoires de Zao</h1>
      </div>

      {/* Featured player */}
      <div className="mx-5 mt-4 rounded-3xl bg-deep-blue text-deep-blue-foreground overflow-hidden relative shadow-xl">
        <div className="wax-dots absolute inset-0 opacity-30" />
        <div className="relative p-5">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrent((c) => (c - 1 + stories.length) % stories.length)}
              className="size-8 rounded-full bg-white/10 grid place-items-center"
              aria-label="Précédent"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="text-6xl">{featured.emoji}</div>
            <button
              onClick={() => setCurrent((c) => (c + 1) % stories.length)}
              className="size-8 rounded-full bg-white/10 grid place-items-center"
              aria-label="Suivant"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre mb-1">
            {featured.duration} · {lang === "fr" ? "Français" : "English"}
          </p>
          <h2 className="font-display text-xl font-extrabold mb-4 text-balance leading-tight">
            {featured.title[lang]}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying(playing === featured.id ? null : featured.id)}
              className="size-14 rounded-full bg-ocre text-deep-blue grid place-items-center shadow-lg active:scale-95 transition"
              aria-label={playing === featured.id ? "Pause" : "Play"}
            >
              {playing === featured.id ? <Pause className="size-6" fill="currentColor" /> : <Play className="size-6 ml-0.5" fill="currentColor" />}
            </button>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full bg-ocre ${playing === featured.id ? "w-1/2" : "w-0"} transition-all duration-500`} />
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-5 mt-5">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
          Toutes les histoires
        </p>
        <div className="space-y-2">
          {stories.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-white ring-1 ring-black/5 active:scale-[0.98] transition text-left ${
                current === i ? "ring-2 ring-terracotta" : ""
              }`}
            >
              <div className="size-12 rounded-2xl bg-ocre/15 grid place-items-center text-2xl shrink-0">{s.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-deep-blue text-sm truncate">{s.title[lang]}</p>
                <p className="text-[11px] text-muted-foreground">{s.duration} · 🇫🇷 🇬🇧</p>
              </div>
              <div className="size-10 rounded-full bg-terracotta grid place-items-center shrink-0">
                <Play className="size-4 text-white ml-0.5" fill="currentColor" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-6" />
      <BottomNav />
    </PhoneFrame>
  );
}
