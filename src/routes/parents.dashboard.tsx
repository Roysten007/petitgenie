import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji } from "@/lib/kpodji-store";
import { useMemo, useState } from "react";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/parents/dashboard")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const { profiles, activeProfileId, setActiveProfileId, activeProfile, updateProfileSettings, setLastRaconteFiche } = useKpodji();

  const tips = useMemo(() => {
    if (activeProfile.levelBracket === "4-6") {
      return [
        "Compter des fruits : Au marché ou en cuisinant, demandez à l'enfant de compter 2 ou 3 oignons.",
        "Mots bilingues imagés : Pointez un objet (ex. un livre) et demandez 'How do you say in English ?'",
        "Comptines en famille : Chantez ensemble des comptines courtes du village pour stimuler l'écoute."
      ];
    } else if (activeProfile.levelBracket === "9-10") {
      return [
        "Fractions pratiques : Partagez un gâteau ou une orange en parts égales et demandez d'exprimer les fractions (1/4, 2/4).",
        "Discussion citoyenne : Parlez de la propreté du village et de l'importance de trier les déchets.",
        "Lecture partagée : Demandez-lui d'expliquer comment fonctionne l'électricité à partir de son quiz."
      ];
    } else {
      return [
        "Faire l'appoint : Donnez quelques pièces en FCFA et laissez l'enfant payer son pain ou ses fruits.",
        "Le cycle de l'eau : Demandez-lui de vous expliquer le voyage d'une goutte de pluie 🌧️.",
        "Aider un ami : Parlez d'une situation où il a aidé un camarade et félicitez-le 🤝."
      ];
    }
  }, [activeProfile.levelBracket]);

  const handleClearFiche = () => {
    sfx.playSuccess();
    setLastRaconteFiche(null);
  };

  const handleLevelChange = (module: "alphabet" | "marche" | "science", lvl: 1 | 2 | 3) => {
    sfx.playTap();
    if (module === "alphabet") updateProfileSettings(activeProfileId, { levelAlphabet: lvl });
    if (module === "marche") updateProfileSettings(activeProfileId, { levelMarche: lvl });
    if (module === "science") updateProfileSettings(activeProfileId, { levelScience: lvl });
  };

  const handleTimeLimitChange = (limit: number) => {
    sfx.playTap();
    updateProfileSettings(activeProfileId, { timeLimit: limit });
  };

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/parents" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center active:scale-90 transition-transform">
            <i className="fa-solid fa-arrow-left text-deep-blue" />
          </Link>
          <div>
            <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-[#a34e36]">Espace Parent</p>
            <h1 className="font-display text-xl font-extrabold text-deep-blue">Suivi & Contrôle</h1>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex-1 space-y-5 overflow-y-auto pb-10">
        
        {/* Child Selector Tabs */}
        <div className="bg-neutral-100 p-1.5 rounded-2xl flex gap-1">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProfileId(p.id)}
                className={`flex-1 py-2 text-center rounded-xl font-display font-extrabold text-xs transition ${
                  isActive ? "bg-white text-deep-blue shadow-sm" : "text-muted-foreground hover:text-deep-blue"
                }`}
              >
                {p.name} ({p.age} ans)
              </button>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={<i className="fa-solid fa-clock" />} label="Temps" value={`${activeProfile.timeSpentThisWeek} min`} color="bg-river/15 text-river" />
          <Stat icon={<i className="fa-solid fa-fire" />} label="Série" value={`${activeProfile.streak} j`} color="bg-terracotta/15 text-terracotta" />
          <Stat icon={<i className="fa-solid fa-star text-ocre" />} label="Sagesse" value={`${activeProfile.xp} XP`} color="bg-ocre/25 text-ocre-foreground" />
        </div>

        {/* 📢 Live Parent Question Box ("Raconte à quelqu'un") */}
        <div className="bg-gradient-to-br from-ocre/10 to-terracotta/5 rounded-3xl p-5 border border-ocre/25 space-y-3">
          <h3 className="font-display font-extrabold text-xs text-[#a34e36] uppercase tracking-wider flex items-center gap-1.5">
            <i className="fa-solid fa-bullhorn" /> Dernier récit à valider
          </h3>
          
          {activeProfile.lastRaconteFiche ? (
            <div className="space-y-3 animate-fade-scale">
              <div className="space-y-1">
                <p className="font-display font-extrabold text-deep-blue text-xs">
                  {activeProfile.lastRaconteFiche.title}
                </p>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {activeProfile.lastRaconteFiche.content}
                </p>
              </div>
              
              <div className="bg-white border border-ocre/20 rounded-xl p-3 shadow-inner">
                <p className="text-[10px] font-semibold text-ocre-foreground leading-relaxed flex items-start gap-1.5">
                  <i className="fa-solid fa-lightbulb text-ocre shrink-0 mt-0.5" />
                  <span>{activeProfile.lastRaconteFiche.question}</span>
                </p>
              </div>

              <button
                onClick={handleClearFiche}
                className="w-full py-2 bg-leaf hover:bg-leaf-dark text-white font-display font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <i className="fa-solid fa-check-double" />
                L'enfant m'a raconté ! (Valider)
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-neutral-500 italic leading-relaxed">
              Aucun chapitre validé récemment. Dès que votre enfant terminera une leçon et viendra vous raconter, sa fiche de questions apparaîtra ici.
            </p>
          )}
        </div>

        {/* ⚙️ Difficulty Adjustments */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground">
            Ajustement des niveaux (Griot)
          </h3>
          
          <div className="space-y-4">
            {/* Alphabet */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display font-extrabold text-xs text-deep-blue">1. Alphabet & Sons</p>
                <p className="text-[9px] text-neutral-500">Mots du marché & phonétique</p>
              </div>
              <div className="flex bg-neutral-100 p-1 rounded-xl gap-0.5 shrink-0">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange("alphabet", lvl as 1 | 2 | 3)}
                    className={`size-7 rounded-lg text-xs font-display font-extrabold transition-all ${
                      activeProfile.levelAlphabet === lvl
                        ? "bg-ocre text-white shadow-xs"
                        : "text-neutral-500 hover:text-deep-blue"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Marché */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display font-extrabold text-xs text-deep-blue">2. Le Marché (Maths)</p>
                <p className="text-[9px] text-neutral-500">Calculs & Monnaie FCFA</p>
              </div>
              <div className="flex bg-neutral-100 p-1 rounded-xl gap-0.5 shrink-0">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange("marche", lvl as 1 | 2 | 3)}
                    className={`size-7 rounded-lg text-xs font-display font-extrabold transition-all ${
                      activeProfile.levelMarche === lvl
                        ? "bg-[#a34e36] text-white shadow-xs"
                        : "text-neutral-500 hover:text-deep-blue"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Sciences */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display font-extrabold text-xs text-deep-blue">3. Sciences locales</p>
                <p className="text-[9px] text-neutral-500">Nature & Cycle de l'eau</p>
              </div>
              <div className="flex bg-neutral-100 p-1 rounded-xl gap-0.5 shrink-0">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange("science", lvl as 1 | 2 | 3)}
                    className={`size-7 rounded-lg text-xs font-display font-extrabold transition-all ${
                      activeProfile.levelScience === lvl
                        ? "bg-[#489e28] text-white shadow-xs"
                        : "text-neutral-500 hover:text-deep-blue"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ⏱️ Screen Time Regulation */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground">
              Limiteur de Temps d'Écran
            </h3>
            {activeProfile.timeSpentThisWeek >= activeProfile.timeLimit && (
              <span className="text-[9px] font-display font-extrabold bg-terracotta/20 text-terracotta px-2 py-0.5 rounded-full animate-pulse uppercase">
                Verrouillé
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-display font-extrabold text-xs text-deep-blue">Temps alloué quotidien</p>
                <p className="text-[9px] text-neutral-500">
                  Consommé : {activeProfile.timeSpentThisWeek} min / {activeProfile.timeLimit} min
                </p>
              </div>
              <span className="font-display font-extrabold text-sm text-[#a34e36]">{activeProfile.timeLimit} min</span>
            </div>

            {/* Selector Buttons */}
            <div className="flex gap-2">
              {[0, 15, 30, 45, 60].map((limit) => (
                <button
                  key={limit}
                  onClick={() => handleTimeLimitChange(limit)}
                  className={`flex-1 py-2 text-center text-xs font-display font-extrabold rounded-xl transition ${
                    activeProfile.timeLimit === limit
                      ? "bg-deep-blue text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {limit === 0 ? "0 min" : `${limit}m`}
                </button>
              ))}
            </div>
            {/* Removed debug info */}
          </div>
        </div>

        {/* Reset Demo Button inside Parents space */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground">
            Contrôle Démo
          </h3>
          <button
            onClick={() => {
              sfx.playSuccess();
              updateProfileSettings(activeProfileId, {
                timeSpentThisWeek: 0,
                completedChapters: [],
                levelAlphabet: 1,
                levelMarche: 1,
                levelScience: 1,
                lastRaconteFiche: null,
                xp: 0,
                seeds: 0,
              });
              alert("Démo réinitialisée ! Tout est remis à zéro.");
            }}
            className="w-full h-12 bg-terracotta/10 text-terracotta hover:bg-terracotta/20 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-terracotta/35"
          >
            <i className="fa-solid fa-rotate-left" />
            Réinitialiser la Démo
          </button>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm">
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
            Régularité d'apprentissage (minutes)
          </p>
          <div className="flex items-end justify-between gap-2 h-20">
            {[10, 15, 8, 25, 20, 30, 12].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-leaf/25 rounded-t-lg relative overflow-hidden" style={{ height: `${(h / 30) * 100}%` }}>
                  <div className="absolute inset-0 bg-[#a34e36]/70" />
                </div>
                <span className="text-[9px] font-display font-extrabold text-muted-foreground">{"LMMJVSD"[i]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PhoneFrame>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white ring-1 ring-black/5 rounded-2xl p-3 shadow-sm">
      <div className={`size-8 rounded-xl grid place-items-center ${color}`}>{icon}</div>
      <p className="text-[10px] font-display font-extrabold uppercase text-muted-foreground mt-2">{label}</p>
      <p className="font-display font-extrabold text-deep-blue text-sm leading-none mt-0.5">{value}</p>
    </div>
  );
}
