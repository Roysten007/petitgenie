import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { Play, Pause, ChevronLeft, ChevronRight, Music2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/histoires")({
  component: HistoiresPage,
});

const storyGradients: Record<string, string> = {
  ocre:       "linear-gradient(145deg, oklch(0.22 0.10 255) 0%, oklch(0.28 0.10 48) 100%)",
  terracotta: "linear-gradient(145deg, oklch(0.22 0.10 255) 0%, oklch(0.30 0.12 38) 100%)",
  river:      "linear-gradient(145deg, oklch(0.22 0.10 255) 0%, oklch(0.25 0.10 228) 100%)",
  leaf:       "linear-gradient(145deg, oklch(0.22 0.10 255) 0%, oklch(0.25 0.10 148) 100%)",
};

function HistoiresPage() {
  const { stories, lang } = useKpodji();
  const [current, setCurrent] = useState(0);
  const featured = stories[current];

  const [narrationLang, setNarrationLang] = useState<"fr" | "en">(lang);

  const {
    isPlaying,
    isPaused,
    currentSentenceIndex,
    totalSentences,
    speakText,
    pause,
    resume,
    stop,
  } = useSpeechSynthesis();

  // Stop speech when story changes
  useEffect(() => {
    stop();
  }, [current, stop]);

  // Keep narration language in sync with global store language on switch (if not actively playing)
  useEffect(() => {
    if (!isPlaying) {
      setNarrationLang(lang);
    }
  }, [lang, isPlaying]);

  const handlePlayPause = () => {
    sfx.playTap();
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      const text = narrationLang === "fr" ? featured.storyTextFr : featured.storyTextEn;
      if (text) {
        speakText(text, narrationLang);
      }
    }
  };

  const handleLanguageChange = (newLang: "fr" | "en") => {
    if (newLang === narrationLang) return;
    setNarrationLang(newLang);
    sfx.playTap();
    if (isPlaying) {
      const text = newLang === "fr" ? featured.storyTextFr : featured.storyTextEn;
      if (text) {
        speakText(text, newLang);
      }
    }
  };

  // Split text locally for rendering the story paragraphs
  const storyText = narrationLang === "fr" ? featured.storyTextFr : featured.storyTextEn;
  const storySentences = useMemo(() => {
    if (!storyText) return [];
    const matches = storyText.match(/[^.!?]+[.!?]+(\s|$)/g);
    return matches ? matches.map((s) => s.trim()) : [storyText];
  }, [storyText]);

  const progressPercent = totalSentences > 0 ? ((currentSentenceIndex + 1) / totalSentences) * 100 : 0;

  return (
    <PhoneFrame>
      <TopBar />

      {/* Header */}
      <div className="px-4">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Bibliothèque</p>
        <h1 className="font-display text-2xl font-extrabold text-deep-blue mt-0.5">Histoires de Zao</h1>
      </div>

      {/* Featured player */}
      <div
        className="mx-4 mt-4 rounded-3xl overflow-hidden relative transition-all duration-300"
        style={{
          background: storyGradients[featured.color] ?? storyGradients.ocre,
          boxShadow: isPlaying && !isPaused
            ? "0 25px 50px oklch(0.18 0.10 255 / 60%), 0 0 20px oklch(0.76 0.18 78 / 25%)"
            : "0 20px 60px oklch(0.18 0.10 255 / 50%), inset 0 1px 0 oklch(1 0 0 / 10%)",
        }}
      >
        <div className="wax-dots-light absolute inset-0 opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 30%), transparent)" }} />

        <div className="relative p-5">
          {/* Nav arrows + emoji */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                setCurrent((c) => (c - 1 + stories.length) % stories.length);
                sfx.playTap();
              }}
              className="size-9 rounded-full grid place-items-center transition-all active:scale-90 bg-white/10 border border-white/15"
              aria-label="Précédent"
            >
              <ChevronLeft className="size-4 text-white" />
            </button>

            {/* Story emoji — big and bouncy during playback */}
            <div
              className={`size-20 rounded-3xl grid place-items-center text-5xl transition-all duration-500 ${
                isPlaying && !isPaused ? "animate-breathe scale-105" : ""
              }`}
              style={{ background: "oklch(1 0 0 / 15%)", boxShadow: "0 4px 20px oklch(0.18 0.08 255 / 30%)" }}
            >
              {featured.emoji}
            </div>

            <button
              onClick={() => {
                setCurrent((c) => (c + 1) % stories.length);
                sfx.playTap();
              }}
              className="size-9 rounded-full grid place-items-center transition-all active:scale-90 bg-white/10 border border-white/15"
              aria-label="Suivant"
            >
              <ChevronRight className="size-4 text-white" />
            </button>
          </div>

          {/* Bilingual Narration Toggle (Separately for French/English) */}
          <div className="flex justify-center gap-1.5 mb-3.5">
            <button
              onClick={() => handleLanguageChange("fr")}
              className={`text-[10px] font-display font-extrabold px-3 py-1 rounded-full flex items-center gap-1 transition-all active:scale-95 ${
                narrationLang === "fr"
                  ? "bg-ocre text-deep-blue shadow-md scale-105"
                  : "bg-white/10 text-white/60 hover:bg-white/15"
              }`}
            >
              <span>🇫🇷</span> FR
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`text-[10px] font-display font-extrabold px-3 py-1 rounded-full flex items-center gap-1 transition-all active:scale-95 ${
                narrationLang === "en"
                  ? "bg-ocre text-deep-blue shadow-md scale-105"
                  : "bg-white/10 text-white/60 hover:bg-white/15"
              }`}
            >
              <span>🇬🇧</span> EN
            </button>
          </div>

          {/* Story info */}
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre mb-1 text-center">
            {featured.duration} · {narrationLang === "fr" ? "Français" : "English"}
          </p>
          <h2 className="font-display text-xl font-extrabold text-white text-balance leading-tight text-center mb-4">
            {featured.title[narrationLang]}
          </h2>

          {/* Player controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className={`size-14 rounded-full grid place-items-center transition-all active:scale-90 shrink-0 relative ${
                isPlaying && !isPaused ? "scale-105" : ""
              }`}
              style={{
                background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.62 0.20 60) 100%)",
                boxShadow: isPlaying && !isPaused
                  ? "0 0 20px oklch(0.76 0.18 78 / 85%)"
                  : "0 4px 16px oklch(0.76 0.18 78 / 55%)",
              }}
              aria-label={isPlaying && !isPaused ? "Pause" : "Play"}
            >
              {isPlaying && !isPaused && (
                <div className="absolute inset-0 rounded-full animate-pulse-ring bg-ocre/35" />
              )}
              {isPlaying && !isPaused ? (
                <Pause className="size-6 text-deep-blue animate-pulse" fill="currentColor" />
              ) : (
                <Play className="size-6 text-deep-blue ml-0.5" fill="currentColor" />
              )}
            </button>

            {/* Progress track */}
            <div className="flex-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 15%)" }}>
                <div
                  className={`h-full rounded-full transition-all duration-500`}
                  style={{
                    width: `${isPlaying ? progressPercent : 0}%`,
                    background: "linear-gradient(90deg, oklch(0.76 0.18 78), oklch(0.62 0.20 60))",
                    boxShadow: isPlaying && !isPaused ? "0 0 8px oklch(0.76 0.18 78 / 80%)" : "none",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-white/50 font-mono">
                  {isPlaying ? `${currentSentenceIndex + 1}/${totalSentences}` : "0/0"}
                </span>
                <span className="text-[9px] text-white/50 font-mono">{featured.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Read along card */}
      <div className="mx-4 mt-4 glass-card rounded-3xl p-4 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-muted-foreground">
            {narrationLang === "fr" ? "📖 Lire et Écouter" : "📖 Read & Listen"}
          </p>
          {isPlaying && !isPaused && (
            <span className="text-[9px] font-display font-bold text-leaf animate-pulse flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-leaf inline-block animate-ping" />
              {narrationLang === "fr" ? "Voix active..." : "Narrating..."}
            </span>
          )}
        </div>

        <div className="max-h-36 overflow-y-auto pr-1 text-sm font-display text-deep-blue/80 leading-relaxed font-semibold">
          {storySentences.length > 0 ? (
            <p>
              {storySentences.map((sentence, idx) => {
                const isActive = isPlaying && idx === currentSentenceIndex;
                return (
                  <span
                    key={idx}
                    className={`inline mr-1.5 px-1 py-0.5 rounded transition-all duration-300 ${
                      isActive
                        ? "bg-ocre/25 text-deep-blue font-extrabold scale-102 border-b-2 border-ocre shadow-xs inline-block animate-heartbeat"
                        : "opacity-60"
                    }`}
                  >
                    {sentence}
                  </span>
                );
              })}
            </p>
          ) : (
            <p className="italic opacity-60 text-center py-2 text-xs">
              {narrationLang === "fr"
                ? "Sélectionnez une histoire pour commencer."
                : "Select a story to begin."}
            </p>
          )}
        </div>
      </div>

      {/* Stories list */}
      <div className="px-4 mt-5">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2.5">
          Toutes les histoires
        </p>
        <div className="space-y-2">
          {stories.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrent(i);
                sfx.playTap();
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all active:scale-[0.98] ${
                current === i ? "" : "glass-card"
              }`}
              style={current === i ? {
                background: "linear-gradient(135deg, oklch(0.58 0.20 38 / 10%) 0%, oklch(0.76 0.18 78 / 8%) 100%)",
                border: "2px solid oklch(0.58 0.20 38 / 30%)",
                boxShadow: "0 4px 16px oklch(0.58 0.20 38 / 12%)",
              } : {}}
            >
              {/* Story icon */}
              <div
                className="size-12 rounded-2xl grid place-items-center text-2xl shrink-0"
                style={{ background: "oklch(0.76 0.18 78 / 15%)" }}
              >
                {s.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-deep-blue text-sm truncate">{s.title[lang]}</p>
                <p className="text-[11px] text-muted-foreground">{s.duration} · 🇫🇷 🇬🇧</p>
              </div>

              {/* Play button */}
              <div
                className="size-10 rounded-full grid place-items-center shrink-0"
                style={current === i ? {
                  background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.48 0.22 28) 100%)",
                  boxShadow: "0 4px 12px oklch(0.58 0.20 38 / 45%)",
                } : { background: "oklch(0.93 0.015 80)" }}
              >
                {current === i
                  ? <Music2 className="size-4 text-white" />
                  : <Play className="size-4 text-deep-blue/50 ml-0.5" fill="currentColor" />
                }
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-4" />
      <BottomNav />
    </PhoneFrame>
  );
}
