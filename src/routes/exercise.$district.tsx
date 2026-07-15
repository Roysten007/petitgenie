import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji, type DistrictId } from "@/lib/kpodji-store";
import { Mascot } from "@/components/kpodji/Mascot";
import { X, CheckCircle2, XCircle, Star, Volume2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { sfx } from "@/lib/sfx";
import marcheImg from "@/assets/district_marche.jpg";
import ecoleImg from "@/assets/district_ecole.jpg";
import riviereImg from "@/assets/district_riviere.jpg";
import placeImg from "@/assets/district_place.jpg";

export const Route = createFileRoute("/exercise/$district")({
  component: Exercise,
});

interface Question {
  intro: string;
  prompt: string;
  visual?: { emoji: string; count: number };
  choices: string[];
  answer: number;
}

const questionsByBracketAndDistrict: Record<"4-6" | "7-8" | "9-10", Record<DistrictId, Question[]>> = {
  "4-6": {
    marche: [
      { intro: "Le Marché • Compter", prompt: "Combien de bananes vois-tu ?", visual: { emoji: "🍌", count: 3 }, choices: ["2", "3", "4", "5"], answer: 1 },
      { intro: "Le Marché • Addition", prompt: "Tu as 2 mangues 🥭🥭. Zao t'en donne 1 🥭. Combien en as-tu ?", choices: ["2", "3", "4"], answer: 1 },
    ],
    ecole: [
      { intro: "L'École • Anglais", prompt: "Comment dit-on 'Bonjour' ?", choices: ["Hello", "Goodbye", "Thank you"], answer: 0 },
      { intro: "L'École • Animaux", prompt: "Quel animal est un 'Lion' 🦁 ?", choices: ["Chien", "Chat", "Lion"], answer: 2 },
    ],
    riviere: [
      { intro: "La Rivière • Formes", prompt: "Quelle forme est ronde ?", choices: ["Triangle ▲", "Carré ■", "Cercle ●"], answer: 2 },
      { intro: "La Rivière • Tailles", prompt: "Qui est le plus grand ?", choices: ["La fourmi 🐜", "L'éléphant 🐘", "Le chat 🐈"], answer: 1 },
    ],
    place: [
      { intro: "La Place • Mots", prompt: "Que signifie 'Two' en français ?", choices: ["Un", "Deux", "Trois"], answer: 1 },
      { intro: "La Place • Anglais", prompt: "Comment dit-on 'Bleu' ?", choices: ["Red", "Blue", "Green"], answer: 1 },
    ],
    science: [
      { intro: "Sciences • Nature", prompt: "Quel animal pond des œufs ?", choices: ["Chèvre 🐐", "Poule 🐔", "Chien 🐕"], answer: 1 },
      { intro: "Sciences • Plantes", prompt: "De quoi les plantes ont-elles besoin ?", choices: ["De soleil et d'eau ☀️💧", "De bonbons 🍬", "De jouets 🧸"], answer: 0 },
    ],
    morale: [
      { intro: "Valeurs • Politesse", prompt: "Que dis-tu quand on te donne une mangue 🥭 ?", choices: ["C'est à moi !", "Merci ! 🌟", "Rien"], answer: 1 },
      { intro: "Valeurs • Émotions", prompt: "Comment se sent le lièvre s'il sourit ? 😃", choices: ["Triste", "En colère", "Heureux"], answer: 2 },
    ],
  },
  "7-8": {
    marche: [
      { intro: "Le Marché • Mathématiques", prompt: "Combien de mangues vois-tu ?", visual: { emoji: "🥭", count: 5 }, choices: ["4", "5", "6", "3"], answer: 1 },
      { intro: "Le Marché • FCFA", prompt: "100 FCFA + 200 FCFA = ?", choices: ["200 FCFA", "250 FCFA", "300 FCFA", "400 FCFA"], answer: 2 },
      { intro: "Le Marché • Soustraction", prompt: "Tu as 8 bananes, tu en manges 3. Combien reste-t-il ?", visual: { emoji: "🍌", count: 8 }, choices: ["3", "4", "5", "6"], answer: 2 },
    ],
    ecole: [
      { intro: "L'École • English", prompt: "How do you say 'Bonjour' ?", choices: ["Bye", "Hello", "Thanks", "Please"], answer: 1 },
      { intro: "L'École • Colors", prompt: "What color is 'Rouge' ?", choices: ["Blue", "Green", "Red", "Yellow"], answer: 2 },
      { intro: "L'École • Numbers", prompt: "How do you say '3' in English ?", choices: ["Two", "Three", "Four", "Five"], answer: 1 },
    ],
    riviere: [
      { intro: "La Rivière • Fractions", prompt: "La moitié de 10 = ?", choices: ["3", "4", "5", "6"], answer: 2 },
      { intro: "La Rivière • Mesures", prompt: "Combien de doigts sur 2 mains ?", visual: { emoji: "✋", count: 2 }, choices: ["8", "10", "12", "5"], answer: 1 },
    ],
    place: [
      { intro: "La Place • Défi bilingue", prompt: "Il y a 'three' mangues. Combien en français ?", visual: { emoji: "🥭", count: 3 }, choices: ["Deux", "Trois", "Quatre", "Cinq"], answer: 1 },
      { intro: "La Place • Défi bilingue", prompt: "'Two' + 'three' = ?", choices: ["Four", "Five", "Six", "Seven"], answer: 1 },
    ],
    science: [
      { intro: "Sciences • Nature", prompt: "D'où vient la pluie ?", choices: ["Des nuages ☁️", "De la mer directement 🌊", "Des arbres 🌳"], answer: 0 },
      { intro: "Sciences • Corps", prompt: "De quoi le corps a-t-il besoin pour grandir ?", choices: ["Des vitamines 🍎", "Des sodas 🥤", "De rien"], answer: 0 },
    ],
    morale: [
      { intro: "Valeurs • Entraide", prompt: "Si un ami tombe dans la cour, que fais-tu ?", choices: ["Je ris", "Je l'aide à se relever 🤝", "Je l'ignore"], answer: 1 },
      { intro: "Valeurs • Respect", prompt: "Respecter les aînés au village, c'est...", choices: ["Une belle valeur 🌟", "Inutile", "Pour rigoler"], answer: 0 },
    ],
  },
  "9-10": {
    marche: [
      { intro: "Le Marché • FCFA", prompt: "Tu achètes un cahier à 350 FCFA. Tu donnes 500 FCFA. On te rend...", choices: ["100 FCFA", "150 FCFA", "200 FCFA"], answer: 1 },
      { intro: "Le Marché • Division", prompt: "4 stylos coûtent 200 FCFA. Combien coûte 1 stylo ?", choices: ["40 FCFA", "50 FCFA", "60 FCFA"], answer: 1 },
    ],
    ecole: [
      { intro: "L'École • Grammaire", prompt: "Fill in: 'They ___ playing football now.'", choices: ["is", "am", "are", "be"], answer: 2 },
      { intro: "L'École • Conjugaison", prompt: "Past tense of 'Go' ?", choices: ["Goed", "Went", "Gone"], answer: 1 },
    ],
    riviere: [
      { intro: "La Rivière • Fractions", prompt: "Si un poisson mange 1/4 le matin et 2/4 le soir, il a mangé...", choices: ["1/4", "2/4", "3/4", "4/4"], answer: 2 },
    ],
    place: [
      { intro: "La Place • Traduction", prompt: "Translate: 'We love Kpodji village.'", choices: ["Nous détestons le village", "Nous habitons au village", "Nous aimons le village de Kpodji ❤️"], answer: 2 },
    ],
    science: [
      { intro: "Sciences • Physique", prompt: "Qu'est-ce qui conduit le mieux l'électricité ?", choices: ["Le bois", "Le plastique", "L'eau et les métaux ⚡", "Le verre"], answer: 2 },
      { intro: "Sciences • Eau", prompt: "Le cycle de l'eau comprend l'évaporation, puis...", choices: ["La condensation et la pluie 🌧️", "La disparition de l'eau", "Rien"], answer: 0 },
    ],
    morale: [
      { intro: "Valeurs • Civisme", prompt: "Pour garder le village propre, je dois...", choices: ["Jeter mes déchets par terre", "Jeter mes déchets à la poubelle 🗑️", "Ne rien faire"], answer: 1 },
      { intro: "Valeurs • Communauté", prompt: "Qu'est-ce que l'entraide communautaire ?", choices: ["Travailler seul", "S'entraider pour bâtir ensemble 🌾", "Se disputer"], answer: 1 },
    ],
  },
};

const districtMeta: Record<DistrictId, { img: string; gradient: string; shadow: string; label: string; emoji: string }> = {
  marche:  { img: marcheImg,  gradient: "linear-gradient(160deg, oklch(0.58 0.20 38 / 90%) 0%, oklch(0.38 0.16 30 / 95%) 100%)",  shadow: "0 12px 40px oklch(0.58 0.20 38 / 50%)",  label: "Le Marché",  emoji: "🛒" },
  ecole:   { img: ecoleImg,   gradient: "linear-gradient(160deg, oklch(0.42 0.15 228 / 90%) 0%, oklch(0.28 0.12 255 / 95%) 100%)", shadow: "0 12px 40px oklch(0.42 0.15 228 / 50%)", label: "L'École",    emoji: "📚" },
  riviere: { img: riviereImg, gradient: "linear-gradient(160deg, oklch(0.42 0.16 148 / 90%) 0%, oklch(0.30 0.12 160 / 95%) 100%)", shadow: "0 12px 40px oklch(0.42 0.16 148 / 50%)", label: "La Rivière", emoji: "🌊" },
  place:   { img: placeImg,   gradient: "linear-gradient(160deg, oklch(0.62 0.18 65 / 90%) 0%, oklch(0.45 0.16 48 / 95%) 100%)",   shadow: "0 12px 40px oklch(0.62 0.18 65 / 50%)",  label: "La Place",   emoji: "🌳" },
  science: { img: riviereImg, gradient: "linear-gradient(160deg, oklch(0.52 0.16 148 / 90%) 0%, oklch(0.35 0.12 160 / 95%) 100%)", shadow: "0 12px 40px oklch(0.52 0.16 148 / 50%)", label: "Sciences", emoji: "⚡" },
  morale:  { img: placeImg,   gradient: "linear-gradient(160deg, oklch(0.58 0.20 38 / 90%) 0%, oklch(0.40 0.16 30 / 95%) 100%)",   shadow: "0 12px 40px oklch(0.58 0.20 38 / 50%)",  label: "Valeurs",    emoji: "🤝" },
};

function Exercise() {
  const { district } = Route.useParams();
  const navigate = useNavigate();
  const { addSeeds, advanceDistrict, activeProfile } = useKpodji();
  
  const bracket = activeProfile?.levelBracket || "7-8";
  
  const questions = useMemo(() => {
    const bracketQuestions = questionsByBracketAndDistrict[bracket] || questionsByBracketAndDistrict["7-8"];
    return bracketQuestions[district as DistrictId] || bracketQuestions.marche;
  }, [district, bracket]);
  
  const meta = districtMeta[district as DistrictId] ?? districtMeta.marche;

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "right" | "wrong">("idle");
  const [showMascot, setShowMascot] = useState(false);

  const q = questions[step];
  const progress = ((step + (status !== "idle" ? 1 : 0)) / questions.length) * 100;

  const { isPlaying, speakQueue, stop } = useSpeechSynthesis();

  // Stop narration on question change or answer check
  useEffect(() => {
    stop();
  }, [step, status, stop]);

  const handleSpeakQuestion = () => {
    if (isPlaying) {
      stop();
      return;
    }

    const isEnglish = q.prompt.toLowerCase().includes("how do you say") || q.prompt.toLowerCase().includes("fill in") || q.prompt.toLowerCase().includes("translate");
    const questionLang = isEnglish ? "en" : "fr";

    const parts = [
      { text: q.prompt, lang: questionLang }
    ];

    q.choices.forEach((choice, index) => {
      // Clean up special characters like ▲ ■ ●
      const cleanChoice = choice.replace(/[▲■●]/g, "").trim();
      const choiceText = questionLang === "fr"
        ? `, Option ${index + 1} : ${cleanChoice}.`
        : `, Option ${index + 1} : ${cleanChoice}.`;
      parts.push({ text: choiceText, lang: questionLang });
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
    } else {
      sfx.playWrong();
    }
  };

  const onNext = () => {
    setShowMascot(false);
    if (step + 1 >= questions.length) {
      addSeeds(10);
      advanceDistrict(district as DistrictId, 10);
      sfx.playSuccess();
      navigate({ to: "/reward" });
    } else {
      setStep(step + 1);
      setSelected(null);
      setStatus("idle");
    }
  };

  return (
    <PhoneFrame>
      {/* ── District hero header ── */}
      <div className="relative h-36 overflow-hidden shrink-0">
        {/* Background image */}
        <img src={meta.img} alt={meta.label} className="absolute inset-0 w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: meta.gradient }} />
        <div className="absolute inset-0 kente-pattern opacity-20" />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(to bottom, oklch(0 0 0 / 40%) 0%, transparent 100%)" }} />

        {/* Header controls */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-6 flex items-center gap-3">
          <Link
            to="/"
            className="size-10 rounded-full grid place-items-center shrink-0 transition-transform active:scale-90"
            style={{ background: "oklch(0 0 0 / 25%)", backdropFilter: "blur(12px)" }}
            aria-label="Fermer"
          >
            <X className="size-4 text-white" strokeWidth={2.5} />
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
        </div>

        {/* Stars earned indicator */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{ background: "oklch(0 0 0 / 30%)", backdropFilter: "blur(8px)" }}>
          <Star className="size-3.5 text-ocre fill-ocre" />
          <span className="font-display font-extrabold text-white text-xs">+{step * 5} pts</span>
        </div>
      </div>

      {/* ── Question zone ── */}
      <div className="flex-1 flex flex-col px-5 pt-5">
        {/* Intro pill */}
        <span
          className="self-center text-[10px] font-display font-extrabold tracking-[0.18em] uppercase mb-4 px-3 py-1.5 rounded-full animate-slide-down"
          style={{ background: "oklch(0.58 0.20 38 / 10%)", color: "oklch(0.58 0.20 38)" }}
        >
          {q.intro}
        </span>

        {/* Prompt with Speaker Button for Kids */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <h2 className="font-display text-[22px] text-center text-deep-blue font-extrabold text-balance leading-tight animate-slide-up">
            {q.prompt}
          </h2>
          <button
            onClick={handleSpeakQuestion}
            className={`size-11 rounded-full flex items-center justify-center transition-all duration-300 relative border-2 ${
              isPlaying 
                ? "scale-110 bg-ocre border-white text-deep-blue shadow-md" 
                : "bg-white/80 border-ocre/25 text-ocre hover:scale-105 active:scale-95"
            }`}
            style={{
              boxShadow: isPlaying ? "0 0 15px oklch(0.76 0.18 78 / 60%)" : "none"
            }}
            aria-label="Écouter la question"
          >
            {isPlaying && (
              <div className="absolute inset-0 rounded-full animate-pulse-ring bg-ocre/35" />
            )}
            <Volume2 className={`size-5 ${isPlaying ? "animate-bounce" : ""}`} strokeWidth={2.5} />
          </button>
        </div>

        {/* Visual items */}
        {q.visual && (
          <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-[280px] mx-auto">
            {Array.from({ length: q.visual.count }).map((_, i) => (
              <div
                key={i}
                className="size-14 rounded-2xl grid place-items-center text-3xl animate-pop-in glass-card shadow-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {q.visual!.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Choices grid */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {q.choices.map((c, i) => {
            const isSelected = selected === i;
            const isRight = status !== "idle" && i === q.answer;
            const isWrongPick = status === "wrong" && isSelected;

            return (
              <button
                key={c}
                disabled={status !== "idle"}
                onClick={() => {
                  setSelected(i);
                  sfx.playTap();
                }}
                className={`h-[72px] rounded-3xl text-xl font-display font-extrabold transition-all duration-300 relative overflow-hidden active:scale-95 ${isWrongPick ? "animate-shake" : ""}`}
                style={
                  isRight ? {
                    background: "linear-gradient(135deg, oklch(0.52 0.16 148 / 18%) 0%, oklch(0.62 0.14 160 / 12%) 100%)",
                    border: "2px solid oklch(0.52 0.16 148)",
                    color: "oklch(0.42 0.16 148)",
                    boxShadow: "0 0 28px oklch(0.52 0.16 148 / 30%)",
                  } : isWrongPick ? {
                    background: "linear-gradient(135deg, oklch(0.58 0.20 38 / 12%) 0%, oklch(0.76 0.18 78 / 10%) 100%)",
                    border: "2px solid oklch(0.58 0.20 38)",
                    color: "oklch(0.48 0.20 38)",
                    boxShadow: "0 0 24px oklch(0.58 0.20 38 / 25%)",
                  } : isSelected ? {
                    background: "linear-gradient(135deg, oklch(0.22 0.10 255 / 10%) 0%, oklch(0.30 0.12 240 / 8%) 100%)",
                    border: "2px solid oklch(0.22 0.10 255)",
                    color: "oklch(0.22 0.10 255)",
                    boxShadow: "0 0 20px oklch(0.22 0.10 255 / 18%)",
                  } : {
                    background: "oklch(1 0 0 / 88%)",
                    border: "2px solid oklch(0.88 0.025 78)",
                    color: "oklch(0.22 0.10 255)",
                  }
                }
              >
                {/* Shimmer on selected */}
                {isSelected && !isWrongPick && <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />}
                {/* Check/X icon */}
                {isRight && <CheckCircle2 className="absolute top-2 right-2 size-4 text-leaf" />}
                {isWrongPick && <XCircle className="absolute top-2 right-2 size-4 text-terracotta" />}
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
            className="w-full h-16 rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide text-white relative overflow-hidden transition-all active:scale-[0.98] disabled:opacity-35"
            style={selected !== null ? {
              background: "linear-gradient(135deg, oklch(0.52 0.16 148) 0%, oklch(0.42 0.14 165) 100%)",
              boxShadow: "0 8px 32px oklch(0.52 0.16 148 / 50%), inset 0 1px 0 oklch(1 0 0 / 20%)",
            } : {
              background: "oklch(0.88 0.015 80)",
            }}
          >
            <span className="relative z-10">Vérifier ✓</span>
            {selected !== null && <div className="absolute inset-0 animate-shimmer opacity-50 pointer-events-none" />}
          </button>
        ) : (
          <div className="space-y-3 animate-slide-up">
            {/* Feedback banner */}
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
              {/* Mascot mini */}
              {showMascot && (
                <div className="shrink-0 animate-bounce-in">
                  <Mascot size={44} variant="happy" animate="none" />
                </div>
              )}
              {!showMascot && (
                status === "right"
                  ? <CheckCircle2 className="size-6 text-leaf shrink-0" />
                  : <XCircle className="size-6 text-terracotta shrink-0" />
              )}
              <div>
                <p className="font-display font-extrabold text-sm" style={{ color: status === "right" ? "oklch(0.42 0.16 148)" : "oklch(0.48 0.20 38)" }}>
                  {status === "right" ? "Bravo, c'est ça ! 🌟" : "Presque ! On regarde ensemble 💪"}
                </p>
                {status === "right" && (
                  <p className="text-[11px] text-leaf/70 mt-0.5">+5 points gagnés !</p>
                )}
              </div>
            </div>

            {/* Continuer button */}
            <button
              onClick={onNext}
              className="w-full h-16 rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide text-white relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.48 0.22 28) 100%)",
                boxShadow: "0 8px 32px oklch(0.58 0.20 38 / 50%), inset 0 1px 0 oklch(1 0 0 / 20%)",
              }}
            >
              <span className="relative z-10">
                {step + 1 >= questions.length ? "Voir ma récompense 🎉" : "Continuer →"}
              </span>
              <div className="absolute inset-0 animate-shimmer opacity-50 pointer-events-none" />
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
