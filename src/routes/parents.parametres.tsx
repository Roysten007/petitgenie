import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/parents/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  const [lang, setLang] = useState("fr");
  const [level, setLevel] = useState("moyen");
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <PhoneFrame>
      <div className="px-5 pt-12 flex items-center gap-3">
        <Link to="/parents/dashboard" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Paramètres</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue">Réglages</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        <Group title="Langue par défaut">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "fr", label: "Français 🇫🇷" },
              { id: "en", label: "English 🇬🇧" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setLang(o.id)}
                className={`h-14 rounded-2xl font-display font-extrabold text-sm ${
                  lang === o.id ? "bg-terracotta text-white shadow-lg" : "bg-white ring-1 ring-black/5 text-deep-blue"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Niveau de difficulté">
          <div className="grid grid-cols-3 gap-2">
            {["facile", "moyen", "avancé"].map((o) => (
              <button
                key={o}
                onClick={() => setLevel(o)}
                className={`h-12 rounded-2xl font-display font-extrabold text-xs capitalize ${
                  level === o ? "bg-deep-blue text-white shadow-lg" : "bg-white ring-1 ring-black/5 text-deep-blue"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Général">
          <Toggle label="Notifications" desc="Rappel doux du défi du jour" value={notif} onChange={setNotif} />
          <Toggle label="Sons & musiques" desc="Comptines et effets" value={sound} onChange={setSound} />
        </Group>

        <Group title="Compte">
          <button className="w-full h-12 rounded-2xl bg-white ring-1 ring-black/5 text-deep-blue font-display font-extrabold text-sm text-left px-4">
            Changer le code parent
          </button>
          <button className="w-full h-12 rounded-2xl bg-white ring-1 ring-black/5 text-terracotta font-display font-extrabold text-sm text-left px-4">
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
