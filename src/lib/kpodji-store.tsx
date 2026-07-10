import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DistrictId = "marche" | "ecole" | "riviere" | "place";
export type Lang = "fr" | "en";

export interface District {
  id: DistrictId;
  name: string;
  subject: string;
  color: "terracotta" | "ocre" | "river" | "leaf";
  progress: number; // 0-100
  emoji: string;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  unlocked: boolean;
}

export interface Story {
  id: string;
  title: { fr: string; en: string };
  duration: string;
  emoji: string;
  color: string;
}

export interface KpodjiState {
  childName: string;
  avatar: { face: number; outfit: number; accessory: number };
  seeds: number;
  stars: number;
  streak: number;
  lang: Lang;
  districts: District[];
  badges: Badge[];
  stories: Story[];
  rhymes: Story[];
  addSeeds: (n: number) => void;
  setLang: (l: Lang) => void;
  setChildName: (n: string) => void;
  setAvatar: (a: { face: number; outfit: number; accessory: number }) => void;
  advanceDistrict: (id: DistrictId, delta: number) => void;
}

const KpodjiCtx = createContext<KpodjiState | null>(null);

const initialDistricts: District[] = [
  { id: "marche", name: "Le Marché", subject: "Maths & FCFA", color: "ocre", progress: 65, emoji: "🥭" },
  { id: "ecole", name: "L'École", subject: "English", color: "river", progress: 40, emoji: "🔤" },
  { id: "riviere", name: "La Rivière", subject: "Fractions", color: "leaf", progress: 25, emoji: "🐟" },
  { id: "place", name: "La Place", subject: "Défi bilingue", color: "terracotta", progress: 80, emoji: "🌳" },
];

const initialBadges: Badge[] = [
  { id: "b1", name: "Petit Compteur", desc: "10 additions réussies", emoji: "🔢", unlocked: true },
  { id: "b2", name: "Petit Griot", desc: "3 histoires écoutées", emoji: "📖", unlocked: true },
  { id: "b3", name: "Hello Friend", desc: "20 mots anglais appris", emoji: "👋", unlocked: true },
  { id: "b4", name: "Marchand Malin", desc: "Faire la monnaie 5 fois", emoji: "💰", unlocked: false },
  { id: "b5", name: "Poisson d'eau", desc: "Terminer la Rivière", emoji: "🐠", unlocked: false },
  { id: "b6", name: "Chanteur", desc: "10 comptines écoutées", emoji: "🎵", unlocked: false },
  { id: "b7", name: "Baobab", desc: "30 jours de série", emoji: "🌳", unlocked: false },
  { id: "b8", name: "Champion", desc: "Tous les quartiers finis", emoji: "🏆", unlocked: false },
];

const stories: Story[] = [
  { id: "s1", title: { fr: "Le lièvre et le baobab", en: "The Hare and the Baobab" }, duration: "4 min", emoji: "🐇", color: "ocre" },
  { id: "s2", title: { fr: "Pourquoi le léopard a des taches", en: "Why the Leopard has Spots" }, duration: "6 min", emoji: "🐆", color: "terracotta" },
  { id: "s3", title: { fr: "L'oiseau qui parlait anglais", en: "The Bird who spoke English" }, duration: "5 min", emoji: "🦜", color: "river" },
  { id: "s4", title: { fr: "La rivière magique", en: "The Magic River" }, duration: "7 min", emoji: "🌊", color: "leaf" },
];

const rhymes: Story[] = [
  { id: "r1", title: { fr: "Un, deux, trois mangues", en: "One, two, three mangoes" }, duration: "1 min", emoji: "🥭", color: "ocre" },
  { id: "r2", title: { fr: "Couleurs du marché", en: "Market Colors" }, duration: "2 min", emoji: "🎨", color: "terracotta" },
  { id: "r3", title: { fr: "ABC du village", en: "Village ABC" }, duration: "2 min", emoji: "🔤", color: "river" },
  { id: "r4", title: { fr: "Bonjour le soleil", en: "Hello Sunshine" }, duration: "1 min", emoji: "☀️", color: "leaf" },
];

export function KpodjiProvider({ children }: { children: ReactNode }) {
  const [childName, setChildName] = useState("Amadou");
  const [avatar, setAvatar] = useState({ face: 0, outfit: 0, accessory: 0 });
  const [seeds, setSeeds] = useState(124);
  const [stars] = useState(12);
  const [streak] = useState(4);
  const [lang, setLang] = useState<Lang>("fr");
  const [districts, setDistricts] = useState<District[]>(initialDistricts);

  const value = useMemo<KpodjiState>(
    () => ({
      childName,
      avatar,
      seeds,
      stars,
      streak,
      lang,
      districts,
      badges: initialBadges,
      stories,
      rhymes,
      addSeeds: (n) => setSeeds((s) => s + n),
      setLang,
      setChildName,
      setAvatar,
      advanceDistrict: (id, delta) =>
        setDistricts((prev) =>
          prev.map((d) => (d.id === id ? { ...d, progress: Math.min(100, d.progress + delta) } : d)),
        ),
    }),
    [childName, avatar, seeds, stars, streak, lang, districts],
  );

  return <KpodjiCtx.Provider value={value}>{children}</KpodjiCtx.Provider>;
}

export function useKpodji() {
  const ctx = useContext(KpodjiCtx);
  if (!ctx) throw new Error("useKpodji must be used within KpodjiProvider");
  return ctx;
}

export const colorClass = (c: District["color"]) => {
  switch (c) {
    case "terracotta":
      return { bg: "bg-terracotta", text: "text-terracotta", border: "border-terracotta", soft: "bg-terracotta/10" };
    case "ocre":
      return { bg: "bg-ocre", text: "text-ocre", border: "border-ocre", soft: "bg-ocre/15" };
    case "river":
      return { bg: "bg-river", text: "text-river", border: "border-river", soft: "bg-river/15" };
    case "leaf":
      return { bg: "bg-leaf", text: "text-leaf", border: "border-leaf", soft: "bg-leaf/15" };
  }
};
