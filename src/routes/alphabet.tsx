import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { useState, useEffect, useMemo } from "react";
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
    dialogueFr: "Regarde cet ananas doré ! Petit Génie le pointe du doigt. En français, on chante A comme Ananas ! Répète après moi : Ananas !",
    dialogueEn: "And in English, my friend, we name it A for Pineapple! Can you say: Pineapple?"
  },
  {
    letter: "B",
    fr: "Baobab",
    en: "Banana",
    emoji: "🌴",
    color: "leaf",
    hint: "B comme Baobab · B for Banana",
    dialogueFr: "Le grand baobab veille sur la place. Petit Génie tape sur son tronc géant. B comme Baobab !",
    dialogueEn: "In English, look at this yellow fruit: B for Banana! Say it with me: Banana!"
  },
  {
    letter: "C",
    fr: "Citron",
    en: "Coconut",
    emoji: "🍋",
    color: "ocre",
    hint: "C comme Citron · C for Coconut",
    dialogueFr: "Aïe ! Petit Génie fait une grimace en goûtant ce citron acide ! C comme Citron !",
    dialogueEn: "But in English, let's open a fresh C for Coconut! Try to repeat: Coconut!"
  },
  {
    letter: "D",
    fr: "Dattes",
    en: "Dragon fruit",
    emoji: "🌴",
    color: "river",
    hint: "D comme Dattes · D for Dragon fruit",
    dialogueFr: "Petit Génie te tend de douces dattes brunes du marché. D comme Dattes !",
    dialogueEn: "In English, discover the colorful D for Dragon fruit! Repeat: Dragon fruit!"
  },
  {
    letter: "E",
    fr: "Éléphant",
    en: "Elephant",
    emoji: "🐘",
    color: "terracotta",
    hint: "E comme Éléphant · E for Elephant",
    dialogueFr: "Regarde ce gros éléphant qui passe ! Petit Génie imite son barrissement. E comme Éléphant !",
    dialogueEn: "And in English, it is also E for Elephant! Let's trump: Elephant!"
  },
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

interface QuizQuestion {
  level: number;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  audioText: string;
}

const quizQuestions: Record<1 | 2 | 3, QuizQuestion[]> = {
  1: [
    { level: 1, prompt: "Quelle lettre commence le mot Ananas 🍍 ?", choices: ["A", "B", "C", "D"], answer: "A", hint: "Rappelle-toi : A comme Ananas !", audioText: "Quelle lettre commence le mot Ananas ?" },
    { level: 1, prompt: "B comme Baobab 🌴 commence par quelle lettre ?", choices: ["A", "B", "C", "E"], answer: "B", hint: "Regarde bien : B pour Baobab !", audioText: "B comme Baobab commence par quelle lettre ?" },
    { level: 1, prompt: "Quelle lettre correspond à l'Éléphant 🐘 ?", choices: ["D", "C", "E", "B"], answer: "E", hint: "Écoute Petit Génie : E comme Éléphant !", audioText: "Quelle lettre correspond à l'Éléphant ?" },
    { level: 1, prompt: "Quelle lettre commence le mot Cacao 🍫 ?", choices: ["A", "B", "C", "D"], answer: "C", hint: "C comme Cacao !", audioText: "Quelle lettre commence le mot Cacao ?" },
    { level: 1, prompt: "D comme Datte 🌴 commence par quelle lettre ?", choices: ["A", "B", "C", "D"], answer: "D", hint: "Regarde bien : D pour Datte !", audioText: "D comme Datte commence par quelle lettre ?" },
  ],
  2: [
    { level: 2, prompt: "Comment dit-on 'Banane' en anglais ?", choices: ["Banana", "Apple", "Mango", "Date"], answer: "Banana", hint: "Banane se dit Banana en anglais !", audioText: "Comment dit-on Banane en anglais ?" },
    { level: 2, prompt: "Que signifie 'Pineapple' 🍍 en français ?", choices: ["Ananas", "Citron", "Dattes", "Baobab"], answer: "Ananas", hint: "L'ananas se dit Pineapple en anglais !", audioText: "Que signifie Pineapple en français ?" },
    { level: 2, prompt: "Que signifie 'Coconut' 🥥 en français ?", choices: ["Noix de coco", "Citron", "Dattes", "Mangue"], answer: "Noix de coco", hint: "Coconut est la noix de coco !", audioText: "Que signifie Coconut en français ?" },
    { level: 2, prompt: "Que signifie 'Apple' 🍎 en français ?", choices: ["Pomme", "Banane", "Orange", "Citron"], answer: "Pomme", hint: "Apple se traduit par Pomme !", audioText: "Que signifie Apple en français ?" },
    { level: 2, prompt: "Que signifie 'Lemon' 🍋 en français ?", choices: ["Citron", "Mangue", "Noix de coco", "Orange"], answer: "Citron", hint: "Lemon est un citron jaune !", audioText: "Que signifie Lemon en français ?" },
  ],
  3: [
    { level: 3, prompt: "Quel mot commence par le même son que 'Dragon fruit' 🌴 ?", choices: ["Ananas", "Baobab", "Citron", "Dattes"], answer: "Dattes", hint: "Dragon fruit et Dattes commencent par la lettre D !", audioText: "Quel mot commence par le même son que Dragon fruit ?" },
    { level: 3, prompt: "Quel fruit commence par le son 'P' en anglais (Pineapple) ?", choices: ["Ananas", "Banane", "Citron", "Dattes"], answer: "Ananas", hint: "Pineapple commence par le son P !", audioText: "Quel fruit commence par le son P en anglais ?" },
    { level: 3, prompt: "Dans 'Elephant' 🐘, quelle est la première lettre ?", choices: ["E", "A", "I", "O"], answer: "E", hint: "Elephant s'écrit avec un E !", audioText: "Dans Elephant, quelle est la première lettre ?" },
    { level: 3, prompt: "Quel mot commence par le même son que 'Carrot' 🥕 ?", choices: ["Cacao", "Ananas", "Dattes", "Baobab"], answer: "Cacao", hint: "Carrot et Cacao commencent par le son K (lettre C) !", audioText: "Quel mot commence par le même son que Carrot ?" },
    { level: 3, prompt: "Quel fruit commence par le son 'M' en anglais ?", choices: ["Mango 🥭", "Banana 🍌", "Apple 🍎", "Lemon 🍋"], answer: "Mango 🥭", hint: "Mango (mangue) commence par la lettre M !", audioText: "Quel fruit commence par le son M en anglais ?" },
  ],
};

function BigLetterCard({ item, lang }: { item: typeof LETTERS[0]; lang: "fr" | "en" }) {
  const [popped, setPopped] = useState(false);
  const cs = COLOR_STYLES[item.color] || COLOR_STYLES.ocre;
  const word = lang === "fr" ? item.fr : item.en;
  const { speakQueue, isPlaying, stop } = useSpeechSynthesis();

  useEffect(() => {
    return () => stop();
  }, [item, stop]);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      stop();
      return;
    }
    const frText = item.dialogueFr || `${item.letter}, comme, ${item.fr}.`;
    const enText = item.dialogueEn || `${item.letter}, as in, ${item.en}.`;
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
    <div className="flex flex-col items-center gap-4 animate-fade-scale" onClick={handleTap}>
      <div
        className="relative w-full rounded-[2rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none"
        style={{ height: 220, background: cs.gradient, boxShadow: cs.shadow }}
      >
        <div className="absolute inset-0 kente-pattern opacity-25" />
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />
        <div
          className={`font-display font-extrabold leading-none select-none transition-all duration-300 ${popped ? "scale-125" : "scale-100"}`}
          style={{ fontSize: 110, color: "oklch(1 0 0 / 95%)", textShadow: "0 4px 20px oklch(0 0 0 / 30%)", lineHeight: 1 }}
        >
          {item.letter}
        </div>
        <button
          onClick={handleSpeak}
          className={`absolute top-4 right-4 size-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isPlaying ? "scale-110" : "hover:scale-105"
          }`}
          style={{
            background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 100%)",
            border: "2.5px solid white",
          }}
        >
          <i className={`fa-solid fa-volume-high text-white text-base ${isPlaying ? "animate-bounce" : ""}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8" style={{ background: "linear-gradient(to top, oklch(0 0 0 / 45%) 0%, transparent 100%)" }}>
          <p className="font-display font-extrabold text-white text-center text-xl leading-tight">
            {item.letter} — {word}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full">
        <div
          className="size-16 rounded-2xl grid place-items-center text-4xl shrink-0"
          style={{ background: cs.soft, border: `2px solid ${cs.text}30` }}
        >
          {item.emoji}
        </div>
        <div className="flex-1 space-y-1">
          <div className="rounded-xl px-3 py-1.5 bg-black/5">
            <span className="text-[8px] font-display font-extrabold uppercase text-[#E06500]">🇫🇷 FR</span>
            <p className="font-display font-extrabold text-deep-blue text-sm">{item.fr}</p>
          </div>
          <div className="rounded-xl px-3 py-1.5 bg-black/5">
            <span className="text-[8px] font-display font-extrabold uppercase text-[#1cb0f6]">🇬🇧 EN</span>
            <p className="font-display font-extrabold text-deep-blue text-sm">{item.en}</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#E06500]/10 border border-[#E06500]/25 rounded-3xl p-4 flex gap-3 items-start relative mt-1">
        <Mascot size={56} variant={isPlaying ? "walk" : "idle"} animate={isPlaying ? "float" : "none"} className="shrink-0" />
        <div className="flex-1">
          <span className="text-[8px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">🎙️ Petit Génie raconte...</span>
          <p className="font-display font-bold text-deep-blue text-[11px] leading-relaxed mt-0.5">
            {lang === "fr" ? item.dialogueFr : item.dialogueEn}
          </p>
        </div>
      </div>
    </div>
  );
}

function AlphabetPage() {
  const { lang, levelAlphabet, updateLevel, addXp } = useKpodji();
  const navigate = useNavigate();
  const { speakQueue, isPlaying, stop } = useSpeechSynthesis();

  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [current, setCurrent] = useState(0);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(levelAlphabet || 1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streakCorrect, setStreakCorrect] = useState(0);
  const [streakIncorrect, setStreakIncorrect] = useState(0);
  const [speechBubble, setSpeechBubble] = useState("");

  const item = LETTERS[current];

  // Generate question based on current dynamic level
  const currentQuestion = useMemo(() => {
    const list = quizQuestions[currentLevel];
    return list[quizStep % list.length];
  }, [currentLevel, quizStep]);

  useEffect(() => {
    if (mode === "quiz") {
      setSpeechBubble(currentQuestion.prompt);
      speakQueue([{ text: currentQuestion.audioText, lang: "fr" }]);
    }
  }, [currentQuestion, mode, speakQueue]);

  const handleSpeakQuestion = () => {
    speakQueue([{ text: currentQuestion.audioText, lang: "fr" }]);
  };

  const handleChoice = (choice: string) => {
    if (isAnswered) return;
    sfx.playTap();
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const isRight = choice === currentQuestion.answer;
    if (isRight) {
      sfx.playCorrect();
      addXp(currentLevel * 10);
      const newStreak = streakCorrect + 1;
      setStreakCorrect(newStreak);
      setStreakIncorrect(0);

      if (newStreak === 3) {
        if (currentLevel < 3) {
          const nextLvl = (currentLevel + 1) as 1 | 2 | 3;
          setCurrentLevel(nextLvl);
          updateLevel("alphabet", nextLvl);
          setSpeechBubble("Incroyable ! Tu es très fort, on passe au niveau supérieur ! 🌟");
          speakQueue([{ text: "Incroyable ! Tu es très fort, on passe au niveau supérieur !", lang: "fr" }]);
        } else {
          setSpeechBubble("Merveilleux ! Tu maîtrises parfaitement les sons ! 👑");
        }
        setStreakCorrect(0);
      } else {
        setSpeechBubble("C'est ça, bravo ! 🤝");
      }
    } else {
      sfx.playWrong();
      const newWrong = streakIncorrect + 1;
      setStreakIncorrect(newWrong);
      setStreakCorrect(0);

      if (newWrong === 2) {
        if (currentLevel > 1) {
          const prevLvl = (currentLevel - 1) as 1 | 2 | 3;
          setCurrentLevel(prevLvl);
          updateLevel("alphabet", prevLvl);
          setSpeechBubble(`Ne t'inquiète pas, reprenons doucement ensemble. ${currentQuestion.hint}`);
          speakQueue([{ text: `Ne t'inquiète pas, reprenons doucement ensemble. ${currentQuestion.hint}`, lang: "fr" }]);
        } else {
          setSpeechBubble(`Regardons de plus près. ${currentQuestion.hint}`);
          speakQueue([{ text: currentQuestion.hint, lang: "fr" }]);
        }
        setStreakIncorrect(0);
      } else {
        setSpeechBubble(`Presque ! Petit indice : ${currentQuestion.hint}`);
        speakQueue([{ text: currentQuestion.hint, lang: "fr" }]);
      }
    }
  };

  const handleNextQuiz = () => {
    if (quizStep === 4) {
      // End of Quiz, redirect to the "Raconte à quelqu'un" gateway!
      navigate({ to: "/raconte/$chapter", params: { chapter: "alphabet" } });
    } else {
      setQuizStep((s) => s + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <PhoneFrame>
      <TopBar showStreak={false} />

      {/* Header */}
      <div className="px-4 flex items-center gap-3">
        <button
          onClick={() => {
            if (mode === "quiz") {
              setMode("learn");
            } else {
              navigate({ to: "/" });
            }
          }}
          className="size-9 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center active:scale-90"
        >
          <i className="fa-solid fa-arrow-left text-deep-blue text-sm" />
        </button>
        <div>
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-terracotta">
            {mode === "learn" ? "Chapitre 1 : Leçon" : "Chapitre 1 : Défi"}
          </p>
          <h1 className="font-display text-sm font-extrabold text-deep-blue leading-tight">
            {mode === "learn" ? "Les Lettres de Petit Génie" : "Défi de Sagesse"}
          </h1>
        </div>

        {/* Progress pill in learn mode */}
        {mode === "learn" && (
          <div className="ml-auto bg-black/5 rounded-full px-3 py-1 text-xs font-display font-extrabold text-deep-blue">
            {current + 1} / {LETTERS.length}
          </div>
        )}

        {/* Level Badge in Quiz */}
        {mode === "quiz" && (
          <div className="ml-auto bg-ocre text-white text-[9px] font-display font-extrabold uppercase tracking-wider px-2 py-1 rounded-full animate-pulse shadow-sm">
            Niveau {currentLevel}
          </div>
        )}
      </div>

      {mode === "learn" ? (
        /* ─── LEARNING MODE ─── */
        <>
          <div className="px-4 mt-3">
            <BigLetterCard item={item} lang={lang} />
          </div>

          <div className="px-4 mt-4 flex items-center gap-3">
            <button
              onClick={() => setCurrent((c) => (c - 1 + LETTERS.length) % LETTERS.length)}
              className="flex-1 h-11 bg-black/5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <i className="fa-solid fa-chevron-left text-xs text-deep-blue" />
              <span className="font-display font-bold text-deep-blue text-sm">
                {LETTERS[(current - 1 + LETTERS.length) % LETTERS.length].letter}
              </span>
            </button>

            <div className="flex gap-1">
              {LETTERS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 16 : 5,
                    height: 5,
                    background: i === current ? "#E06500" : "oklch(0.75 0.02 80)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((c) => (c + 1) % LETTERS.length)}
              className="flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition text-white"
              style={{ background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.58 0.20 38) 100%)" }}
            >
              <span className="font-display font-bold text-sm">
                {LETTERS[(current + 1) % LETTERS.length].letter}
              </span>
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>

          {/* CTA to start the Adaptive Quiz */}
          <div className="px-4 mt-6">
            <button
              onClick={() => {
                sfx.playTap();
                setMode("quiz");
                setQuizStep(0);
                setIsAnswered(false);
                setSelectedAnswer(null);
              }}
              className="w-full h-14 rounded-2xl bg-deep-blue text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <i className="fa-solid fa-bolt text-[#ffc800]" />
              Faire le Défi de Sagesse
              <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />
            </button>
          </div>

          <div className="h-4" />
          <BottomNav />
        </>
      ) : (
        /* ─── ADAPTIVE QUIZ MODE ─── */
        <div className="px-4 mt-3 flex-1 flex flex-col justify-between pb-8">
          
          {/* Progress header */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-ocre rounded-full transition-all duration-500" style={{ width: `${((quizStep + 1) / 5) * 100}%` }} />
            </div>
            <span className="font-display font-extrabold text-deep-blue text-xs">{quizStep + 1}/5</span>
          </div>

          {/* Petit Génie dialog bubble */}
          <div className="bg-ocre/10 border border-ocre/20 rounded-3xl p-4 flex gap-3 items-start relative mt-4">
            <div className="relative shrink-0">
              <Mascot size={64} variant={isPlaying ? "walk" : "idle"} animate={isPlaying ? "float" : "none"} className="shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">🎙️ Petit Génie raconte...</span>
              <p className="font-display font-bold text-deep-blue text-xs leading-relaxed mt-0.5">
                {speechBubble}
              </p>
            </div>
            <button
              onClick={handleSpeakQuestion}
              className="size-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-105"
            >
              <i className={`fa-solid fa-volume-high text-xs text-ocre ${isPlaying ? "animate-bounce" : ""}`} />
            </button>
          </div>

          {/* Question Prompt */}
          <div className="text-center my-6">
            <h2 className="font-display text-xl font-extrabold text-deep-blue text-balance leading-tight">
              {currentQuestion.prompt}
            </h2>
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {currentQuestion.choices.map((c) => {
              const isSelected = selectedAnswer === c;
              const isCorrectChoice = c === currentQuestion.answer;
              const isWrongChoice = isSelected && !isCorrectChoice;

              return (
                <button
                  key={c}
                  onClick={() => handleChoice(c)}
                  disabled={isAnswered}
                  className="h-16 rounded-2xl font-display font-extrabold text-sm transition-all relative overflow-hidden flex items-center justify-center p-3 text-center border-2"
                  style={
                    isAnswered
                      ? isCorrectChoice
                        ? { background: "oklch(0.95 0.05 150)", borderColor: "oklch(0.62 0.17 150)", color: "oklch(0.35 0.15 150)" }
                        : isWrongChoice
                        ? { background: "oklch(0.95 0.05 20)", borderColor: "oklch(0.62 0.17 20)", color: "oklch(0.35 0.15 20)" }
                        : { background: "white", borderColor: "oklch(0.9 0 0)", color: "oklch(0.7 0 0)" }
                      : isSelected
                      ? { background: "oklch(0.93 0.05 250)", borderColor: "oklch(0.62 0.17 250)", color: "oklch(0.2 0.1 250)" }
                      : { background: "white", borderColor: "oklch(0.85 0.01 80)", color: "oklch(0.22 0.1 255)" }
                  }
                >
                  {isAnswered && isCorrectChoice && <i className="fa-solid fa-circle-check absolute top-2 right-2 text-leaf text-[10px]" />}
                  {isAnswered && isWrongChoice && <i className="fa-solid fa-circle-xmark absolute top-2 right-2 text-terracotta text-[10px]" />}
                  <span>{c}</span>
                </button>
              );
            })}
          </div>

          {/* Action button */}
          <div className="w-full">
            <button
              onClick={handleNextQuiz}
              disabled={!isAnswered}
              className="w-full h-14 rounded-2xl bg-[#a34e36] text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-98 transition disabled:opacity-40"
            >
              {quizStep === 4 ? "Terminer le chapitre 🏁" : "Continuer ➔"}
            </button>
          </div>

        </div>
      )}

    </PhoneFrame>
  );
}
