import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji, type DistrictId } from "@/lib/kpodji-store";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

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

const questionsByDistrict: Record<DistrictId, Question[]> = {
  marche: [
    { intro: "Le Marché • Mathématiques", prompt: "Combien de mangues vois-tu ?", visual: { emoji: "🥭", count: 5 }, choices: ["4", "5", "6", "3"], answer: 1 },
    { intro: "Le Marché • FCFA", prompt: "100 FCFA + 200 FCFA = ?", choices: ["200", "250", "300", "400"], answer: 2 },
    { intro: "Le Marché • Soustraction", prompt: "Tu as 8 bananes, tu manges 3. Combien reste-t-il ?", visual: { emoji: "🍌", count: 8 }, choices: ["3", "4", "5", "6"], answer: 2 },
  ],
  ecole: [
    { intro: "L'École • English", prompt: "How do you say 'Bonjour' ?", choices: ["Bye", "Hello", "Thanks", "Please"], answer: 1 },
    { intro: "L'École • Colors", prompt: "What color is 'Rouge' ?", choices: ["Blue", "Green", "Red", "Yellow"], answer: 2 },
    { intro: "L'École • Numbers", prompt: "How do you say '3' ?", choices: ["Two", "Three", "Four", "Five"], answer: 1 },
  ],
  riviere: [
    { intro: "La Rivière • Fractions", prompt: "La moitié de 10 = ?", choices: ["3", "4", "5", "6"], answer: 2 },
    { intro: "La Rivière • Mesures", prompt: "Combien de doigts sur 2 mains ?", visual: { emoji: "✋", count: 2 }, choices: ["8", "10", "12", "5"], answer: 1 },
    { intro: "La Rivière • Problème", prompt: "Le poisson nage 5m, puis 5m. Combien au total ?", choices: ["5m", "10m", "15m", "20m"], answer: 1 },
  ],
  place: [
    { intro: "La Place • Défi bilingue", prompt: "Il y a 'three' mangues. Combien en français ?", visual: { emoji: "🥭", count: 3 }, choices: ["Deux", "Trois", "Quatre", "Cinq"], answer: 1 },
    { intro: "La Place • Défi bilingue", prompt: "'Two' + 'three' = ?", choices: ["Four", "Five", "Six", "Seven"], answer: 1 },
  ],
};

function Exercise() {
  const { district } = Route.useParams();
  const navigate = useNavigate();
  const { addSeeds, advanceDistrict } = useKpodji();
  const questions = useMemo(() => questionsByDistrict[district as DistrictId] ?? questionsByDistrict.marche, [district]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "right" | "wrong">("idle");

  const q = questions[step];
  const progress = ((step + (status !== "idle" ? 1 : 0)) / questions.length) * 100;

  const onCheck = () => {
    if (selected === null) return;
    if (selected === q.answer) {
      setStatus("right");
    } else {
      setStatus("wrong");
    }
  };

  const onNext = () => {
    if (step + 1 >= questions.length) {
      addSeeds(10);
      advanceDistrict(district as DistrictId, 10);
      navigate({ to: "/reward" });
    } else {
      setStep(step + 1);
      setSelected(null);
      setStatus("idle");
    }
  };

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center gap-3">
        <Link to="/" className="size-10 bg-white rounded-full shadow-sm ring-1 ring-black/5 grid place-items-center" aria-label="Fermer">
          <X className="size-4 text-deep-blue" />
        </Link>
        <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-leaf transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-xs font-bold text-deep-blue tabular-nums">{step + 1}/{questions.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <span className="text-[10px] font-display font-extrabold text-terracotta tracking-[0.25em] uppercase mb-3">
          {q.intro}
        </span>
        <h2 className="font-display text-2xl text-center text-deep-blue font-extrabold text-balance leading-tight mb-6">
          {q.prompt}
        </h2>

        {q.visual && (
          <div className="grid grid-cols-5 gap-2 mb-6 max-w-[280px] mx-auto">
            {Array.from({ length: q.visual.count }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-ocre/15 rounded-2xl grid place-items-center text-2xl animate-pop-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {q.visual!.emoji}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full mt-auto">
          {q.choices.map((c, i) => {
            const isSelected = selected === i;
            const isRight = status !== "idle" && i === q.answer;
            const isWrongPick = status === "wrong" && isSelected;
            return (
              <button
                key={c}
                disabled={status !== "idle"}
                onClick={() => setSelected(i)}
                className={`h-20 rounded-3xl bg-white border-2 text-2xl font-display font-extrabold shadow-sm transition-all
                  ${isRight ? "border-leaf ring-4 ring-leaf/20 text-leaf" : ""}
                  ${isWrongPick ? "border-terracotta ring-4 ring-terracotta/20 text-terracotta" : ""}
                  ${!isRight && !isWrongPick && isSelected ? "border-deep-blue text-deep-blue" : ""}
                  ${!isSelected && status === "idle" ? "border-border text-deep-blue" : ""}
                `}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 pb-8">
        {status === "idle" ? (
          <button
            onClick={onCheck}
            disabled={selected === null}
            className="w-full h-16 bg-leaf text-leaf-foreground rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide shadow-xl shadow-leaf/20 disabled:bg-neutral-300 disabled:shadow-none active:scale-[0.98]"
          >
            Vérifier
          </button>
        ) : (
          <div className="space-y-3">
            <div className={`rounded-2xl p-3 text-center font-display font-extrabold ${status === "right" ? "bg-leaf/15 text-leaf" : "bg-ocre/20 text-terracotta"}`}>
              {status === "right" ? "Bravo, c'est ça ! 🌟" : "Presque ! On regarde la bonne réponse ensemble. 💪"}
            </div>
            <button
              onClick={onNext}
              className="w-full h-16 bg-terracotta text-terracotta-foreground rounded-2xl font-display font-extrabold text-xl uppercase tracking-wide shadow-xl shadow-terracotta/30 active:scale-[0.98]"
            >
              Continuer
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
