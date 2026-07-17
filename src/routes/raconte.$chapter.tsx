import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { useKpodji } from "@/lib/kpodji-store";
import { useState } from "react";
import { Mascot } from "@/components/kpodji/Mascot";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/raconte/$chapter")({
  component: RacontePage,
});

interface FicheTemplate {
  title: string;
  emoji: string;
  content: string;
  question: string;
  bonusXp: number;
}

const fiches: Record<string, FicheTemplate> = {
  alphabet: {
    title: "Alphabet & Sons du Marché",
    emoji: "🔤",
    content: "L'enfant a appris à associer les sons des lettres (A à E) avec des objets locaux du marché (A comme Ananas/Pineapple, B comme Baobab/Banana, C comme Citron/Coconut).",
    question: "Posez-lui la question : 'Quel fruit du marché commence par le son B en anglais (Banana) ?'",
    bonusXp: 50,
  },
  marche: {
    title: "Calculs & Troc au Marché",
    emoji: "🥭",
    content: "L'enfant s'est exercé à faire des calculs appliqués en comptant des fruits (mangues, ananas) et en calculant des sommes simples en FCFA.",
    question: "Posez-lui la question : 'Si j'ai une pièce de 100 FCFA et une pièce de 200 FCFA, combien ai-je d'argent en tout ?'",
    bonusXp: 50,
  },
  science: {
    title: "Sciences & Cycle de la Nature",
    emoji: "⚡",
    content: "L'enfant a exploré le cycle de la pluie (nuages et condensation) et les besoins vitaux des plantes (eau et lumière du soleil).",
    question: "Posez-lui la question : 'De quoi les petites pousses du jardin ont-elles besoin pour grandir fort ?'",
    bonusXp: 50,
  },
};

function RacontePage() {
  const { chapter } = Route.useParams();
  const navigate = useNavigate();
  const { addXp, completeChapter, setLastRaconteFiche, lang } = useKpodji();
  const [hasShared, setHasShared] = useState(false);

  const fiche = fiches[chapter] || fiches.alphabet;

  const handleShared = () => {
    sfx.playSuccess();
    setHasShared(true);
    addXp(fiche.bonusXp);
    completeChapter(chapter);
    setLastRaconteFiche({
      title: fiche.title,
      content: fiche.content,
      question: fiche.question,
    });
  };

  return (
    <PhoneFrame>
      <TopBar showStreak={false} />

      <div className="flex-1 flex flex-col justify-between px-5 pt-3 pb-8 overflow-y-auto select-none">
        
        {/* Header Title */}
        <div className="text-center animate-slide-down">
          <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#E06500] bg-ocre/10 px-3 py-1 rounded-full">
            🎙️ Mission de Sagesse
          </span>
          <h1 className="font-display text-xl font-extrabold text-deep-blue leading-tight mt-2.5">
            Raconte à quelqu'un !
          </h1>
        </div>

        {!hasShared ? (
          /* ─── STEP 1: PROMPT TO TELL ADULT ─── */
          <div className="flex-1 flex flex-col justify-center my-6 gap-6">
            
            {/* Mascot with tam-tam */}
            <div className="flex justify-center animate-float">
              <div className="relative">
                <Mascot size={90} variant="default" animate="float" />
                <div className="absolute inset-[-6px] rounded-full border border-ocre/30 animate-pulse pointer-events-none" />
              </div>
            </div>

            {/* Main directive */}
            <div className="bg-white border-2 border-[#e5e5e5] rounded-3xl p-5 shadow-xs text-center space-y-2 animate-pop-in">
              <p className="font-display font-bold text-deep-blue text-sm leading-relaxed">
                {lang === "fr" 
                  ? "« Va vite voir un adulte (maman, papa, grand-frère...) et raconte-lui ce que tu viens d'apprendre sur ce sentier ! »"
                  : "“Go find an adult (mom, dad, big brother...) right now and tell them what you just learned on this trail!”"}
              </p>
            </div>

            {/* Generated card preview */}
            <div className="bg-ocre/5 border border-ocre/20 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10 text-4xl">
                {fiche.emoji}
              </div>
              <span className="text-[8px] font-display font-extrabold text-ocre uppercase tracking-wider block">
                🌾 Fiche Parent à générer :
              </span>
              <p className="font-display font-extrabold text-deep-blue text-xs leading-snug">
                {fiche.title}
              </p>
              <p className="text-[10px] text-neutral-600 leading-normal">
                {fiche.content}
              </p>
              <div className="bg-white rounded-xl p-2.5 border border-neutral-100 mt-2">
                <p className="text-[9px] font-semibold text-ocre-foreground italic leading-relaxed">
                  💡 {fiche.question}
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleShared}
              className="w-full h-14 rounded-2xl bg-deep-blue text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-98 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-bullhorn text-[#ffc800]" />
              J'ai raconté ! (+{fiche.bonusXp} XP)
            </button>

          </div>
        ) : (
          /* ─── STEP 2: CELEBRATION / GATEWAY UNLOCKED ─── */
          <div className="flex-1 flex flex-col justify-center my-6 gap-6 text-center animate-fade-scale">
            
            {/* Mascot happy */}
            <div className="flex justify-center animate-bounce">
              <Mascot size={110} variant="happy" />
            </div>

            {/* Victory banner */}
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-extrabold text-leaf">Bravo, apprenti conteur !</h2>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Tu as partagé ta parole de sagesse. Ton sentier d'apprentissage s'est agrandi !
              </p>
            </div>

            {/* Reward Card */}
            <div className="bg-[#fff8e1] border-2 border-[#ffe082] rounded-3xl p-4 max-w-xs mx-auto shadow-sm flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[8px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">Récompense</span>
                <p className="font-display font-extrabold text-deep-blue text-sm">Graines de Sagesse</p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-[#ffe082] px-3 py-1 rounded-xl">
                <i className="fa-solid fa-star text-ocre text-sm" />
                <span className="font-display font-extrabold text-deep-blue text-sm">+{fiche.bonusXp} XP</span>
              </div>
            </div>

            {/* Confirmation details for jury */}
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-[10px] text-neutral-500 max-w-xs mx-auto text-left leading-normal">
              ✅ <strong>Fiche Adulte Enregistrée :</strong> La question et le résumé sont maintenant visibles sur le Tableau de bord des Parents.
            </div>

            {/* Return to trail */}
            <Link
              to="/reward"
              className="w-full h-14 rounded-2xl bg-leaf text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-98 transition flex items-center justify-center gap-2"
            >
              Découvrir mes récompenses ! 🌟
            </Link>

          </div>
        )}

      </div>
    </PhoneFrame>
  );
}
