import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji } from "@/lib/kpodji-store";

export const Route = createFileRoute("/parents/enfants")({
  component: EnfantsPage,
});

function EnfantsPage() {
  const { profiles, activeProfileId, setActiveProfileId } = useKpodji();
  const navigate = useNavigate();

  const faces = ["🦁", "🐰", "🦊", "🐼", "🙂", "😃", "😊", "🤗", "😎", "🤩"];

  const handleSelectChild = (id: string) => {
    setActiveProfileId(id);
    navigate({ to: "/parents/dashboard" });
  };

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center gap-3">
        <Link to="/parents/dashboard" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center active:scale-90 transition-transform">
          <i className="fa-solid fa-arrow-left text-deep-blue" />
        </Link>
        <div>
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Multi-profils</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue">Mes enfants</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3 flex-1 overflow-y-auto">
        <p className="text-xs text-muted-foreground mb-2">
          Sélectionne un profil pour voir ses statistiques détaillées et ajuster ses réglages.
        </p>

        {profiles.map((c) => {
          const isActive = c.id === activeProfileId;
          const currentFace = faces[c.avatar.face] || "🙂";
          
          const avgProgress = Math.round(
            c.districts.reduce((sum, d) => sum + d.progress, 0) / c.districts.length
          );

          return (
            <button
              key={c.id}
              onClick={() => handleSelectChild(c.id)}
              className={`w-full text-left bg-white ring-1 ring-black/5 rounded-3xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.99] transition ${
                isActive ? "ring-2 ring-terracotta bg-terracotta/5" : ""
              }`}
            >
              <div className={`size-14 rounded-2xl grid place-items-center text-2xl shrink-0 shadow-md ${
                c.levelBracket === "4-6" ? "bg-ocre" :
                c.levelBracket === "9-10" ? "bg-river" : "bg-terracotta"
              }`}>
                {currentFace}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-extrabold text-deep-blue text-base leading-none">{c.name}</p>
                  {isActive && (
                    <span className="bg-terracotta text-white text-[8px] font-display font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                      Actif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {c.age} ans · Tranche {c.levelBracket} ans · 🔥 {c.streak} j
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${
                      c.levelBracket === "4-6" ? "bg-ocre" :
                      c.levelBracket === "9-10" ? "bg-river" : "bg-terracotta"
                    }`} style={{ width: `${avgProgress}%` }} />
                  </div>
                  <span className="font-mono text-[9px] font-bold text-muted-foreground">{avgProgress}%</span>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-neutral-300 text-sm shrink-0" />
            </button>
          );
        })}

        <button 
          onClick={() => alert("Fonctionnalité premium de création de compte : synchronisation cloud bientôt disponible !")}
          className="w-full h-14 border-2 border-dashed border-terracotta/40 text-terracotta rounded-2xl font-display font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
        >
          <i className="fa-solid fa-plus text-xs" />
          Ajouter un enfant
        </button>
      </div>

      <div className="h-6" />
    </PhoneFrame>
  );
}
