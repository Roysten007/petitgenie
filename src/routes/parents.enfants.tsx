import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { ArrowLeft, Plus, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/parents/enfants")({
  component: EnfantsPage,
});

const children = [
  { name: "Amadou", age: 7, avatar: "🙂", color: "bg-terracotta", progress: 78, streak: 4 },
  { name: "Fatou", age: 5, avatar: "😊", color: "bg-ocre", progress: 42, streak: 2 },
  { name: "Kofi", age: 9, avatar: "😎", color: "bg-river", progress: 91, streak: 12 },
];

function EnfantsPage() {
  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center gap-3">
        <Link to="/parents/dashboard" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Multi-profils</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue">Mes enfants</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {children.map((c) => (
          <div key={c.name} className="bg-white ring-1 ring-black/5 rounded-3xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`size-14 rounded-2xl ${c.color} grid place-items-center text-2xl shrink-0 shadow-md`}>
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-extrabold text-deep-blue">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{c.age} ans · 🔥 {c.streak} jours</p>
              <div className="mt-1.5 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full ${c.color}`} style={{ width: `${c.progress}%` }} />
              </div>
            </div>
            <ChevronRight className="size-5 text-neutral-300 shrink-0" />
          </div>
        ))}

        <button className="w-full h-14 border-2 border-dashed border-terracotta/40 text-terracotta rounded-2xl font-display font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition">
          <Plus className="size-4" />
          Ajouter un enfant
        </button>
      </div>

      <div className="h-6" />
    </PhoneFrame>
  );
}
