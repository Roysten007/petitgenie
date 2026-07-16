import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji, type DistrictId } from "@/lib/kpodji-store";
import { Mascot } from "@/components/kpodji/Mascot";
import { useMemo, useState, useEffect } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/exercise/$district")({
  component: Exercise,
});

interface Question {
  level: number;
  intro: string;
  zaoIntro: string;
  prompt: string;
  visual?: { emoji: string; count: number };
  choices: string[];
  answer: number;
  hint: string;
}

const questionsByDistrictAndLevel: Record<DistrictId, Record<1 | 2 | 3, Question[]>> = {
  marche: {
    1: [
      { level: 1, intro: "Le Marché • Compter", zaoIntro: "Fatou a étalé de délicieuses bananes douces pour les enfants du village. Aide-la à compter son stock !", prompt: "Combien de bananes vois-tu ?", visual: { emoji: "🍌", count: 3 }, choices: ["2", "3", "4", "5"], answer: 1, hint: "Compte les bananes une par une : une, deux, trois !" },
      { level: 1, intro: "Le Marché • Troc", zaoIntro: "Petit Génie a cueilli de superbes mangues dorées et veut les échanger contre les bananes de Fatou.", prompt: "Tu as 2 mangues 🥭🥭. On t'offre 1 mangue 🥭. Combien en as-tu ?", choices: ["2", "3", "4"], answer: 1, hint: "Ajoute la nouvelle mangue aux deux autres !" },
      { level: 1, intro: "Le Marché • Total", zaoIntro: "Regarde le stand, Moussa a posé 4 ananas juteux sur sa table.", prompt: "Combien d'ananas vois-tu ?", visual: { emoji: "🍍", count: 4 }, choices: ["3", "4", "5"], answer: 1, hint: "Il y a 4 ananas alignés sur le pagne." },
    ],
    2: [
      { level: 2, intro: "Le Marché • Soustraction", zaoIntro: "Fatou avait 5 magnifiques mangues bien mûres ce matin, mais elle en a vendu quelques-unes.", prompt: "Fatou a 5 mangues 🥭. Elle en vend 2. Combien de mangues lui reste-t-il ?", choices: ["2", "3", "4"], answer: 1, hint: "Enlève 2 mangues du panier de 5." },
      { level: 2, intro: "Le Marché • Soustraction", zaoIntro: "Un singe farceur s'est faufilé sur le stand pendant que le marchand rangeait ses pièces.", prompt: "Tu as 8 bananes 🍌. Tu en manges 3. Combien reste-t-il ?", choices: ["3", "4", "5", "6"], answer: 2, hint: "Soustrait 3 bananes de ton stock de 8." },
      { level: 2, intro: "Le Marché • Addition", zaoIntro: "Pour faire un bon jus de dattes, Petit Génie rassemble les fruits récoltés sur le palmier.", prompt: "Tu as 3 dattes 🌴 et tu en ramasses 3 autres. Combien en as-tu en tout ?", choices: ["5", "6", "7"], answer: 1, hint: "3 plus encore 3 font 6 fruits !" },
    ],
    3: [
      { level: 3, intro: "Le Marché • Monnaie FCFA", zaoIntro: "Petit Génie compte ses pièces de FCFA pour payer son pain de mil au vieux boulanger.", prompt: "Une pièce de 100 FCFA + une de 200 FCFA font combien ?", choices: ["200 FCFA", "250 FCFA", "300 FCFA", "400 FCFA"], answer: 2, hint: "Additionne 100 et 200 pour trouver la somme !" },
      { level: 3, intro: "Le Marché • Division", zaoIntro: "Fatou propose un lot de stylos colorés pour la rentrée des classes à l'école du village.", prompt: "4 stylos coûtent 200 FCFA. Combien coûte 1 stylo ?", choices: ["40 FCFA", "50 FCFA", "60 FCFA"], answer: 1, hint: "Partage 200 FCFA équitablement en 4 parts." },
      { level: 3, intro: "Le Marché • Rendre monnaie", zaoIntro: "Moussa achète un beau cahier illustré pour dessiner les oiseaux de la forêt.", prompt: "Tu achètes un cahier à 350 FCFA. Tu donnes 500 FCFA. On te rend...", choices: ["100 FCFA", "150 FCFA", "200 FCFA"], answer: 1, hint: "Calcule la différence entre 500 et 350 !" },
    ],
  },
  science: {
    1: [
      { level: 1, intro: "Sciences • Animaux", zaoIntro: "Dans la basse-cour du village, Petit Génie écoute le réveil des oiseaux à plumes.", prompt: "Quel animal pond des œufs ?", choices: ["La chèvre 🐐", "La poule 🐔", "Le chien 🐕"], answer: 1, hint: "La poule pond des œufs frais tous les matins !" },
      { level: 1, intro: "Sciences • Plantes", zaoIntro: "Pour faire pousser le beau mil de notre potager et le nourrir, que devons-nous lui donner ?", prompt: "De quoi les plantes ont-elles besoin pour grandir ?", choices: ["De soleil et d'eau ☀️💧", "De bonbons 🍬", "De jouets 🧸"], answer: 0, hint: "Sans lumière ni eau, la plante ne peut pas grandir." },
      { level: 1, intro: "Sciences • Climat", zaoIntro: "Petit Génie lève la tête et observe le ciel bleu. Il sent le vent souffler sur les feuilles.", prompt: "Quel astre nous donne de la lumière le jour ?", choices: ["La lune 🌙", "Le soleil ☀️", "Une étoile ⭐️"], answer: 1, hint: "C'est le soleil qui brille fort dans le ciel de Kpodji." },
    ],
    2: [
      { level: 2, intro: "Sciences • Le Corps", zaoIntro: "Pour courir très vite dans la savane et rester fort comme Petit Génie, notre corps a besoin de vitamines.", prompt: "De quoi ton corps a-t-il besoin pour grandir fort ?", choices: ["Des vitamines 🍎", "Des sodas 🥤", "De rien"], answer: 0, hint: "Les fruits frais contiennent des vitamines essentielles." },
      { level: 2, intro: "Sciences • Faune", zaoIntro: "Petit Génie observe les poissons nager sous le pont de bois qui traverse le fleuve.", prompt: "Où vivent les poissons du fleuve Niger ?", choices: ["Dans l'eau 🌊", "Dans le sable 🏖️", "Dans les arbres 🌳"], answer: 0, hint: "Les poissons respirent sous l'eau !" },
      { level: 2, intro: "Sciences • Sol", zaoIntro: "Dans le potager de notre école, les vers de terre creusent de petits tunnels sous la terre.", prompt: "À quoi servent les vers de terre dans le sol ?", choices: ["À l'aérer et le nourrir 🌱", "À faire peur", "À rien"], answer: 0, hint: "Ils mélangent la terre pour aider les racines." },
    ],
    3: [
      { level: 3, intro: "Sciences • Climat", zaoIntro: "Regarde ces gros nuages noirs et lourds qui s'accumulent au-dessus du Niger avant l'orage.", prompt: "D'où vient la pluie ?", choices: ["Des nuages ☁️", "De la mer directement 🌊", "Des arbres 🌳"], answer: 0, hint: "L'eau s'évapore puis se condense en nuages avant de tomber." },
      { level: 3, intro: "Sciences • Matière", zaoIntro: "Petit Génie fait des expériences avec différents matériaux trouvés près de la forge du village.", prompt: "Qu'est-ce qui conduit le mieux l'électricité ?", choices: ["Le bois", "Le plastique", "L'eau et les métaux ⚡"], answer: 2, hint: "Le métal et l'eau laissent passer l'électricité." },
      { level: 3, intro: "Sciences • Cycle de l'eau", zaoIntro: "Les conteurs nous chantent le voyage éternel de l'eau entre le ciel et la terre.", prompt: "Le cycle de l'eau comprend l'évaporation, puis...", choices: ["La condensation et la pluie 🌧️", "La disparition de l'eau", "Rien"], answer: 0, hint: "La vapeur monte, forme un nuage, puis retombe en pluie." },
    ],
  },
  // Fallbacks for other routes
  ecole: { 1: [], 2: [], 3: [] },
  riviere: { 1: [], 2: [], 3: [] },
  place: { 1: [], 2: [], 3: [] },
  morale: { 1: [], 2: [], 3: [] }
};

const districtMeta: Record<DistrictId, { gradient: string; shadow: string; label: string; emoji: string }> = {
  marche:  { gradient: "linear-gradient(160deg, oklch(0.58 0.20 38 / 90%) 0%, oklch(0.38 0.16 30 / 95%) 100%)",  shadow: "0 12px 40px oklch(0.58 0.20 38 / 50%)",  label: "Le Marché",  emoji: "🛒" },
  ecole:   { gradient: "linear-gradient(160deg, oklch(0.42 0.15 228 / 90%) 0%, oklch(0.28 0.12 255 / 95%) 100%)", shadow: "0 12px 40px oklch(0.42 0.15 228 / 50%)", label: "L'École",    emoji: "📚" },
  riviere: { gradient: "linear-gradient(160deg, oklch(0.42 0.16 148 / 90%) 0%, oklch(0.30 0.12 160 / 95%) 100%)", shadow: "0 12px 40px oklch(0.42 0.16 148 / 50%)", label: "La Rivière", emoji: "🌊" },
  place:   { gradient: "linear-gradient(160deg, oklch(0.62 0.18 65 / 90%) 0%, oklch(0.45 0.16 48 / 95%) 100%)",   shadow: "0 12px 40px oklch(0.62 0.18 65 / 50%)",  label: "La Place",   emoji: "🌳" },
  science: { gradient: "linear-gradient(160deg, oklch(0.52 0.16 148 / 90%) 0%, oklch(0.35 0.12 160 / 95%) 100%)", shadow: "0 12px 40px oklch(0.52 0.16 148 / 50%)", label: "Sciences", emoji: "⚡" },
  morale:  { gradient: "linear-gradient(160deg, oklch(0.58 0.20 38 / 90%) 0%, oklch(0.40 0.16 30 / 95%) 100%)",   shadow: "0 12px 40px oklch(0.58 0.20 38 / 50%)",  label: "Valeurs",    emoji: "🤝" },
};

function Exercise() {
  const { district } = Route.useParams();
  const navigate = useNavigate();
  const { addSeeds, advanceDistrict, activeProfile, levelMarche, levelScience, updateLevel, addXp } = useKpodji();
  
  const distId = (district as DistrictId) || "marche";

  // Get active level from global state
  const initialLvl = distId === "science" ? levelScience : levelMarche;
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(initialLvl || 1);

  // Load questions based on level
  const questions = useMemo(() => {
    const list = questionsByDistrictAndLevel[distId]?.[currentLevel] || questionsByDistrictAndLevel.marche[1];
    return list.length > 0 ? list : questionsByDistrictAndLevel.marche[1];
  }, [distId, currentLevel]);
  
  const meta = districtMeta[distId] ?? districtMeta.marche;

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "right" | "wrong">("idle");
  const [showMascot, setShowMascot] = useState(false);

  // Streak within session to adjust level in real-time
  const [streakCorrect, setStreakCorrect] = useState(0);
  const [streakIncorrect, setStreakIncorrect] = useState(0);

  const q = questions[step] || questions[0];
  const progress = ((step + (status !== "idle" ? 1 : 0)) / questions.length) * 100;

  const { isPlaying, speakQueue, stop } = useSpeechSynthesis();

  // Dialog bubble content
  const [speechText, setSpeechText] = useState(q.zaoIntro);

  useEffect(() => {
    setSpeechText(q.zaoIntro);
  }, [step, q]);

  useEffect(() => {
    stop();
  }, [step, status, stop]);

  const handleSpeakQuestion = () => {
    if (isPlaying) {
      stop();
      return;
    }
    const parts: { text: string; lang: "fr" | "en" }[] = [];
    parts.push({ text: speechText, lang: "fr" });
    parts.push({ text: q.prompt, lang: "fr" });
    q.choices.forEach((choice, index) => {
      parts.push({ text: `Option ${index + 1} : ${choice}`, lang: "fr" });
    });
    speakQueue(parts);
  };

  const onCheck = () => {
    if (selected === null) return;
    const isRight = selected === q.answer;
    setStatus(isRight ? "right" : "wrong");
    
    if (isRight) {
      setShowMascot(true);
      sfx.playCorrect();
      addXp(currentLevel * 10);
      
      const newStreak = streakCorrect + 1;
      setStreakCorrect(newStreak);
      setStreakIncorrect(0);

      // 3 correct answers in a row -> Level Up!
      if (newStreak === 3) {
        if (currentLevel < 3) {
          const nextLvl = (currentLevel + 1) as 1 | 2 | 3;
          setCurrentLevel(nextLvl);
          updateLevel(distId === "science" ? "science" : "marche", nextLvl);
          setSpeechText("Je vois que tu maîtrises très bien cette notion ! Compliquons un peu le niveau ! 🚀");
          speakQueue([{ text: "Je vois que tu maîtrises très bien cette notion ! Compliquons un peu le niveau !", lang: "fr" }]);
        } else {
          setSpeechText("Merveilleux ! Tu résous ces problèmes comme un sage ! 👑");
        }
        setStreakCorrect(0);
      } else {
        setSpeechText("C'est ça, excellent travail ! 🌟");
      }
    } else {
      sfx.playWrong();
      const newWrong = streakIncorrect + 1;
      setStreakIncorrect(newWrong);
      setStreakCorrect(0);

      // 2 wrong answers in a row -> Level Down & active hint
      if (newWrong === 2) {
        if (currentLevel > 1) {
          const prevLvl = (currentLevel - 1) as 1 | 2 | 3;
          setCurrentLevel(prevLvl);
          updateLevel(distId === "science" ? "science" : "marche", prevLvl);
          setSpeechText(`Ne t'inquiète pas, reprenons doucement ensemble. ${q.hint}`);
          speakQueue([{ text: `Ne t'inquiète pas, reprenons doucement ensemble. ${q.hint}`, lang: "fr" }]);
        } else {
          setSpeechText(`Regardons ensemble : ${q.hint}`);
          speakQueue([{ text: q.hint, lang: "fr" }]);
        }
        setStreakIncorrect(0);
      } else {
        setSpeechText(`Presque ! Écoute ce conseil de Petit Génie : ${q.hint}`);
        speakQueue([{ text: q.hint, lang: "fr" }]);
      }
    }
  };

  const onNext = () => {
    setShowMascot(false);
    if (step + 1 >= questions.length) {
      addSeeds(10);
      advanceDistrict(distId, 25); // advance progress
      sfx.playSuccess();
      // Redirect to the "Raconte à quelqu'un" gateway!
      navigate({ to: "/raconte/$chapter", params: { chapter: distId } });
    } else {
      setStep(step + 1);
      setSelected(null);
      setStatus("idle");
    }
  };

  return (
    <PhoneFrame>
      {/* Visual background */}
      <div className="relative h-44 shrink-0 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[#a34e36]/30 flex items-center justify-center text-6xl">
          {meta.emoji}
        </div>
        <div className="absolute inset-0" style={{ background: meta.gradient }} />
        <div className="absolute top-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to bottom, oklch(0 0 0 / 40%) 0%, transparent 100%)" }} />

        {/* Header controls */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-6 flex items-center gap-3">
          <Link
            to="/"
            className="size-10 rounded-full grid place-items-center shrink-0 transition-transform active:scale-90"
            style={{ background: "oklch(0 0 0 / 25%)", backdropFilter: "blur(12px)" }}
            aria-label="Fermer"
          >
            <i className="fa-solid fa-xmark text-white text-sm" />
          </Link>

          {/* Progress bar */}
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 20%)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, oklch(0.76 0.18 78) 0%, oklch(1 0 0) 100%)",
                boxShadow: "0 0 10px oklch(1 0 0 / 60%)",
              }}
            />
          </div>

          <span className="font-display font-extrabold text-white text-sm tabular-nums shrink-0">
            {step + 1}<span className="text-white/50">/{questions.length}</span>
          </span>
        </div>

        {/* District label */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-xl">{meta.emoji}</span>
          <span className="font-display font-extrabold text-white text-base drop-shadow">{meta.label}</span>
          <span className="bg-white/20 border border-white/30 text-white text-[9px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Niveau {currentLevel}
          </span>
        </div>

        {/* Stars earned indicator */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: "oklch(0 0 0 / 30%)", backdropFilter: "blur(8px)" }}>
          <i className="fa-solid fa-star text-ocre text-xs" />
          <span className="font-display font-extrabold text-white text-xs">+{step * 10} XP</span>
        </div>
      </div>

      {/* ── Question zone ── */}
      <div className="flex-1 flex flex-col px-5 pt-5 overflow-y-auto">
        {/* Intro pill */}
        <span
          className="self-center text-[10px] font-display font-extrabold tracking-[0.18em] uppercase mb-3 px-3 py-1.5 rounded-full animate-slide-down"
          style={{ background: "oklch(0.58 0.20 38 / 10%)", color: "oklch(0.58 0.20 38)" }}
        >
          {q.intro}
        </span>

        {/* Petit Génie dialog bubble */}
        <div className="mb-4 flex items-end gap-2.5 bg-ocre/10 rounded-2xl p-3 border border-ocre/20 shadow-xs relative animate-pop-in">
          <Mascot size={64} variant={isPlaying ? "walk" : "idle"} animate={isPlaying ? "float" : "none"} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[8px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">🎙️ Petit Génie raconte...</span>
            <p className="font-display font-semibold text-deep-blue text-[11px] leading-relaxed mt-0.5">
              {speechText}
            </p>
          </div>
        </div>

        {/* Prompt with Speaker Button for Kids */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <h2 className="font-display text-lg text-center text-deep-blue font-extrabold text-balance leading-tight animate-slide-up">
            {q.prompt}
          </h2>
          <button
            onClick={handleSpeakQuestion}
            className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 relative border-2 ${
              isPlaying 
                ? "scale-110 bg-ocre border-white text-deep-blue shadow-md" 
                : "bg-white/80 border-ocre/25 text-ocre hover:scale-105 active:scale-95"
            }`}
            aria-label="Écouter la question"
          >
            {isPlaying && (
              <div className="absolute inset-0 rounded-full animate-pulse-ring bg-ocre/35" />
            )}
            <i className={`fa-solid fa-volume-high text-xs ${isPlaying ? "animate-bounce text-deep-blue" : "text-ocre"}`} />
          </button>
        </div>

        {/* Emojis count visualization helper if present */}
        {q.visual && (
          <div className="flex justify-center gap-2 mb-6 p-4 rounded-3xl bg-neutral-50 border border-neutral-100 max-w-xs mx-auto animate-pop-in">
            {Array.from({ length: q.visual.count }).map((_, i) => (
              <span key={i} className="text-4xl hover:scale-110 transition-transform select-none">{q.visual?.emoji}</span>
            ))}
          </div>
        )}

        {/* Choices List */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {q.choices.map((c, i) => {
            const isSelected = selected === i;
            const isRight = status !== "idle" && i === q.answer;
            const isWrongPick = status === "wrong" && isSelected;

            return (
              <button
                key={i}
                onClick={() => {
                  setSelected(i);
                  sfx.playTap();
                }}
                disabled={status !== "idle"}
                className="h-16 rounded-2xl font-display font-extrabold text-sm relative overflow-hidden transition-all active:scale-[0.98] border-2"
                style={
                  status !== "idle"
                    ? isRight
                      ? { background: "oklch(0.95 0.05 150)", borderColor: "oklch(0.62 0.17 150)", color: "oklch(0.35 0.15 150)" }
                      : isWrongPick
                      ? { background: "oklch(0.95 0.05 20)", borderColor: "oklch(0.62 0.17 20)", color: "oklch(0.35 0.15 20)" }
                      : { background: "white", borderColor: "oklch(0.9 0 0)", color: "oklch(0.7 0 0)" }
                    : isSelected
                    ? { background: "oklch(0.93 0.05 250)", borderColor: "oklch(0.62 0.17 250)", color: "oklch(0.2 0.1 250)" }
                    : { background: "white", borderColor: "oklch(0.85 0.01 80)", color: "oklch(0.22 0.1 255)" }
                }
              >
                {status !== "idle" && isRight && <i className="fa-solid fa-circle-check absolute top-2 right-2 text-leaf text-sm" />}
                {status !== "idle" && isWrongPick && <i className="fa-solid fa-circle-xmark absolute top-2 right-2 text-terracotta text-sm" />}
                <span className="relative z-10">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom action area ── */}
      <div className="p-4 pt-3 pb-8 shrink-0">
        {status === "idle" ? (
          <button
            onClick={onCheck}
            disabled={selected === null}
            className="w-full h-14 rounded-2xl font-display font-extrabold text-base uppercase tracking-wide text-white relative overflow-hidden transition-all active:scale-[0.98] disabled:opacity-35"
            style={selected !== null ? {
              background: "linear-gradient(135deg, oklch(0.52 0.16 148) 0%, oklch(0.42 0.14 165) 100%)",
              boxShadow: "0 8px 32px oklch(0.52 0.16 148 / 50%)",
            } : {
              background: "oklch(0.88 0.015 80)",
            }}
          >
            <span className="relative z-10">Vérifier ✓</span>
          </button>
        ) : (
          <div className="space-y-3 animate-slide-up">
            <div
              className="rounded-2xl p-3.5 flex items-center gap-3"
              style={status === "right" ? {
                background: "linear-gradient(135deg, oklch(0.52 0.16 148 / 15%) 0%, oklch(0.62 0.14 160 / 10%) 100%)",
                border: "1.5px solid oklch(0.52 0.16 148 / 40%)",
              } : {
                background: "linear-gradient(135deg, oklch(0.58 0.20 38 / 12%) 0%, oklch(0.76 0.18 78 / 8%) 100%)",
                border: "1.5px solid oklch(0.58 0.20 38 / 35%)",
              }}
            >
              {showMascot ? (
                <div className="shrink-0 animate-bounce-in">
                  <Mascot size={44} variant="happy" animate="none" />
                </div>
              ) : (
                status === "right"
                  ? <i className="fa-solid fa-circle-check text-leaf text-xl shrink-0" />
                  : <i className="fa-solid fa-circle-xmark text-terracotta text-xl shrink-0" />
              )}
              <div>
                <p className="font-display font-extrabold text-sm" style={{ color: status === "right" ? "oklch(0.42 0.16 148)" : "oklch(0.48 0.20 38)" }}>
                  {status === "right" ? "Bravo, c'est ça ! 🌟" : "Presque ! Écoute Petit Génie... 💪"}
                </p>
                {status === "right" && (
                  <p className="text-[11px] text-leaf/70 mt-0.5">+{currentLevel * 10} XP gagnés !</p>
                )}
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full h-14 rounded-2xl font-display font-extrabold text-base uppercase tracking-wide text-white relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.48 0.22 28) 100%)",
                boxShadow: "0 8px 32px oklch(0.58 0.20 38 / 50%)",
              }}
            >
              {step + 1 >= questions.length ? "Terminer le chapitre 🏁" : "Continuer ➔"}
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
