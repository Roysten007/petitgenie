import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { sfx } from "@/lib/sfx";
import { Mascot } from "@/components/kpodji/Mascot";

export const Route = createFileRoute("/alphabet")({
  component: AlphabetPage,
});

/* ─── Data ──────────────────────────────────────────────── */
const LETTERS = [
  {
    letter: "A",
    fr: "Ananas",
    en: "Pineapple",
    emoji: "🍍",
    color: "terracotta",
    hint: "A comme Ananas · A for Pineapple",
    dialogueFr: "Regarde cet ananas bien sucré ! En français, on dit 'A comme Ananas'.",
    dialogueEn: "And in English, my friend, we say 'A as in Pineapple'. Try to repeat after me: Pineapple!"
  },
  {
    letter: "B",
    fr: "Baobab",
    en: "Banana",
    emoji: "🌴",
    color: "leaf",
    hint: "B comme Baobab · B for Banana",
    dialogueFr: "Voici le grand baobab majestueux. 'B comme Baobab' est l'arbre de notre village.",
    dialogueEn: "In English, we also love the sweet 'B for Banana'! Let's sing: Banana!"
  },
  {
    letter: "C",
    fr: "Citron",
    en: "Coconut",
    emoji: "🍋",
    color: "ocre",
    hint: "C comme Citron · C for Coconut",
    dialogueFr: "Aïe, ce citron jaune est très acide ! 'C comme Citron' fait faire des grimaces !",
    dialogueEn: "But in English, let's open a fresh 'C for Coconut'. Mmm, coconut is sweet!"
  },
  {
    letter: "D",
    fr: "Dattes",
    en: "Dragon fruit",
    emoji: "🌴",
    color: "river",
    hint: "D comme Dattes · D for Dragon fruit",
    dialogueFr: "Ces dattes brunes du marché sont très douces. 'D comme Dattes'.",
    dialogueEn: "In English, discover the colorful 'D for Dragon fruit'! Say it: Dragon fruit!"
  },
  {
    letter: "E",
    fr: "Éléphant",
    en: "Elephant",
    emoji: "🐘",
    color: "terracotta",
    hint: "E comme Éléphant · E for Elephant",
    dialogueFr: "Écoute le barrissement ! 'E comme Éléphant', le géant de la forêt !",
    dialogueEn: "In English, it's also 'E for Elephant'! Let's trump: Elephant!"
  },
  { letter: "F", fr: "Figue",    en: "Fig",         emoji: "🍇", color: "leaf",       hint: "F comme Figue · F for Fig" },
  { letter: "G", fr: "Goyave",   en: "Guava",      emoji: "🍈", color: "ocre",       hint: "G comme Goyave · G for Guava" },
  { letter: "H", fr: "Hibiscus", en: "Hibiscus",   emoji: "🌺", color: "river",      hint: "H comme Hibiscus · H for Hibiscus" },
  { letter: "I", fr: "Igname",   en: "Iguana",     emoji: "🦎", color: "terracotta", hint: "I comme Igname · I for Iguana" },
  { letter: "J", fr: "Jus",      en: "Jackfruit",  emoji: "🧃", color: "leaf",       hint: "J comme Jus · J for Jackfruit" },
  { letter: "K", fr: "Kola",     en: "Kiwi",       emoji: "🥝", color: "ocre",       hint: "K comme Kola · K for Kiwi" },
  { letter: "L", fr: "Lime",     en: "Lemon",      emoji: "🍋", color: "river",      hint: "L comme Lime · L for Lemon" },
  { letter: "M", fr: "Mangue",   en: "Mango",      emoji: "🥭", color: "terracotta", hint: "M comme Mangue · M for Mango" },
  { letter: "N", fr: "Noix",     en: "Nut",        emoji: "🥜", color: "leaf",       hint: "N comme Noix · N for Nut" },
  { letter: "O", fr: "Orange",   en: "Orange",     emoji: "🍊", color: "ocre",       hint: "O comme Orange · O for Orange" },
  { letter: "P", fr: "Papaye",   en: "Papaya",     emoji: "🍈", color: "river",      hint: "P comme Papaye · P for Papaya" },
  { letter: "Q", fr: "Queue",    en: "Quince",     emoji: "🐒", color: "terracotta", hint: "Q comme Queue · Q for Quince" },
  { letter: "R", fr: "Raisin",   en: "Raspberry",  emoji: "🍇", color: "leaf",       hint: "R comme Raisin · R for Raspberry" },
  { letter: "S", fr: "Soleil",   en: "Strawberry", emoji: "☀️", color: "ocre",       hint: "S comme Soleil · S for Strawberry" },
  { letter: "T", fr: "Tomate",   en: "Tomato",     emoji: "🍅", color: "river",      hint: "T comme Tomate · T for Tomato" },
  { letter: "U", fr: "Ugli",     en: "Ugli fruit", emoji: "🍊", color: "terracotta", hint: "U comme Ugli · U for Ugli fruit" },
  { letter: "V", fr: "Vanille",  en: "Vanilla",    emoji: "🌿", color: "leaf",       hint: "V comme Vanille · V for Vanilla" },
  { letter: "W", fr: "Wari",     en: "Watermelon", emoji: "🍉", color: "ocre",       hint: "W comme Wari · W for Watermelon" },
  { letter: "X", fr: "Xylophone",en: "Xylophone",  emoji: "🎵", color: "river",      hint: "X comme Xylophone · X for Xylophone" },
  { letter: "Y", fr: "Yam",      en: "Yam",        emoji: "🍠", color: "terracotta", hint: "Y comme Yam · Y for Yam" },
  { letter: "Z", fr: "Zèbre",    en: "Zebra",      emoji: "🦓", color: "leaf",       hint: "Z comme Zèbre · Z for Zebra" },
];

const COLOR_STYLES: Record<string, { gradient: string; shadow: string; soft: string; text: string }> = {
  terracotta: {
    gradient: "linear-gradient(145deg, oklch(0.58 0.20 38) 0%, oklch(0.44 0.18 28) 100%)",
    shadow: "0 16px 48px oklch(0.58 0.20 38 / 55%)",
    soft: "oklch(0.58 0.20 38 / 12%)",
    text: "oklch(0.58 0.20 38)",
  },
  leaf: {
    gradient: "linear-gradient(145deg, oklch(0.52 0.16 148) 0%, oklch(0.38 0.14 160) 100%)",
    shadow: "0 16px 48px oklch(0.52 0.16 148 / 55%)",
    soft: "oklch(0.52 0.16 148 / 12%)",
    text: "oklch(0.52 0.16 148)",
  },
  ocre: {
    gradient: "linear-gradient(145deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 55) 100%)",
    shadow: "0 16px 48px oklch(0.76 0.18 78 / 50%)",
    soft: "oklch(0.76 0.18 78 / 12%)",
    text: "oklch(0.62 0.18 65)",
  },
  river: {
    gradient: "linear-gradient(145deg, oklch(0.62 0.15 228) 0%, oklch(0.42 0.14 255) 100%)",
    shadow: "0 16px 48px oklch(0.62 0.15 228 / 55%)",
    soft: "oklch(0.62 0.15 228 / 12%)",
    text: "oklch(0.48 0.16 228)",
  },
};

/* ─── Letter Card grande (mode focus) ───────────────────── */
function BigLetterCard({ item, lang }: { item: typeof LETTERS[0]; lang: "fr" | "en" }) {
  const [popped, setPopped] = useState(false);
  const cs = COLOR_STYLES[item.color];
  const word = lang === "fr" ? item.fr : item.en;

  const { speakQueue, isPlaying, stop } = useSpeechSynthesis();

  // Stop speech when letter changes
  useEffect(() => {
    return () => stop();
  }, [item, stop]);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (isPlaying) {
      stop();
      return;
    }

    // Use custom griot storytelling text if defined, otherwise fallback to simple spelling
    const frText = (item as any).dialogueFr || `${item.letter}, comme, ${item.fr}.`;
    const enText = (item as any).dialogueEn || `${item.letter}, as in, ${item.en}.`;

    speakQueue([
      { text: frText, lang: "fr" },
      { text: enText, lang: "en" }
    ]);
  };

  const handleTap = () => {
    setPopped(true);
    setTimeout(() => setPopped(false), 600);
    handleSpeak();
  };

  return (
    <div
      className="flex flex-col items-center gap-4 animate-fade-scale"
      onClick={handleTap}
    >
      {/* Main card */}
      <div
        className="relative w-full rounded-[2rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none"
        style={{
          height: 240,
          background: cs.gradient,
          boxShadow: cs.shadow,
        }}
      >
        {/* Kente overlay */}
        <div className="absolute inset-0 kente-pattern opacity-25" />
        {/* Shimmer */}
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        {/* Big Letter */}
        <div
          className={`font-display font-extrabold leading-none select-none transition-all duration-300 ${popped ? "scale-125" : "scale-100"}`}
          style={{
            fontSize: 120,
            color: "oklch(1 0 0 / 95%)",
            textShadow: "0 4px 20px oklch(0 0 0 / 30%)",
            lineHeight: 1,
          }}
        >
          {item.letter}
        </div>

        {/* Kid-friendly big round listen button */}
        <button
          onClick={handleSpeak}
          className={`absolute top-4 right-4 size-14 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
            isPlaying ? "scale-110 active:scale-95 hover:rotate-3" : "hover:scale-105 active:scale-95"
          }`}
          style={{
            background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 100%)",
            boxShadow: isPlaying 
              ? "0 0 25px oklch(0.76 0.18 78 / 80%), 0 8px 30px oklch(0 0 0 / 25%)" 
              : "0 8px 20px oklch(0 0 0 / 15%), inset 0 1px 0 oklch(1 0 0 / 35%)",
            border: "2.5px solid white",
          }}
          aria-label="Écouter la prononciation"
        >
          {isPlaying && (
            <div className="absolute inset-0 rounded-full animate-pulse-ring bg-ocre/35" />
          )}
          <Volume2 
            className={`size-6 text-white transition-transform ${isPlaying ? "animate-bounce" : ""}`} 
            strokeWidth={2.5} 
          />
        </button>

        {/* Bottom label */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8"
          style={{ background: "linear-gradient(to top, oklch(0 0 0 / 45%) 0%, transparent 100%)" }}
        >
          <p className="font-display font-extrabold text-white text-center text-xl leading-tight">
            {item.letter} — {word}
          </p>
        </div>
      </div>

      {/* Emoji + bilingual words */}
      <div className="flex items-center gap-5 w-full">
        {/* Emoji bubble */}
        <div
          className={`size-20 rounded-3xl grid place-items-center text-5xl shrink-0 animate-bounce-in transition-all duration-300 ${popped ? "scale-125 rotate-12" : "scale-100 rotate-0"}`}
          style={{
            background: cs.soft,
            border: `2px solid ${cs.text}30`,
            boxShadow: `0 4px 20px ${cs.text}20`,
          }}
        >
          {item.emoji}
        </div>

        {/* Words FR + EN */}
        <div className="flex-1">
          <div
            className={`rounded-2xl px-4 py-2 mb-2 transition-all duration-300 ${isPlaying ? "scale-102 shadow-sm" : ""}`}
            style={{ 
              background: cs.soft, 
              border: isPlaying ? `2px solid ${cs.text}` : `1.5px solid ${cs.text}25`
            }}
          >
            <p className="text-[10px] font-display font-extrabold uppercase tracking-widest mb-0.5" style={{ color: cs.text }}>🇫🇷 Français</p>
            <p className="font-display font-extrabold text-deep-blue text-lg leading-tight">{item.fr}</p>
          </div>
          <div
            className={`rounded-2xl px-4 py-2 transition-all duration-300 ${isPlaying ? "scale-102 shadow-sm" : ""}`}
            style={{ 
              background: "oklch(0.62 0.15 228 / 10%)", 
              border: isPlaying ? "2px solid oklch(0.62 0.15 228)" : "1.5px solid oklch(0.62 0.15 228 / 20%)" 
            }}
          >
            <p className="text-[10px] font-display font-extrabold uppercase tracking-widest mb-0.5 text-river">🇬🇧 English</p>
            <p className="font-display font-extrabold text-deep-blue text-lg leading-tight">{item.en}</p>
          </div>
        </div>
      </div>

      {/* Griot dialogue bubble */}
      <div className="w-full bg-[#E06500]/10 border border-[#E06500]/25 rounded-3xl p-4 flex gap-3 items-start animate-fade-in mt-2 relative">
        <Mascot size={56} variant={isPlaying ? "walk" : "idle"} animate={isPlaying ? "float" : "none"} className="shrink-0" />
        <div className="flex-1">
          <span className="text-[9px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">🎙️ Zao le Griot raconte...</span>
          <p className="font-display font-bold text-deep-blue text-xs leading-relaxed mt-0.5">
            {lang === "fr" 
              ? ((item as any).dialogueFr || `« Écoute attentivement ! En français, c'est '${item.letter} comme ${item.fr}'. »`)
              : ((item as any).dialogueEn || `“Listen closely! In English, it is '${item.letter} for ${item.en}'.”`)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini grid card ─────────────────────────────────────── */
function MiniCard({
  item,
  active,
  onClick,
}: {
  item: typeof LETTERS[0];
  active: boolean;
  onClick: () => void;
}) {
  const cs = COLOR_STYLES[item.color];
  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90 animate-pop-in relative overflow-hidden"
      style={{
        background: active ? cs.gradient : `${cs.soft}`,
        boxShadow: active ? cs.shadow.replace("48px", "20px").replace("55%", "50%") : "none",
        border: active ? "none" : `1.5px solid ${cs.text}20`,
      }}
    >
      {active && <div className="absolute inset-0 kente-pattern opacity-20" />}
      <span
        className="font-display font-extrabold leading-none relative z-10"
        style={{
          fontSize: 22,
          color: active ? "white" : cs.text,
        }}
      >
        {item.letter}
      </span>
      <span className="text-lg relative z-10">{item.emoji}</span>
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
function AlphabetPage() {
  const { lang } = useKpodji();
  const [current, setCurrent] = useState(0);
  const item = LETTERS[current];

  const prev = () => {
    setCurrent((c) => (c - 1 + LETTERS.length) % LETTERS.length);
    sfx.playTap();
  };
  const next = () => {
    setCurrent((c) => (c + 1) % LETTERS.length);
    sfx.playTap();
  };

  return (
    <PhoneFrame>
      <TopBar showStreak={false} />

      {/* Header */}
      <div className="px-4 flex items-center gap-3">
        <Link to="/" className="size-9 glass rounded-full grid place-items-center shrink-0 active:scale-90 transition-transform">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-terracotta">Chapitre 1</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue leading-tight">Lettres du Marché</h1>
        </div>
        {/* Progress pill */}
        <div className="ml-auto glass rounded-full px-3 py-1">
          <span className="font-display font-extrabold text-deep-blue text-sm tabular-nums">
            {current + 1}<span className="text-muted-foreground font-bold">/26</span>
          </span>
        </div>
      </div>

      {/* ── Big letter focus card ── */}
      <div className="px-4 mt-3">
        <BigLetterCard item={item} lang={lang} />
      </div>

      {/* ── Prev / Next nav ── */}
      <div className="px-4 mt-3 flex items-center gap-3">
        <button
          onClick={prev}
          className="flex-1 h-11 glass-card rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <ChevronLeft className="size-5 text-deep-blue" strokeWidth={2.5} />
          <span className="font-display font-bold text-deep-blue text-sm">
            {LETTERS[(current - 1 + 26) % 26].letter}
          </span>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1">
          {LETTERS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 16 : 5,
                height: 5,
                background: i === current
                  ? COLOR_STYLES[item.color].text
                  : "oklch(0.75 0.02 80)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform text-white"
          style={{
            background: COLOR_STYLES[item.color].gradient,
            boxShadow: COLOR_STYLES[item.color].shadow.replace("48px", "16px").replace("55%", "40%"),
          }}
        >
          <span className="font-display font-bold text-sm">
            {LETTERS[(current + 1) % 26].letter}
          </span>
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Mini alphabet grid ── */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
          Toutes les lettres
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {LETTERS.map((l, i) => (
            <MiniCard
              key={l.letter}
              item={l}
              active={i === current}
              onClick={() => {
                setCurrent(i);
                sfx.playTap();
              }}
            />
          ))}
        </div>
      </div>

      <div className="h-3" />
      <BottomNav />
    </PhoneFrame>
  );
}
