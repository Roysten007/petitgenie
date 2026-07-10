import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/parents")({
  component: ParentsLogin,
});

function ParentsLogin() {
  const [pin, setPin] = useState<string[]>([]);
  const navigate = useNavigate();
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
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-ocre">Espace adulte</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="size-16 rounded-2xl bg-ocre grid place-items-center shadow-xl mb-4">
          <ShieldCheck className="size-8 text-deep-blue" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-white mb-2">Parent ou enseignant ?</h1>
        <p className="text-white/70 text-sm max-w-[28ch] mb-8">
          Entre ton code à 4 chiffres pour voir la progression.
        </p>

        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`size-4 rounded-full ${pin[i] !== undefined ? "bg-ocre" : "bg-white/20"}`}
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
    </PhoneFrame>
  );
}
