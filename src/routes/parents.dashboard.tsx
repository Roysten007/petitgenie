import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji } from "@/lib/kpodji-store";
import { ArrowLeft, Users, Settings, TrendingUp, Clock, Flame } from "lucide-react";

export const Route = createFileRoute("/parents/dashboard")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const { childName, streak, badges } = useKpodji();
  const unlocked = badges.filter((b) => b.unlocked);

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/parents" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
            <ArrowLeft className="size-4 text-deep-blue" />
          </Link>
          <div>
            <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Espace parent</p>
            <h1 className="font-display text-xl font-extrabold text-deep-blue">Suivi de {childName}</h1>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex-1 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={<Clock className="size-4" />} label="Temps" value="45 min" color="bg-river/15 text-river" />
          <Stat icon={<Flame className="size-4" />} label="Série" value={`${streak} j`} color="bg-terracotta/15 text-terracotta" />
          <Stat icon={<TrendingUp className="size-4" />} label="Étoiles" value="12" color="bg-ocre/25 text-ocre-foreground" />
        </div>

        {/* Progress by subject */}
        <div className="bg-white ring-1 ring-black/5 rounded-3xl p-5 shadow-sm">
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
            Progression cette semaine
          </p>
          <div className="space-y-4">
            <Row label="Mathématiques" value={78} color="bg-ocre" />
            <Row label="Anglais" value={42} color="bg-river" />
            <Row label="Défis bilingues" value={60} color="bg-terracotta" />
          </div>
        </div>

        {/* Weekly chart */}
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

        {/* Recent badges */}
        <div className="bg-ocre/10 rounded-3xl p-4">
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta mb-2">
            Derniers badges
          </p>
          <div className="flex gap-2 overflow-x-auto">
            {unlocked.map((b) => (
              <div key={b.id} className="shrink-0 bg-white rounded-2xl p-3 shadow-sm min-w-[130px]">
                <div className="text-2xl mb-1">{b.emoji}</div>
                <p className="text-[11px] font-display font-extrabold text-deep-blue leading-tight">{b.name}</p>
                <p className="text-[10px] text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/parents/enfants"
            className="bg-deep-blue text-deep-blue-foreground rounded-2xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.98] transition"
          >
            <Users className="size-5" />
            <div>
              <p className="font-display font-extrabold text-sm">Enfants</p>
              <p className="text-[11px] opacity-70">Gérer les profils</p>
            </div>
          </Link>
          <Link
            to="/parents/parametres"
            className="bg-white ring-1 ring-black/5 rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.98] transition"
          >
            <Settings className="size-5 text-terracotta" />
            <div>
              <p className="font-display font-extrabold text-sm text-deep-blue">Réglages</p>
              <p className="text-[11px] text-muted-foreground">Langue, niveau</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="h-6" />
    </PhoneFrame>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white ring-1 ring-black/5 rounded-2xl p-3 shadow-sm">
      <div className={`size-8 rounded-xl grid place-items-center ${color}`}>{icon}</div>
      <p className="text-[10px] font-display font-extrabold uppercase text-muted-foreground mt-2">{label}</p>
      <p className="font-display font-extrabold text-deep-blue text-lg leading-none">{value}</p>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-display font-extrabold text-sm text-deep-blue">{label}</span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
