import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { Play, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/comptines")({
  component: ComptinesPage,
});

const gradients = ["from-ocre to-terracotta", "from-terracotta to-deep-blue", "from-river to-leaf", "from-leaf to-ocre"];

function ComptinesPage() {
  const { rhymes, lang } = useKpodji();
  return (
    <PhoneFrame>
      <TopBar />
      <div className="px-5 flex items-center gap-3">
        <Link to="/" className="size-10 bg-white rounded-full shadow ring-1 ring-black/5 grid place-items-center">
          <ArrowLeft className="size-4 text-deep-blue" />
        </Link>
        <div>
          <p className="text-[11px] font-display font-extrabold uppercase tracking-widest text-terracotta">Chanter</p>
          <h1 className="font-display text-2xl font-extrabold text-deep-blue">Comptines</h1>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {rhymes.map((r, i) => (
          <button
            key={r.id}
            className={`aspect-square rounded-3xl bg-gradient-to-br ${gradients[i % gradients.length]} p-4 flex flex-col justify-between text-white shadow-lg active:scale-[0.98] transition text-left relative overflow-hidden`}
          >
            <div className="wax-stripes absolute inset-0 opacity-20" />
            <div className="relative">
              <div className="text-5xl">{r.emoji}</div>
            </div>
            <div className="relative">
              <p className="font-display font-extrabold text-sm leading-tight text-balance">{r.title[lang]}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold opacity-80">{r.duration}</span>
                <div className="size-8 rounded-full bg-white grid place-items-center">
                  <Play className="size-3.5 text-deep-blue ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="h-6" />
      <BottomNav />
    </PhoneFrame>
  );
}
