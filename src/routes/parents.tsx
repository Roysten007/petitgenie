import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/parents")({
  component: ParentsLogin,
});

function ParentsLogin() {
  const [pin, setPin] = useState<string[]>([]);
  const [mathAnswer, setMathAnswer] = useState("");
  const [gatePassed, setGatePassed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathAnswer.trim() === "56") {
      setGatePassed(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Calcul incorrect. Demande à un adulte !");
    }
  };

  const push = (n: string) => {
    if (pin.length >= 4) return;
    const next = [...pin, n];
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => navigate({ to: "/parents/dashboard" }), 300);
    }
  };

  return (
    <PhoneFrame dark>
      <div className="px-5 pt-12 flex items-center gap-3">
        <Link to="/" className="size-10 bg-white/10 rounded-full grid place-items-center">
          <ArrowLeft className="size-4 text-white" />
        </Link>
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-ocre">Espace Adulte</p>
      </div>

      {!gatePassed ? (
        // Math Parental Gate Screen
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="size-16 rounded-2xl bg-terracotta grid place-items-center shadow-xl mb-6 animate-bounce">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white mb-2">Sécurité parentale</h1>
          <p className="text-white/70 text-xs max-w-[30ch] mb-4">
            Pour entrer, résous ce calcul simple pour prouver que tu es un adulte.
          </p>

          {/* Pedagogical Grounding Statement */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left max-w-sm mb-5 text-[11px] text-white/80 leading-relaxed">
            <p className="font-display font-extrabold text-[9px] text-ocre uppercase tracking-wider mb-1">
              🌱 Fondement Pédagogique
            </p>
            Kpodji réinvente l'apprentissage bilingue pour enfants en mariant <strong>l'oralité traditionnelle du griot</strong> avec le renforcement cognitif interactif. En ancrant chaque notion dans un conte culturel ouest-africain, nous stimulons la mémoire auditive et favorisons un bilinguisme naturel.
          </div>

          <form onSubmit={handleVerifyGate} className="w-full max-w-[240px] space-y-4">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <label className="block text-white/50 text-xs font-display font-bold uppercase tracking-wider mb-2">
                Calcul
              </label>
              <div className="text-2xl font-display font-extrabold text-white mb-2">
                8 x 7 = ?
              </div>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="numeric"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Ta réponse..."
                className="w-full text-center bg-white/15 border border-white/10 rounded-xl py-2.5 text-white font-display font-bold text-lg focus:outline-none focus:ring-2 focus:ring-ocre"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-terracotta bg-white rounded-xl py-2 px-3 text-xs font-bold animate-shake">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-ocre hover:bg-ocre/90 active:scale-[0.98] transition rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider text-deep-blue shadow-lg"
            >
              Valider ✓
            </button>
          </form>
        </div>
      ) : (
        // PIN Screen (Accessed only after passing parent gate)
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-pop-in">
          <div className="size-16 rounded-2xl bg-ocre grid place-items-center shadow-xl mb-4">
            <ShieldCheck className="size-8 text-deep-blue" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white mb-2">Code adulte requis</h1>
          <p className="text-white/70 text-sm max-w-[28ch] mb-8">
            Entre ton code secret à 4 chiffres pour accéder au suivi.
          </p>

          <div className="flex gap-3 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`size-4 rounded-full ${pin[i] !== undefined ? "bg-ocre animate-ping" : "bg-white/20"}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) =>
              k === "" ? (
                <div key={i} />
              ) : (
                <button
                  key={i}
                  onClick={() => (k === "⌫" ? setPin(pin.slice(0, -1)) : push(k))}
                  className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-display font-extrabold text-2xl active:scale-95 transition"
                >
                  {k}
                </button>
              ),
            )}
          </div>

          <p className="text-white/40 text-[11px] mt-6">Astuce jury : tape n'importe quel code</p>
        </div>
      )}
    </PhoneFrame>
  );
}
