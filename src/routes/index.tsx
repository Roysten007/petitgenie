import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { Check, Lock, Trophy, Zap, Flame, Heart } from "lucide-react";
import { Mascot } from "@/components/kpodji/Mascot";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Village,
});

/* ─── Level Nodes ─── */
interface LevelNode {
  id: string;
  type: "exercise" | "alphabet" | "comptines" | "chest";
  districtId?: "marche" | "ecole" | "riviere" | "place" | "science" | "morale";
  label: string;
  emoji: string;
  color: string; // gradient start color
}

const getPathNodes = (bracket: "4-6" | "7-8" | "9-10"): LevelNode[] => {
  if (bracket === "4-6") {
    return [
      { id: "n1", type: "alphabet",  label: "Lettres",      emoji: "🔤", color: "#E06500" },
      { id: "n2", type: "exercise",  districtId: "marche",  label: "Les Fruits",   emoji: "🥭", color: "#E06500" },
      { id: "n3", type: "exercise",  districtId: "morale",  label: "Dire Bonjour", emoji: "🤝", color: "#ce82ff" },
      { id: "n4", type: "chest",     label: "Cadeau",       emoji: "🎁", color: "#1cb0f6" },
      { id: "n5", type: "comptines", label: "Chansons",     emoji: "🎵", color: "#ff9600" },
      { id: "n6", type: "exercise",  districtId: "science", label: "Les Animaux",  emoji: "🦁", color: "#E06500" },
      { id: "n7", type: "exercise",  districtId: "riviere", label: "Les Formes",   emoji: "🔵", color: "#ce82ff" },
    ];
  } else if (bracket === "9-10") {
    return [
      { id: "n1", type: "alphabet",  label: "Vocabulaire",  emoji: "📝", color: "#E06500" },
      { id: "n2", type: "exercise",  districtId: "marche",  label: "Calcul Monnaie", emoji: "💰", color: "#E06500" },
      { id: "n3", type: "exercise",  districtId: "ecole",   label: "Verbes Anglais", emoji: "🏫", color: "#ce82ff" },
      { id: "n4", type: "chest",     label: "Super Coffre", emoji: "🎁", color: "#1cb0f6" },
      { id: "n5", type: "comptines", label: "Contes",       emoji: "📖", color: "#ff9600" },
      { id: "n6", type: "exercise",  districtId: "science", label: "Eau & Énergie", emoji: "💡", color: "#E06500" },
      { id: "n7", type: "exercise",  districtId: "morale",  label: "Citoyenneté",  emoji: "🤝", color: "#ce82ff" },
    ];
  } else {
    return [
      { id: "n1", type: "alphabet",  label: "Alphabet",    emoji: "🔤", color: "#E06500" },
      { id: "n2", type: "exercise",  districtId: "marche",  label: "Le Marché",   emoji: "🥭", color: "#E06500" },
      { id: "n3", type: "exercise",  districtId: "ecole",   label: "L'École",     emoji: "🏫", color: "#ce82ff" },
      { id: "n4", type: "chest",     label: "Coffre",       emoji: "🎁", color: "#1cb0f6" },
      { id: "n5", type: "comptines", label: "Comptines",    emoji: "🎵", color: "#ff9600" },
      { id: "n6", type: "exercise",  districtId: "science", label: "Sciences",    emoji: "⚡", color: "#E06500" },
      { id: "n7", type: "exercise",  districtId: "place",   label: "La Place",    emoji: "🌳", color: "#ce82ff" },
    ];
  }
};

/* ─── Zig-zag offsets (Duolingo snake) ─── */
const ZIG_ZAG = [0, 50, 70, 50, 0, -50, -70, -50]; // repeating pattern

function Village() {
  const { childName, districts, avatar, seeds, streak, stars, activeProfile } = useKpodji();
  const faces = ["🙂", "😃", "😊", "🤗", "😎", "🤩", "🦁", "🐰", "🦊", "🐼"];
  const currentFace = faces[avatar.face] || "🙂";
 
  const [mascotPosition, setMascotPosition] = useState<{ x: number; y: number } | null>(null);
  const [mascotVariant, setMascotVariant] = useState<"idle" | "walk" | "jump" | "land">("idle");
  const [showCelebration, setShowCelebration] = useState(false);
  
  const pathContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const prevIdxRef = useRef<number | null>(null);

  const bracket = activeProfile?.levelBracket || "7-8";
  const pathNodes = getPathNodes(bracket);

  const isNodeUnlocked = (index: number) => {
    if (index === 0) return true;
    const prev = pathNodes[index - 1];
    if (prev.type === "exercise" && prev.districtId) {
      const d = districts.find(x => x.id === prev.districtId);
      return d ? d.progress >= 100 : true;
    }
    return true;
  };

  const getProgress = (node: LevelNode) => {
    if (node.type === "exercise" && node.districtId) {
      const d = districts.find(x => x.id === node.districtId);
      return d ? d.progress : 0;
    }
    return 0;
  };

  const activeIdx = pathNodes.findIndex((n, i) => isNodeUnlocked(i) && getProgress(n) < 100);
  const currentIdx = activeIdx === -1 ? pathNodes.length - 1 : activeIdx;

  const currentNode = pathNodes[currentIdx];
  let activeTo = "/";
  let activeParams: Record<string, string> = {};
  if (currentNode) {
    if (currentNode.type === "alphabet") activeTo = "/alphabet";
    else if (currentNode.type === "comptines") activeTo = "/comptines";
    else if (currentNode.type === "chest") activeTo = "/badges";
    else if (currentNode.type === "exercise" && currentNode.districtId) {
      activeTo = "/exercise/$district";
      activeParams = { district: currentNode.districtId };
    }
  }

  const updateMascotPosition = (idx: number) => {
    const node = nodeRefs.current[idx];
    if (node) {
      const wrapper = node.parentElement;
      if (wrapper) {
        const xOff = ZIG_ZAG[idx % ZIG_ZAG.length];
        const top = wrapper.offsetTop + node.offsetTop + node.offsetHeight / 2;
        const left = wrapper.offsetLeft + node.offsetLeft + node.offsetWidth / 2 + xOff;
        return { x: left, y: top };
      }
    }
    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      const pos = updateMascotPosition(currentIdx);
      if (pos) {
        setMascotPosition(pos);
      }
    };
    const timer = setTimeout(handleResize, 150);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentIdx]);

  useEffect(() => {
    if (prevIdxRef.current !== null && prevIdxRef.current !== currentIdx) {
      const startIdx = prevIdxRef.current;
      const endIdx = currentIdx;
      const startPos = updateMascotPosition(startIdx);
      const endPos = updateMascotPosition(endIdx);

      if (startPos && endPos) {
        setMascotPosition(startPos);
        setMascotVariant("jump");
        
        const transitionTimer = setTimeout(() => {
          setMascotPosition(endPos);
        }, 50);

        const landTimer = setTimeout(() => {
          setMascotVariant("land");
          setShowCelebration(true);

          const idleTimer = setTimeout(() => {
            setMascotVariant("idle");
            setShowCelebration(false);
          }, 900);

          return () => clearTimeout(idleTimer);
        }, 750);

        return () => {
          clearTimeout(transitionTimer);
          clearTimeout(landTimer);
        };
      }
    } else {
      const pos = updateMascotPosition(currentIdx);
      if (pos) {
        setMascotPosition(pos);
        setMascotVariant("idle");
      }
    }
    prevIdxRef.current = currentIdx;
  }, [currentIdx]);

  /* League data */
  const league = [
    { name: "Fatou", face: "🦁", xp: 120 },
    { name: "Moussa", face: "🦊", xp: 95 },
    { name: childName, face: currentFace, xp: seeds, isMe: true },
    { name: "Kofi", face: "🐼", xp: 40 },
    { name: "Awa", face: "🐰", xp: 35 },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="flex-1 flex w-full min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════
          CENTER: Learning Path (scrollable)
         ═══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col border-r border-[#e5e5e5]">

        {/* Mobile-only TopBar */}
        <div className="md:hidden">
          <TopBar />
        </div>

        {/* Desktop stats bar */}
        <div className="hidden md:flex items-center justify-end gap-4 px-6 py-3 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-1.5">
            <Flame className="size-5 text-[#ff9600]" />
            <span className="font-display font-extrabold text-sm text-[#3c3c3c]">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="size-5 text-[#ffc800]" fill="#ffc800" />
            <span className="font-display font-extrabold text-sm text-[#3c3c3c]">{seeds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="size-5 text-[#ff4b4b]" fill="#ff4b4b" />
            <span className="font-display font-extrabold text-sm text-[#3c3c3c]">5</span>
          </div>
        </div>

        {/* Scrollable path area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto px-6 pt-6 pb-28">

            {/* Zao the Griot Opening Speech Bubble */}
            <div className="mb-6 flex items-end gap-3 bg-ocre/10 rounded-3xl p-4 border border-ocre/20 shadow-xs relative animate-pop-in">
              <Mascot size={76} variant="idle" animate="breathe" className="shrink-0" />
              <div className="flex-1">
                <span className="text-[9px] font-display font-extrabold text-terracotta uppercase tracking-wider">🎙️ Zao le Griot raconte...</span>
                <p className="font-display font-bold text-deep-blue text-xs leading-relaxed mt-0.5">
                  {lang === "fr" 
                    ? "« Salut, petit conteur ! Aujourd'hui, nous marchons sur le chemin sablonneux de Kpodji. Viens avec moi pour apprendre les lettres du marché ! »" 
                    : "“Hello, little storyteller! Today we walk the sandy paths of Kpodji. Come with me to learn the letters of the market!”"}
                </p>
              </div>
            </div>

            {/* Unit banner */}
            <div className="bg-[#E06500] rounded-2xl p-4 text-white mb-10 relative overflow-hidden">
              <div className="absolute inset-0 kente-pattern opacity-15" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-white/70">📖 Le Voyage de Zao · Chapitre 1</span>
                  <h2 className="font-display text-lg font-extrabold leading-tight mt-0.5">Zao et les lettres du marché</h2>
                </div>
                <Link
                  to="/defi"
                  className="bg-white/20 border border-white/30 rounded-xl px-3 py-1.5 text-xs font-display font-extrabold uppercase tracking-wider hover:bg-white/30 transition"
                >
                  📖 Guide
                </Link>
              </div>
            </div>

            {/* ── Snake path ── */}
            <div ref={pathContainerRef} className="flex flex-col items-center gap-10 relative">

              {/* Dynamic Mascot Indicator */}
              {mascotPosition && (
                <div
                  className="absolute pointer-events-none z-30 flex items-center justify-center transition-all duration-700 ease-in-out"
                  style={{
                    transform: `translate(${mascotPosition.x - 42.5}px, ${mascotPosition.y - 110}px)`,
                    left: 0,
                    top: 0,
                    width: 85,
                    height: 85,
                  }}
                >
                  {/* Glowing Halo around active step */}
                  <div className="absolute inset-1 rounded-full bg-[#ff9600]/25 animate-ping opacity-60 blur-xs border border-[#ff9600]" />
                  <div className="absolute inset-2 rounded-full bg-[#ff9600]/15 animate-pulse border border-[#ff9600]/30" />

                  <Mascot
                    size={85}
                    variant={mascotVariant}
                    animate={mascotVariant === "idle" ? "float" : "none"}
                    className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
                  />

                  {/* Commencer speech bubble next to mascot */}
                  {mascotVariant === "idle" && (
                    <Link
                      to={activeTo}
                      params={activeParams}
                      className="absolute pointer-events-auto -top-8 left-14 bg-white border-2 border-[#e5e5e5] rounded-2xl px-3.5 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wider text-[#E06500] shadow-md hover:shadow-lg transition-all z-40 whitespace-nowrap animate-bounce flex items-center gap-1.5"
                    >
                      C'est parti ! 🚀
                      <div className="absolute bottom-[-6px] left-3 size-2.5 bg-white border-r-2 border-b-2 border-[#e5e5e5] rotate-45" />
                    </Link>
                  )}

                  {showCelebration && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[2.5]">
                      {[
                        { top: "-15px", left: "-5px", delay: "0s", color: "#ffc800" },
                        { top: "15px", left: "-25px", delay: "0.2s", color: "#ff4b4b" },
                        { top: "35px", left: "35px", delay: "0.1s", color: "#1cb0f6" },
                        { top: "-25px", left: "25px", delay: "0.3s", color: "#ff9600" },
                      ].map((p, i) => (
                        <div
                          key={i}
                          className="absolute animate-ping size-1.5 rounded-full"
                          style={{
                            top: p.top,
                            left: p.left,
                            backgroundColor: p.color,
                            animationDuration: "1.2s",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {pathNodes.map((node, index) => {
                const unlocked = isNodeUnlocked(index);
                const progress = getProgress(node);
                const completed = progress >= 100;
                const isCurrent = index === currentIdx;
                const xOff = ZIG_ZAG[index % ZIG_ZAG.length];

                let to: string = "/";
                let params: Record<string, string> = {};
                if (node.type === "alphabet") to = "/alphabet";
                else if (node.type === "comptines") to = "/comptines";
                else if (node.type === "chest") to = "/badges";
                else if (node.type === "exercise" && node.districtId) {
                  to = "/exercise/$district";
                  params = { district: node.districtId };
                }

                return (
                  <div key={node.id} className="relative flex flex-col items-center" style={{ transform: `translateX(${xOff}px)` }}>

                    {/* Node circle */}
                    {unlocked ? (
                      <Link
                        ref={(el) => { nodeRefs.current[index] = el; }}
                        to={to}
                        params={params}
                        className={`size-[72px] rounded-full flex items-center justify-center relative active:scale-90 transition-transform ${
                          isCurrent ? "ring-[6px] ring-offset-4" : ""
                        }`}
                        style={{
                          background: completed ? "#e5e5e5" : node.color,
                          boxShadow: completed ? "none" : `0 8px 0 ${node.color}bb, 0 12px 24px ${node.color}40`,
                          ringColor: isCurrent ? `${node.color}40` : undefined,
                          ["--tw-ring-color" as string]: isCurrent ? `${node.color}40` : undefined,
                        }}
                      >
                        {/* Progress arc */}
                        {progress > 0 && progress < 100 && (
                          <svg className="absolute inset-[-6px] size-[84px] rotate-[-90deg] pointer-events-none">
                            <circle cx="42" cy="42" r="39" fill="transparent" stroke="white" strokeWidth="3" opacity="0.3"
                              strokeDasharray={`${2 * Math.PI * 39}`} />
                            <circle cx="42" cy="42" r="39" fill="transparent" stroke="white" strokeWidth="3"
                              strokeDasharray={`${2 * Math.PI * 39}`}
                              strokeDashoffset={`${2 * Math.PI * 39 * (1 - progress / 100)}`}
                              strokeLinecap="round" />
                          </svg>
                        )}

                        {/* Icon inside */}
                        {completed ? (
                          <Check className="size-8 text-[#afafaf]" strokeWidth={3} />
                        ) : (
                          <span className="text-3xl drop-shadow">{node.emoji}</span>
                        )}

                        {/* Gold completion crown */}
                        {completed && (
                          <div className="absolute -top-2 -right-2 size-6 rounded-full bg-[#ffc800] border-2 border-white flex items-center justify-center shadow">
                            <span className="text-xs">⭐</span>
                          </div>
                        )}
                      </Link>
                    ) : (
                      <div
                        ref={(el) => { nodeRefs.current[index] = el; }}
                        className="size-[72px] rounded-full bg-[#e5e5e5] flex items-center justify-center" style={{ boxShadow: "0 8px 0 #d5d5d5" }}
                      >
                        <Lock className="size-7 text-[#afafaf]" />
                      </div>
                    )}

                    {/* Node label */}
                    <p className={`mt-2 font-display font-extrabold text-xs text-center ${unlocked ? "text-[#3c3c3c]" : "text-[#afafaf]"}`}>
                      {node.label}
                    </p>

                    {/* Mascot next to the chest node removed */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile-only BottomNav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT SIDEBAR: Widgets (Desktop Only)
         ═══════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-[330px] flex-col p-5 pt-8 space-y-5 overflow-y-auto shrink-0 select-none">

        {/* League Widget */}
        <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-extrabold text-base text-[#3c3c3c] flex items-center gap-2">
              <Trophy className="size-5 text-[#ffc800]" /> Ligue des Conteurs
            </h3>
          </div>
          <div className="space-y-1.5">
            {league.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  (p as any).isMe
                    ? "bg-[#ddf4ff] border border-[#84d8ff] font-extrabold"
                    : i === 0 ? "bg-[#fff8e1]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#afafaf] w-5 text-center text-xs">{i + 1}</span>
                  <span className="text-xl">{p.face}</span>
                  <span className="font-display font-bold text-[#3c3c3c] truncate max-w-[10ch]">
                    {p.name} {(p as any).isMe && <span className="text-[#1cb0f6] text-[10px]">(toi)</span>}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-[#afafaf] tabular-nums">{p.xp} Graines</span>
              </div>
            ))}
          </div>
          <Link to="/badges" className="block mt-3 text-center text-xs font-display font-extrabold text-[#1cb0f6] uppercase tracking-wider hover:underline">
            Voir le classement des conteurs →
          </Link>
        </div>

        {/* Daily Quest Widget */}
        <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-extrabold text-base text-[#3c3c3c] flex items-center gap-2">
              Missions du Griot
            </h3>
            <span className="text-xs font-display font-extrabold text-[#1cb0f6] uppercase tracking-wider cursor-pointer hover:underline">
              Afficher tout
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="size-10 text-[#ffc800] shrink-0" fill="#ffc800" />
            <div className="flex-1">
              <p className="font-display font-extrabold text-sm text-[#3c3c3c]">Gagne 10 Graines</p>
              <div className="mt-1.5 h-3 bg-[#e5e5e5] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#ffc800] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((seeds / 10) * 100, 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#3c3c3c]/70">
                  {Math.min(seeds, 10)} / 10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mascot Encouragement Card */}
        <div className="bg-[#fff8e1] rounded-2xl p-4 border-2 border-[#ffe082] flex gap-3 items-center">
          <div className="shrink-0 animate-float">
            <Mascot size={55} variant="default" animate="float" />
          </div>
          <div>
            <p className="text-[10px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">Feu de camp allumé</p>
            <p className="text-xs font-bold text-[#3c3c3c] leading-snug">
              "Garde le feu de camp allumé en venant écouter mes histoires chaque jour !" 🪵🔥
            </p>
          </div>
        </div>

        {/* Create Profile CTA */}
        <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 space-y-3">
          <h3 className="font-display font-extrabold text-base text-[#3c3c3c]">
            Crée un profil pour sauvegarder ta progression !
          </h3>
          <Link
            to="/avatar"
            className="block w-full py-3 rounded-2xl text-center font-display font-extrabold text-sm uppercase tracking-wider text-white transition-all active:scale-[0.98]"
            style={{ background: "#E06500", boxShadow: "0 4px 0 #a84b00" }}
          >
            Créer un profil
          </Link>
          <Link
            to="/parents"
            className="block w-full py-3 rounded-2xl text-center font-display font-extrabold text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
            style={{ background: "#1cb0f6", boxShadow: "0 4px 0 #1899d6", color: "white" }}
          >
            Espace Parents
          </Link>
        </div>

      </aside>
    </div>
  );
}
