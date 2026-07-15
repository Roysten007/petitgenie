import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { Mascot } from "@/components/kpodji/Mascot";
import { useKpodji } from "@/lib/kpodji-store";
import { useState } from "react";
import { ArrowLeft, Sparkles, Check, Smile, Shirt, Crown } from "lucide-react";

export const Route = createFileRoute("/avatar")({
  component: AvatarPage,
});

const faces = ["🙂", "😃", "😊", "🤗", "😎", "🤩", "🦁", "🐰", "🦊", "🐼"];
const outfits = [
  { label: "Wax orange", color: "terracotta", style: { background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.48 0.18 28) 100%)" } },
  { label: "Wax bleu",   color: "deep-blue",  style: { background: "linear-gradient(135deg, oklch(0.22 0.10 255) 0%, oklch(0.16 0.08 268) 100%)" } },
  { label: "Wax vert",   color: "leaf",        style: { background: "linear-gradient(135deg, oklch(0.52 0.16 148) 0%, oklch(0.42 0.14 165) 100%)" } },
  { label: "Wax ocre",   color: "ocre",        style: { background: "linear-gradient(135deg, oklch(0.76 0.18 78) 0%, oklch(0.62 0.20 60) 100%)" } },
  { label: "Super-Héros",color: "gold",        style: { background: "linear-gradient(135deg, oklch(0.85 0.18 85) 0%, oklch(0.65 0.20 50) 100%)" } },
];
const accessories = ["✕", "🎩", "🕶️", "🧣", "👑", "🎧", "🎭", "🎒"];
const accessoryLabels = ["Aucun", "Chapeau", "Lunettes", "Foulard", "Couronne", "Casque", "Masque", "Sac"];

function AvatarPage() {
  const { avatar, setAvatar, setChildName, childName } = useKpodji();
  const [local, setLocal] = useState(avatar);
  const [name, setName] = useState(childName);
  const [activeTab, setActiveTab] = useState<"face" | "outfit" | "accessory">("face");
  const navigate = useNavigate();

  const handleSave = () => {
    setAvatar(local);
    setChildName(name);
    navigate({ to: "/" });
  };

  return (
    <PhoneFrame>
      <TopBar showStreak={false} />

      {/* Header */}
      <div className="px-3 flex items-center gap-3 mb-2">
        <Link
          to="/"
          className="size-9 glass rounded-full shadow-sm grid place-items-center transition-transform active:scale-90 shrink-0"
        >
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-ocre">Crée ton personnage</p>
          <h1 className="font-display text-xl font-extrabold text-deep-blue leading-tight">Mon Avatar Fun</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden px-3">
        {/* Name input - compact */}
        <div className="mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-2xl font-display font-bold text-deep-blue text-center text-base focus:outline-none transition-all"
            style={{
              background: "oklch(1 0 0 / 80%)",
              border: "2px solid oklch(0.88 0.025 78)",
            }}
            placeholder="Ton prénom..."
          />
        </div>

        {/* ── Giant Avatar Live Preview Card ── */}
        <div
          className="relative rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden h-44 mb-3"
          style={{
            background: "linear-gradient(145deg, oklch(0.76 0.18 78 / 15%) 0%, oklch(0.58 0.20 38 / 10%) 100%)",
            border: "1.5px solid oklch(0.76 0.18 78 / 20%)",
          }}
        >
          <div className="wax-dots absolute inset-0 opacity-20" />
          
          {/* Pulsing glow under avatar */}
          <div
            className="absolute size-28 rounded-full animate-pulse"
            style={{ background: "radial-gradient(circle, oklch(0.76 0.18 78 / 30%) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Visual Outfit base */}
            <div
              className="size-24 rounded-full grid place-items-center text-5xl border-[4px] border-white shadow-xl relative transition-transform duration-300 hover:scale-110"
              style={{
                ...outfits[local.outfit]?.style,
              }}
            >
              {faces[local.face]}

              {/* Accessories placed on or above head */}
              {local.accessory > 0 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-3xl drop-shadow-md select-none">
                  {accessories[local.accessory]}
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-2 right-2.5">
            <Sparkles className="size-5 text-ocre animate-bounce" />
          </div>
        </div>

        {/* ── Sub Navigation Tabs ── */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-black/5 mb-3">
          <button
            onClick={() => setActiveTab("face")}
            className={`flex-1 py-2 rounded-xl font-display font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "face" ? "bg-white text-deep-blue shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Smile className="size-3.5" />
            Visages
          </button>
          <button
            onClick={() => setActiveTab("outfit")}
            className={`flex-1 py-2 rounded-xl font-display font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "outfit" ? "bg-white text-deep-blue shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Shirt className="size-3.5" />
            Wax
          </button>
          <button
            onClick={() => setActiveTab("accessory")}
            className={`flex-1 py-2 rounded-xl font-display font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "accessory" ? "bg-white text-deep-blue shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Crown className="size-3.5" />
            Style
          </button>
        </div>

        {/* ── Customization Panel Content ── */}
        <div className="flex-1 overflow-y-auto pr-1 pb-3">
          {activeTab === "face" && (
            <div className="grid grid-cols-5 gap-2">
              {faces.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setLocal({ ...local, face: i })}
                  className="aspect-square rounded-2xl text-3xl grid place-items-center transition-all active:scale-90"
                  style={local.face === i ? {
                    background: "linear-gradient(135deg, oklch(0.58 0.20 38) 0%, oklch(0.48 0.18 28) 100%)",
                    boxShadow: "0 4px 16px oklch(0.58 0.20 38 / 45%)",
                    color: "white"
                  } : {
                    background: "oklch(1 0 0 / 80%)",
                    border: "1.5px solid oklch(0.88 0.025 78)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {activeTab === "outfit" && (
            <div className="grid grid-cols-3 gap-2">
              {outfits.map((o, i) => (
                <button
                  key={o.label}
                  onClick={() => setLocal({ ...local, outfit: i })}
                  className="h-16 rounded-2xl relative shadow-sm transition-all active:scale-95 flex flex-col justify-end p-1.5"
                  style={{
                    ...o.style,
                    outline: local.outfit === i ? "3px solid oklch(0.58 0.20 38)" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {local.outfit === i && (
                    <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white flex items-center justify-center shadow">
                      <Check className="size-3 text-deep-blue" strokeWidth={3} />
                    </div>
                  )}
                  <span className="text-[9px] font-display font-extrabold text-white bg-black/25 px-1.5 py-0.5 rounded-md truncate w-full text-center">
                    {o.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {activeTab === "accessory" && (
            <div className="grid grid-cols-4 gap-2">
              {accessories.map((a, i) => (
                <button
                  key={a}
                  onClick={() => setLocal({ ...local, accessory: i })}
                  className="aspect-square rounded-2xl text-3xl grid place-items-center transition-all active:scale-90"
                  style={local.accessory === i ? {
                    background: "linear-gradient(135deg, oklch(0.22 0.10 255) 0%, oklch(0.16 0.08 268) 100%)",
                    boxShadow: "0 4px 16px oklch(0.22 0.10 255 / 40%)",
                    color: "white"
                  } : {
                    background: "oklch(1 0 0 / 80%)",
                    border: "1.5px solid oklch(0.88 0.025 78)",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Save CTA ── */}
        <div className="py-3 shrink-0">
          <button
            onClick={handleSave}
            className="w-full h-14 rounded-2xl font-display font-extrabold text-lg text-white relative overflow-hidden active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg, oklch(0.52 0.16 148) 0%, oklch(0.38 0.14 165) 100%)",
              boxShadow: "0 8px 24px oklch(0.52 0.16 148 / 40%)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Valider mon Personnage 🚀
            </span>
            <div className="absolute inset-0 animate-shimmer opacity-50 pointer-events-none" />
          </button>
        </div>
      </div>

      <BottomNav />
    </PhoneFrame>
  );
}
