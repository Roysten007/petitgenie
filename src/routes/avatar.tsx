import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/avatar")({
  component: AvatarPage,
});

const faces = ["🙂", "😃", "😊", "🤗", "😎", "🤩"];
const outfits = [
  { label: "Wax orange", color: "bg-terracotta" },
  { label: "Wax bleu", color: "bg-deep-blue" },
  { label: "Wax vert", color: "bg-leaf" },
  { label: "Wax ocre", color: "bg-ocre" },
];
const accessories = ["Aucun", "Chapeau", "Lunettes", "Foulard"];

function AvatarPage() {
  const { avatar, setAvatar, setChildName, childName } = useKpodji();
  const [local, setLocal] = useState(avatar);
  const [name, setName] = useState(childName);
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <TopBar showStreak={false} />

      <div className="px-5 flex items-center gap-3 mb-2">
        <Link to="/" className="size-10 rounded-full bg-white shadow ring-1 ring-black/5 grid place-items-center">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <h1 className="font-display text-xl font-extrabold text-deep-blue">Mon avatar</h1>
      </div>

      <div className="px-5">
        {/* Preview */}
        <div className="relative rounded-3xl bg-gradient-to-br from-ocre/25 to-terracotta/15 p-6 flex items-center justify-center wax-dots">
          <div className="relative">
            <div
              className={`size-32 rounded-full ${outfits[local.outfit].color} shadow-xl grid place-items-center text-6xl border-8 border-white`}
            >
              {faces[local.face]}
            </div>
            {local.accessory > 0 && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl">
                {["", "🎩", "🕶️", "🧣"][local.accessory]}
              </div>
            )}
          </div>
          <Mascot size={64} className="absolute bottom-2 right-3" />
        </div>

        {/* Name */}
        <div className="mt-4">
          <label className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground">Prénom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full h-12 px-4 rounded-2xl bg-white border-2 border-border font-display font-bold text-deep-blue text-lg focus:outline-none focus:border-terracotta"
          />
        </div>

        {/* Faces */}
        <Section title="Visage">
          <div className="grid grid-cols-6 gap-2">
            {faces.map((f, i) => (
              <button
                key={f}
                onClick={() => setLocal({ ...local, face: i })}
                className={`aspect-square rounded-2xl text-2xl grid place-items-center transition ${
                  local.face === i ? "bg-terracotta text-white shadow-lg scale-105" : "bg-white ring-1 ring-black/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Vêtement">
          <div className="grid grid-cols-4 gap-2">
            {outfits.map((o, i) => (
              <button
                key={o.label}
                onClick={() => setLocal({ ...local, outfit: i })}
                className={`h-14 rounded-2xl ${o.color} relative shadow-md ${
                  local.outfit === i ? "ring-4 ring-terracotta ring-offset-2" : ""
                }`}
                aria-label={o.label}
              >
                {local.outfit === i && <Check className="absolute inset-0 m-auto size-6 text-white" />}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Accessoire">
          <div className="grid grid-cols-4 gap-2">
            {accessories.map((a, i) => (
              <button
                key={a}
                onClick={() => setLocal({ ...local, accessory: i })}
                className={`h-14 rounded-2xl text-2xl grid place-items-center font-display font-bold text-xs ${
                  local.accessory === i ? "bg-deep-blue text-white shadow-lg" : "bg-white ring-1 ring-black/5 text-deep-blue"
                }`}
              >
                {["✕", "🎩", "🕶️", "🧣"][i]}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <div className="p-5 mt-auto">
        <button
          onClick={() => {
            setAvatar(local);
            setChildName(name);
            navigate({ to: "/" });
          }}
          className="w-full h-14 bg-terracotta text-terracotta-foreground rounded-2xl font-display font-extrabold text-lg shadow-xl shadow-terracotta/30 active:scale-[0.98]"
        >
          C'est moi !
        </button>
      </div>

      <BottomNav />
    </PhoneFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
      {children}
    </div>
  );
}
