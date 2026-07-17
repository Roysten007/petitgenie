import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji, type Story } from "@/lib/kpodji-store";
import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/comptines")({
  component: ComptinesPage,
});

const gradients = [
  "from-[#E06500] to-[#a34e36]",
  "from-[#a34e36] to-[#489e28]",
  "from-[#1cb0f6] to-[#489e28]",
  "from-[#489e28] to-[#E06500]"
];

function ComptinesPage() {
  const { rhymes, lang } = useKpodji();
  const [selectedRhyme, setSelectedRhyme] = useState<Story | null>(null);
  
  const { 
    isPlaying, 
    isPaused, 
    speakText, 
    pause, 
    resume, 
    stop 
  } = useSpeechSynthesis();

  const handlePlayRhyme = (rhyme: Story) => {
    sfx.playTap();
    setSelectedRhyme(rhyme);
    const lyrics = lang === "fr" ? rhyme.storyTextFr : rhyme.storyTextEn;
    if (lyrics) {
      speakText(lyrics, lang);
    }
  };

  const handleClosePlayer = () => {
    sfx.playTap();
    stop();
    setSelectedRhyme(null);
  };

  const handleTogglePlayPause = () => {
    sfx.playTap();
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else if (selectedRhyme) {
      const lyrics = lang === "fr" ? selectedRhyme.storyTextFr : selectedRhyme.storyTextEn;
      if (lyrics) {
        speakText(lyrics, lang);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <PhoneFrame>
      <TopBar showStreak={false} />
      
      <div className="px-5 flex items-center gap-3">
        <Link to="/" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center active:scale-90 transition-transform">
          <i className="fa-solid fa-arrow-left text-deep-blue" />
        </Link>
        <div>
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-[#a34e36]">Chanter en route</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue leading-tight">Chansons de Voyage</h1>
        </div>
      </div>

      <div className="px-5 mt-2">
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          Petit Génie adore fredonner sous l'ombre du grand baobab. Écoute ces mélodies traditionnelles pour te reposer entre deux chapitres ! 🌳🎵
        </p>
      </div>

      {/* Rhymes grid */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-24">
        {rhymes.map((r, i) => {
          const isCurrent = selectedRhyme?.id === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handlePlayRhyme(r)}
              className={`aspect-square rounded-3xl bg-gradient-to-br ${gradients[i % gradients.length]} p-4 flex flex-col justify-between text-white shadow-lg active:scale-[0.98] transition-all text-left relative overflow-hidden ring-offset-2 ${isCurrent ? 'ring-4 ring-ocre scale-[0.97]' : ''}`}
            >
              <div className="wax-stripes absolute inset-0 opacity-20" />
              <div className="relative flex justify-between items-start">
                <div className="text-5xl">{r.emoji}</div>
                {isCurrent && isPlaying && !isPaused && (
                  <div className="flex gap-0.5 items-end h-4 mt-2">
                    <span className="w-1 bg-white rounded-full animate-[music-wave_0.8s_ease-in-out_infinite_alternate]" />
                    <span className="w-1 bg-white rounded-full animate-[music-wave_0.5s_ease-in-out_infinite_alternate_0.2s] h-3" />
                    <span className="w-1 bg-white rounded-full animate-[music-wave_0.7s_ease-in-out_infinite_alternate_0.4s]" />
                  </div>
                )}
              </div>
              <div className="relative">
                <p className="font-display font-extrabold text-xs uppercase tracking-wider opacity-90 mb-0.5">Comptine</p>
                <p className="font-display font-extrabold text-sm leading-tight text-balance">{r.title[lang]}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold opacity-80">{r.duration}</span>
                  <div className="size-8 rounded-full bg-white grid place-items-center text-deep-blue hover:scale-105 active:scale-95 transition-transform shadow">
                    {isCurrent && isPlaying && !isPaused ? (
                      <i className="fa-solid fa-pause text-xs" />
                    ) : (
                      <i className="fa-solid fa-play text-xs ml-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Audio Player Modal */}
      {selectedRhyme && (
        <div className="absolute inset-x-4 bottom-20 bg-white ring-1 ring-black/10 rounded-3xl p-5 shadow-2xl z-50 animate-slide-up flex flex-col gap-4 border-2 border-ocre/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedRhyme.emoji}</span>
              <div>
                <p className="text-[9px] font-display font-extrabold text-[#a34e36] uppercase tracking-widest">En lecture</p>
                <h3 className="font-display font-extrabold text-sm text-deep-blue">{selectedRhyme.title[lang]}</h3>
              </div>
            </div>
            <button 
              onClick={handleClosePlayer}
              className="size-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition active:scale-90"
            >
              <i className="fa-solid fa-xmark text-neutral-500 text-sm" />
            </button>
          </div>

          {/* Lyrics Box */}
          <div className="bg-neutral-50 rounded-2xl p-4 max-h-28 overflow-y-auto border border-neutral-100 shadow-inner">
            <p className="text-xs font-display font-bold text-neutral-700 leading-relaxed text-center italic">
              {lang === "fr" ? selectedRhyme.storyTextFr : selectedRhyme.storyTextEn}
            </p>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-between px-2">
            {/* Visualizer animation */}
            <div className="flex gap-1 items-end h-6 w-16">
              {isPlaying && !isPaused ? (
                <>
                  <span className="w-1 bg-ocre rounded-full animate-[music-wave_0.8s_ease-in-out_infinite_alternate] h-2" />
                  <span className="w-1 bg-[#a34e36] rounded-full animate-[music-wave_0.5s_ease-in-out_infinite_alternate_0.2s] h-4" />
                  <span className="w-1 bg-leaf rounded-full animate-[music-wave_0.7s_ease-in-out_infinite_alternate_0.4s] h-3" />
                  <span className="w-1 bg-river rounded-full animate-[music-wave_0.6s_ease-in-out_infinite_alternate_0.1s] h-5" />
                </>
              ) : (
                <>
                  <span className="w-1 bg-neutral-300 rounded-full h-1" />
                  <span className="w-1 bg-neutral-300 rounded-full h-2" />
                  <span className="w-1 bg-neutral-300 rounded-full h-1" />
                  <span className="w-1 bg-neutral-300 rounded-full h-1.5" />
                </>
              )}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlayPause}
              className="size-12 rounded-full bg-ocre hover:bg-ocre/90 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:scale-105"
            >
              {isPlaying && !isPaused ? (
                <i className="fa-solid fa-pause text-lg" />
              ) : (
                <i className="fa-solid fa-play text-lg ml-1" />
              )}
            </button>

            {/* Stop button */}
            <button
              onClick={handleClosePlayer}
              className="size-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center active:scale-95 transition-transform"
              title="Arrêter"
            >
              <i className="fa-solid fa-stop text-sm" />
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </PhoneFrame>
  );
}
