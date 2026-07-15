import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useKpodji } from "@/lib/kpodji-store";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/parents/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  const { activeProfile, updateProfileSettings, lang, setLang } = useKpodji();

  const handleUpdateLimit = (min: number) => {
    updateProfileSettings(activeProfile.id, { timeLimit: min });
  };

  const handleUpdateBracket = (bracket: "4-6" | "7-8" | "9-10") => {
    updateProfileSettings(activeProfile.id, { levelBracket: bracket });
  };

  const handleToggleSound = (val: boolean) => {
    updateProfileSettings(activeProfile.id, { soundEnabled: val });
  };

  const handleToggleNotif = (val: boolean) => {
    updateProfileSettings(activeProfile.id, { notifEnabled: val });
  };

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center gap-3">
        <Link to="/parents/dashboard" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Réglages</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue">Configuration de {activeProfile.name}</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4 flex-1 overflow-y-auto">
        <Group title="Tranche d'âge & Niveau">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "4-6", label: "4-6 ans", desc: "Maternelle" },
              { id: "7-8", label: "7-8 ans", desc: "CE1/CE2" },
              { id: "9-10", label: "9-10 ans", desc: "CM1/CM2" }
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => handleUpdateBracket(o.id as any)}
                className={`py-3 px-2 rounded-2xl font-display flex flex-col items-center justify-center transition-all ${
                  activeProfile.levelBracket === o.id
                    ? "bg-terracotta text-white shadow-lg font-extrabold"
                    : "bg-white ring-1 ring-black/5 text-deep-blue font-bold"
                }`}
              >
                <span className="text-xs">{o.label}</span>
                <span className="text-[9px] opacity-75">{o.desc}</span>
              </button>
            ))}
          </div>
        </Group>

        <Group title="Limite de temps quotidienne">
          <div className="grid grid-cols-4 gap-1.5">
            {[15, 30, 45, 60].map((t) => (
              <button
                key={t}
                onClick={() => handleUpdateLimit(t)}
                className={`py-2.5 rounded-xl font-display font-extrabold text-xs transition ${
                  activeProfile.timeLimit === t
                    ? "bg-deep-blue text-white shadow-md"
                    : "bg-white ring-1 ring-black/5 text-deep-blue"
                }`}
              >
                {t} min
              </button>
            ))}
          </div>
        </Group>

        <Group title="Langue par défaut">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "fr", label: "Français 🇫🇷" },
              { id: "en", label: "English 🇬🇧" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setLang(o.id as any)}
                className={`h-14 rounded-2xl font-display font-extrabold text-sm ${
                  lang === o.id ? "bg-terracotta text-white shadow-lg" : "bg-white ring-1 ring-black/5 text-deep-blue"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Audio & Alertes">
          <Toggle
            label="Sons & musiques"
            desc="Effets sonores de victoire et voix"
            value={activeProfile.soundEnabled ?? true}
            onChange={handleToggleSound}
          />
          <Toggle
            label="Rappels quotidiens"
            desc="Rappeler doucement de continuer la série"
            value={activeProfile.notifEnabled ?? true}
            onChange={handleToggleNotif}
          />
        </Group>

        <Group title="Progression">
          <button
            onClick={() => {
              if (confirm(`Veux-tu vraiment effacer le progrès de ${activeProfile.name} ?`)) {
                alert("Réinitialisation effectuée !");
              }
            }}
            className="w-full h-12 rounded-2xl bg-white ring-1 ring-black/5 text-terracotta font-display font-extrabold text-sm text-left px-4 active:scale-98 transition"
          >
            Réinitialiser la progression
          </button>
        </Group>
      </div>

      <div className="h-6" />
    </PhoneFrame>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between bg-white ring-1 ring-black/5 rounded-2xl p-3 text-left"
    >
      <div>
        <p className="font-display font-extrabold text-sm text-deep-blue">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <div className={`w-11 h-6 rounded-full p-0.5 transition ${value ? "bg-leaf" : "bg-neutral-300"}`}>
        <div className={`size-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </div>
    </button>
  );
}
