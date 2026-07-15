import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji } from "@/lib/kpodji-store";
import { ArrowLeft, Users, Settings, TrendingUp, Clock, Flame, BookOpen, Lightbulb } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/parents/dashboard")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const { profiles, activeProfileId, setActiveProfileId, activeProfile } = useKpodji();

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

  const summaryText = useMemo(() => {
    const p = activeProfile;
    if (p.levelBracket === "4-6") {
      return `Cette semaine, ${p.name} a fait de super progrès ! Elle s'est entraînée à compter les fruits 🥭 et a appris de nouveaux mots simples en anglais. Elle adore écouter les comptines.`;
    } else if (p.levelBracket === "9-10") {
      return `Excellente semaine pour ${p.name}. Il maîtrise le calcul de monnaie en FCFA, comprend mieux le fonctionnement du cycle de l'eau et s'initie activement à la citoyenneté.`;
    } else {
      return `Superbe assiduité pour ${p.name} ! Ses exercices de calcul et son apprentissage de l'anglais progressent très bien. Elle a complété 3 mini-défis de Sciences.`;
    }
  }, [activeProfile]);

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/parents" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
            <ArrowLeft className="size-4 text-deep-blue" />
          </Link>
          <div>
            <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Espace parent</p>
            <h1 className="font-display text-xl font-extrabold text-deep-blue">Suivi & Progression</h1>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex-1 space-y-4 overflow-y-auto">
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
          <Stat icon={<Clock className="size-4" />} label="Temps" value={`${activeProfile.timeSpentThisWeek} min`} color="bg-river/15 text-river" />
          <Stat icon={<Flame className="size-4" />} label="Série" value={`${activeProfile.streak} j`} color="bg-terracotta/15 text-terracotta" />
          <Stat icon={<TrendingUp className="size-4" />} label="Étoiles" value={`${activeProfile.stars}`} color="bg-ocre/25 text-ocre-foreground" />
        </div>

        {/* Weekly digest / Narrative Report */}
        <div className="bg-gradient-to-br from-ocre/10 to-terracotta/5 rounded-3xl p-5 border border-ocre/20">
          <h3 className="font-display font-extrabold text-xs text-terracotta uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> Rapport de la semaine
          </h3>
          <p className="text-xs font-semibold text-deep-blue leading-relaxed">
            "{summaryText}"
          </p>
        </div>

        {/* Subjects Progression */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm space-y-3">
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
            Progression par matière
          </p>
          <div className="space-y-3">
            {activeProfile.districts.map((d) => (
              <Row key={d.id} label={d.name} value={d.progress} subject={d.subject} color={
                d.color === "ocre" ? "bg-ocre" :
                d.color === "river" ? "bg-river" :
                d.color === "leaf" ? "bg-leaf" : "bg-terracotta"
              } />
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm">
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
            Régularité (7 jours)
          </p>
          <div className="flex items-end justify-between gap-2 h-24">
            {[30, 60, 40, 80, 20, 90, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-leaf/20 rounded-t-lg relative overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-leaf to-leaf/60" />
                </div>
                <span className="text-[9px] font-display font-extrabold text-muted-foreground">{"LMMJVSD"[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Parental Advice / Tips */}
        <div className="bg-deep-blue/5 rounded-3xl p-5 border border-deep-blue/10 space-y-3">
          <h3 className="font-display font-extrabold text-xs text-deep-blue uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="size-4 text-[#ffc800]" fill="#ffc800" /> Conseils d'accompagnement
          </h3>
          <ul className="space-y-2">
            {tips.map((t, idx) => (
              <li key={idx} className="text-xs font-semibold text-deep-blue/80 flex gap-2">
                <span className="text-terracotta font-extrabold">{idx + 1}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Nav Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <Link
            to="/parents/enfants"
            className="bg-deep-blue text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.98] transition"
          >
            <Users className="size-5" />
            <div>
              <p className="font-display font-extrabold text-sm">Enfants</p>
              <p className="text-[10px] opacity-70">Gérer les profils</p>
            </div>
          </Link>
          <Link
            to="/parents/parametres"
            className="bg-white ring-1 ring-black/5 rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.98] transition"
          >
            <Settings className="size-5 text-terracotta" />
            <div>
              <p className="font-display font-extrabold text-sm text-deep-blue">Réglages</p>
              <p className="text-[10px] text-muted-foreground">Difficulté, temps</p>
            </div>
          </Link>
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
      <p className="font-display font-extrabold text-deep-blue text-base leading-none mt-0.5">{value}</p>
    </div>
  );
}

function Row({ label, value, subject, color }: { label: string; value: number; subject: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <div>
          <span className="font-display font-extrabold text-xs text-deep-blue block">{label}</span>
          <span className="text-[10px] text-muted-foreground block -mt-0.5">{subject}</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground font-bold tabular-nums">{value}%</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
