import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/badges")({
  component: BadgesPage,
});

function BadgesPage() {
  const { badges } = useKpodji();
  const unlocked = badges.filter((b) => b.unlocked).length;
  return (
    <PhoneFrame>
      <TopBar />
      <div className="px-5">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Ma collection</p>
        <h1 className="font-display text-2xl font-extrabold text-deep-blue">Badges</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {unlocked} / {badges.length} débloqués
        </p>
      </div>

      <div className="mx-5 mt-4 h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ocre to-terracotta" style={{ width: `${(unlocked / badges.length) * 100}%` }} />
      </div>

      <div className="px-5 mt-5 grid grid-cols-3 gap-3">
        {badges.map((b, i) => (
          <div
            key={b.id}
            className={`aspect-square rounded-3xl p-3 flex flex-col items-center justify-center text-center animate-pop-in ${
              b.unlocked
                ? "bg-white ring-1 ring-black/5 shadow-md"
                : "bg-neutral-100 border-2 border-dashed border-neutral-300"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`text-3xl mb-1 ${b.unlocked ? "" : "grayscale opacity-30"}`}>
              {b.unlocked ? b.emoji : <Lock className="size-6 text-neutral-400" />}
            </div>
            <p className={`text-[10px] font-display font-extrabold leading-tight ${b.unlocked ? "text-deep-blue" : "text-neutral-400"}`}>
              {b.name}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{b.unlocked ? b.desc : "Verrouillé"}</p>
          </div>
        ))}
      </div>

      <div className="h-6" />
      <BottomNav />
    </PhoneFrame>
  );
}
