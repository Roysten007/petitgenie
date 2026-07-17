import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/kpodji/TopBar";
import { BottomNav } from "@/components/kpodji/BottomNav";
import { useKpodji } from "@/lib/kpodji-store";
import { Mascot } from "@/components/kpodji/Mascot";
import { PhoneFrame } from "@/components/kpodji/PhoneFrame";
import { useState, useEffect, useRef } from "react";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/")({
  component: Village,
});

/* ─── Level Nodes ─── */
interface LevelNode {
  id: string;
  type: "alphabet" | "exercise" | "comptines";
  districtId?: "marche" | "science";
  label: string;
  emoji: string;
  color: string; // gradient start color
  descFr: string;
  descEn: string;
}

const pathNodes: LevelNode[] = [
  { id: "alphabet", type: "alphabet", label: "Alphabet & Sons", emoji: "🔤", color: "#E06500", descFr: "Les lettres du marché du village", descEn: "Village market letters and sounds" },
  { id: "marche", type: "exercise", districtId: "marche", label: "Le Marché", emoji: "🥭", color: "#a34e36", descFr: "Calculs en FCFA et troc de fruits", descEn: "FCFA math and fruit trading" },
  { id: "science", type: "exercise", districtId: "science", label: "Sciences", emoji: "⚡", color: "#489e28", descFr: "L'eau, les plantes et les animaux", descEn: "Water, plants and wild animals" },
  { id: "english", type: "comptines", label: "English Corner", emoji: "🇬🇧", color: "#1cb0f6", descFr: "Chansons et dialogues de voyage", descEn: "Travel songs and small talks" },
];

/* ─── Zig-zag offsets (Duolingo snake) ─── */
const ZIG_ZAG = [0, 55, -55, 0]; // repeating pattern

function Village() {
  const { childName, avatar, seeds, streak, activeProfile, lang, completedChapters, xp, activeProfileId, updateProfileSettings } = useKpodji();
  
  const handleResetDemo = () => {
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
  };

  const faces = ["🙂", "😃", "😊", "🤗", "😎", "🤩", "🦁", "🐰", "🦊", "🐼"];
  const currentFace = faces[avatar.face] || "🙂";
 
  const [mascotPosition, setMascotPosition] = useState<{ x: number; y: number } | null>(null);
  const [mascotVariant, setMascotVariant] = useState<"idle" | "walk" | "jump" | "land">("idle");
  const [showCelebration, setShowCelebration] = useState(false);
  
  const pathContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const prevIdxRef = useRef<number | null>(null);

  const isNodeUnlocked = (index: number) => {
    // Tous les niveaux sont déverrouillés pour l'évaluation directe du jury
    return true;
  };

  const getProgress = (node: LevelNode) => {
    if (completedChapters.includes(node.id)) return 100;
    // Special check for active
    return 0;
  };

  // Find active node index
  const activeIdx = pathNodes.findIndex((n, i) => !completedChapters.includes(n.id));
  const currentIdx = activeIdx === -1 ? pathNodes.length - 1 : activeIdx;

  const currentNode = pathNodes[currentIdx];

  // Petit Génie's contextual guidance
  const griotSpeech = () => {
    if (completedChapters.length === 0) {
      return lang === "fr"
        ? "« Bienvenue, jeune Apprenti Griot ! Je suis Petit Génie. Tapotons ensemble sur la première étape pour découvrir les secrets des lettres et des sons du marché ! »"
        : "“Welcome, young Griot Apprentice! I am Petit Génie. Let's tap together on the first step to discover the secrets of market letters and sounds!”";
    }
    if (completedChapters.includes("alphabet") && !completedChapters.includes("marche")) {
      return lang === "fr"
        ? "« Merveilleux ! Tu as appris les premières lettres. Maintenant, viens au marché du village pour aider Fatou à faire ses comptes et faire du troc ! »"
        : "“Wonderful! You learned the first letters. Now, join the village market to help Fatou calculate prices and trade fruits!”";
    }
    if (completedChapters.includes("marche") && !completedChapters.includes("science")) {
      return lang === "fr"
        ? "« Tu te débrouilles comme un chef ! Dirigeons-nous vers les champs pour observer la nature sauvage et percer les mystères des plantes ! »"
        : "“You are doing great! Let's head towards the fields to observe wild nature and uncover the secrets of plants!”";
    }
    return lang === "fr"
      ? "« Formidable voyageur ! Récitons et chantons nos histoires en anglais à l'English Corner sous le grand baobab ! »"
      : "“Amazing traveler! Let's recite and sing our stories in English at the English Corner under the great baobab tree!”";
  };

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

  /* League rankings styled for Petit Génie */
  const league = [
    { name: "Fatou", face: "🦁", xp: 320 },
    { name: "Moussa", face: "🦊", xp: 210 },
    { name: childName, face: currentFace, xp: xp, isMe: true },
    { name: "Kofi", face: "🐼", xp: 140 },
    { name: "Awa", face: "🐰", xp: 95 },
  ].sort((a, b) => b.xp - a.xp);

  // Parent screen time lock visual override
  if (activeProfile.timeSpentThisWeek >= activeProfile.timeLimit) {
    return (
      <PhoneFrame dark>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 animate-fade-scale">
          <div className="size-24 rounded-full bg-deep-blue border-4 border-ocre/50 grid place-items-center relative animate-pulse shadow-2xl">
            <i className="fa-solid fa-moon text-ocre text-4xl" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">L'heure de se reposer !</h1>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-xs text-white/80 leading-relaxed max-w-xs shadow-inner">
            <p className="font-display font-extrabold text-ocre uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-bed" /> Petit Génie dort...
            </p>
            Tu as bien travaillé aujourd'hui ! Petit Génie s'est endormi sous le grand Baobab. Il est temps de reposer tes yeux et de revenir demain pour écouter de nouveaux contes.
          </div>
          

          <p className="text-[10px] text-white/40">Limite de temps atteinte ({activeProfile.timeLimit} min / {activeProfile.timeSpentThisWeek} min cumulées)</p>
          
          <div className="flex flex-col gap-2.5 w-full max-w-xs mt-3">
            <button
              onClick={handleResetDemo}
              className="w-full py-3 bg-ocre hover:bg-ocre/90 text-deep-blue rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rotate-left" />
              Recommencer la Démo
            </button>

            <Link
              to="/parents"
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider active:scale-95 transition flex items-center justify-center gap-2 border border-white/10"
            >
              <i className="fa-solid fa-lock-open" />
              Espace Adulte
            </Link>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  // Active path navigation
  let activeToLink = "/";
  let activeToParams: Record<string, string> = {};
  if (currentNode) {
    if (currentNode.type === "alphabet") {
      activeToLink = "/alphabet";
    } else if (currentNode.type === "comptines") {
      activeToLink = "/comptines";
    } else if (currentNode.type === "exercise" && currentNode.districtId) {
      activeToLink = "/exercise/$district";
      activeToParams = { district: currentNode.districtId };
    }
  }

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
            <i className="fa-solid fa-fire text-lg text-[#ff9600]" />
            <span className="font-display font-extrabold text-sm text-[#3c3c3c]">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-star text-lg text-ocre" />
            <span className="font-display font-extrabold text-sm text-[#3c3c3c]">{xp} XP</span>
          </div>
        </div>

        {/* Scrollable path area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto px-6 pt-6 pb-28">

            {/* Petit Génie speech bubble */}
            <div className="mb-6 flex items-end gap-3 bg-ocre/10 rounded-3xl p-4 border border-ocre/20 shadow-xs relative animate-pop-in">
              <div className="relative shrink-0">
                <Mascot size={76} variant="idle" animate="breathe" className="shrink-0" />
                <div className="absolute inset-[-4px] rounded-full border border-ocre/30 animate-pulse pointer-events-none" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-display font-extrabold text-terracotta uppercase tracking-wider">🎙️ Petit Génie raconte...</span>
                <p className="font-display font-bold text-deep-blue text-xs leading-relaxed mt-0.5">
                  {griotSpeech()}
                </p>
              </div>
            </div>

            {/* Unit banner */}
            <div className="bg-[#a34e36] rounded-2xl p-4 text-white mb-10 relative overflow-hidden shadow-md">
              <div className="absolute inset-0 kente-pattern opacity-15" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-white/70">🌳 Le Sentier de la Sagesse</span>
                  <h2 className="font-display text-lg font-extrabold leading-tight mt-0.5">Le parcours de Petit Génie</h2>
                </div>
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
                      to={activeToLink}
                      params={activeToParams}
                      className="absolute pointer-events-auto -top-8 left-14 bg-white border-2 border-[#e5e5e5] rounded-2xl px-3.5 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wider text-[#E06500] shadow-md hover:shadow-lg transition-all z-40 whitespace-nowrap animate-bounce flex items-center gap-1.5"
                    >
                      Commencer ! 🚀
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
                          <i className="fa-solid fa-check text-2xl text-[#afafaf]" />
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
                        <i className="fa-solid fa-lock text-xl text-[#afafaf]" />
                      </div>
                    )}

                    {/* Node label */}
                    <p className={`mt-2 font-display font-extrabold text-xs text-center ${unlocked ? "text-[#3c3c3c]" : "text-[#afafaf]"}`}>
                      {node.label}
                    </p>
                    <p className="text-[9px] text-muted-foreground text-center max-w-[18ch] -mt-0.5 leading-tight">
                      {lang === "fr" ? node.descFr : node.descEn}
                    </p>
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
              <i className="fa-solid fa-trophy text-[#ffc800] text-lg" /> Ligue des Conteurs
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
                <span className="font-mono text-sm font-bold text-[#afafaf] tabular-nums">{p.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot Encouragement Card */}
        <div className="bg-[#fff8e1] rounded-2xl p-4 border-2 border-[#ffe082] flex gap-3 items-center">
          <div className="shrink-0 animate-float">
            <Mascot size={55} variant="default" animate="float" />
          </div>
          <div>
            <p className="text-[10px] font-display font-extrabold text-[#E06500] uppercase tracking-wider">Le Baobab aux Paroles</p>
            <p className="text-xs font-bold text-[#3c3c3c] leading-snug">
              "Chaque pas sur le sentier libère un totem de sagesse. Continuons d'avancer ensemble ! 🪵🔥"
            </p>
          </div>
        </div>

        {/* Create Profile / Parent Portal CTA */}
        <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 space-y-3">
          <h3 className="font-display font-extrabold text-base text-[#3c3c3c]">
            Gestion des profils & Suivi
          </h3>
          <Link
            to="/avatar"
            className="block w-full py-3 rounded-2xl text-center font-display font-extrabold text-sm uppercase tracking-wider text-white transition-all active:scale-[0.98]"
            style={{ background: "#E06500", boxShadow: "0 4px 0 #a84b00" }}
          >
            Personnaliser mon Griot
          </Link>
          <Link
            to="/parents"
            className="block w-full py-3 rounded-2xl text-center font-display font-extrabold text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
            style={{ background: "#a34e36", boxShadow: "0 4px 0 #803b29", color: "white" }}
          >
            Espace Parents
          </Link>
        </div>

      </aside>
    </div>
  );
}
