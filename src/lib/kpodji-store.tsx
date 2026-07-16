import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DistrictId = "marche" | "ecole" | "riviere" | "place" | "science" | "morale";
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
  storyTextFr?: string;
  storyTextEn?: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: { face: number; outfit: number; accessory: number };
  seeds: number;
  stars: number;
  streak: number;
  levelBracket: "4-6" | "7-8" | "9-10";
  districts: District[];
  timeLimit: number; // in minutes
  timeSpentThisWeek: number; // in minutes
  soundEnabled?: boolean;
  notifEnabled?: boolean;
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
  
  // New properties for multi-profiles
  profiles: ChildProfile[];
  activeProfileId: string;
  activeProfile: ChildProfile;
  setActiveProfileId: (id: string) => void;
  updateProfileSettings: (id: string, settings: Partial<ChildProfile>) => void;
  
  addSeeds: (n: number) => void;
  setLang: (l: Lang) => void;
  setChildName: (n: string) => void;
  setAvatar: (a: { face: number; outfit: number; accessory: number }) => void;
  advanceDistrict: (id: DistrictId, delta: number) => void;
}

const KpodjiCtx = createContext<KpodjiState | null>(null);

const initialBadges: Badge[] = [
  { id: "b1", name: "Totem de la Tortue", desc: "Sagesse & Calcul · 10 additions réussies", emoji: "🐢", unlocked: true },
  { id: "b2", name: "Totem du Lièvre", desc: "Parole & Récit · 3 contes écoutés", emoji: "🐇", unlocked: true },
  { id: "b3", name: "Totem du Singe bilingue", desc: "Langage & Échanges · 20 mots d'anglais appris", emoji: "🐒", unlocked: true },
  { id: "b4", name: "Totem du Calao", desc: "Commerce & Monnaie · Faire la monnaie 5 fois", emoji: "🐦", unlocked: false },
  { id: "b5", name: "Totem du Poisson d'eau", desc: "Découverte · Terminer le chapitre de la Rivière", emoji: "🐠", unlocked: false },
  { id: "b6", name: "Totem du Tisserin", desc: "Chants & Rythmes · 10 comptines écoutées", emoji: "🎵", unlocked: false },
  { id: "b7", name: "Totem du Baobab majestueux", desc: "Ancrage & Patience · 30 jours de feu de camp allumé", emoji: "🌳", unlocked: false },
  { id: "b8", name: "Totem du Lion", desc: "Grand Griot · Terminer tous les chapitres de Kpodji", emoji: "🦁", unlocked: false },
];

const stories: Story[] = [
  {
    id: "s1",
    title: { fr: "Le lièvre et le baobab", en: "The Hare and the Baobab" },
    duration: "4 min",
    emoji: "🐇",
    color: "ocre",
    storyTextFr: "Un petit lièvre très rapide aimait courir dans la savane. Un jour, il se moqua du grand baobab qui ne pouvait pas bouger. Le baobab, plein de sagesse, lui dit : 'Je ne cours pas, mais mes racines s'étendent loin pour donner de la force et de l'ombre à tous les animaux.' Le lièvre comprit alors que chacun a sa propre force.",
    storyTextEn: "A little, fast hare loved to run across the savannah. One day, he laughed at the big baobab tree because it could not move. The wise baobab said: 'I do not run, but my roots go deep to give strength and shade to all the animals.' The hare realized that everyone has their own special strength."
  },
  {
    id: "s2",
    title: { fr: "Pourquoi le léopard a des taches", en: "Why the Leopard has Spots" },
    duration: "6 min",
    emoji: "🐆",
    color: "terracotta",
    storyTextFr: "Il y a longtemps, le léopard avait un pelage tout jaune. Il se cachait dans les hautes herbes pour faire peur à ses amis. Pour l'aider à mieux se cacher, la girafe peignit de jolies taches noires sur son corps avec son pinceau magique. Depuis ce jour, le léopard est le roi du cache-cache dans la forêt.",
    storyTextEn: "Long ago, the leopard had plain yellow fur. He used to hide in the tall grass to surprise his friends. To help him hide even better, the giraffe painted beautiful black spots all over his body with her magic brush. Since that day, the leopard has been the king of hide-and-seek in the forest."
  },
  {
    id: "s3",
    title: { fr: "L'oiseau qui parlait anglais", en: "The Bird who spoke English" },
    duration: "5 min",
    emoji: "🦜",
    color: "river",
    storyTextFr: "Zao rencontra un joli perroquet vert sur une branche. L'oiseau chantait : 'Hello, good morning!'. Étonné, Zao lui répondit : 'Bonjour!'. L'oiseau lui apprit à dire 'friend' pour ami et 'thank you' pour merci. Depuis, tous les enfants du village chantent en anglais avec le perroquet magique.",
    storyTextEn: "Zao met a beautiful green parrot sitting on a branch. The bird sang: 'Hello, good morning!'. Surprised, Zao replied: 'Bonjour!'. The bird taught him to say 'friend' and 'thank you'. Since then, all the children in the village sing in English with the magic parrot."
  },
  {
    id: "s4",
    title: { fr: "La rivière magique", en: "The Magic River" },
    duration: "7 min",
    emoji: "🌊",
    color: "leaf",
    storyTextFr: "La rivière du village de Kpodji brille sous le soleil. Les poissons y dansent en formant des ronds dorés. Quand les enfants chantent au bord de l'eau, la rivière se met à murmurer de douces mélodies. Elle apporte de l'eau fraîche pour faire pousser les mangues et soigner les fleurs.",
    storyTextEn: "The river of Kpodji village shines under the sun. The fish dance in the water, making golden circles. When the children sing by the river, the water whispers sweet melodies. It brings fresh water to grow juicy mangoes and feed the flowers."
  }
];

const rhymes: Story[] = [
  { id: "r1", title: { fr: "Un, deux, trois mangues", en: "One, two, three mangoes" }, duration: "1 min", emoji: "🥭", color: "ocre" },
  { id: "r2", title: { fr: "Couleurs du marché", en: "Market Colors" }, duration: "2 min", emoji: "🎨", color: "terracotta" },
  { id: "r3", title: { fr: "ABC du village", en: "Village ABC" }, duration: "2 min", emoji: "🔤", color: "river" },
  { id: "r4", title: { fr: "Bonjour le soleil", en: "Hello Sunshine" }, duration: "1 min", emoji: "☀️", color: "leaf" },
];

const initialProfiles: ChildProfile[] = [
  {
    id: "p1",
    name: "Amadou",
    age: 7,
    avatar: { face: 4, outfit: 1, accessory: 0 },
    seeds: 180,
    stars: 12,
    streak: 4,
    levelBracket: "7-8",
    timeLimit: 30,
    timeSpentThisWeek: 45,
    soundEnabled: true,
    notifEnabled: true,
    districts: [
      { id: "marche", name: "Le Marché", subject: "Maths & FCFA", color: "ocre", progress: 78, emoji: "🥭" },
      { id: "ecole", name: "L'École", subject: "English", color: "river", progress: 42, emoji: "🔤" },
      { id: "science", name: "Sciences", subject: "Le corps humain", color: "leaf", progress: 30, emoji: "⚡" },
      { id: "morale", name: "Valeurs", subject: "Respect & Politesse", color: "terracotta", progress: 50, emoji: "🤝" },
      { id: "riviere", name: "La Rivière", subject: "Fractions", color: "leaf", progress: 0, emoji: "🐟" },
      { id: "place", name: "La Place", subject: "Défi bilingue", color: "terracotta", progress: 0, emoji: "🌳" },
    ]
  },
  {
    id: "p2",
    name: "Fatou",
    age: 5,
    avatar: { face: 2, outfit: 2, accessory: 1 },
    seeds: 95,
    stars: 5,
    streak: 2,
    levelBracket: "4-6",
    timeLimit: 15,
    timeSpentThisWeek: 20,
    soundEnabled: true,
    notifEnabled: false,
    districts: [
      { id: "marche", name: "Le Marché", subject: "Compter les fruits", color: "ocre", progress: 42, emoji: "🥭" },
      { id: "ecole", name: "L'École", subject: "Mots simples", color: "river", progress: 25, emoji: "🔤" },
      { id: "science", name: "Sciences", subject: "Animaux & Plantes", color: "leaf", progress: 15, emoji: "⚡" },
      { id: "morale", name: "Valeurs", subject: "Politesse & Émotions", color: "terracotta", progress: 40, emoji: "🤝" },
      { id: "riviere", name: "La Rivière", subject: "Formes & Tailles", color: "leaf", progress: 0, emoji: "🐟" },
      { id: "place", name: "La Place", subject: "Jeux bilingues", color: "terracotta", progress: 0, emoji: "🌳" },
    ]
  },
  {
    id: "p3",
    name: "Kofi",
    age: 9,
    avatar: { face: 6, outfit: 0, accessory: 2 },
    seeds: 340,
    stars: 28,
    streak: 12,
    levelBracket: "9-10",
    timeLimit: 45,
    timeSpentThisWeek: 90,
    soundEnabled: false,
    notifEnabled: true,
    districts: [
      { id: "marche", name: "Le Marché", subject: "Rendre la monnaie", color: "ocre", progress: 91, emoji: "🥭" },
      { id: "ecole", name: "L'École", subject: "Grammaire & Verbes", color: "river", progress: 75, emoji: "🔤" },
      { id: "science", name: "Sciences", subject: "Cycle de l'eau", color: "leaf", progress: 70, emoji: "⚡" },
      { id: "morale", name: "Valeurs", subject: "Civisme & Entraide", color: "terracotta", progress: 60, emoji: "🤝" },
      { id: "riviere", name: "La Rivière", subject: "Problèmes de partage", color: "leaf", progress: 0, emoji: "🐟" },
      { id: "place", name: "La Place", subject: "Grand Défi bilingue", color: "terracotta", progress: 0, emoji: "🌳" },
    ]
  }
];

export function KpodjiProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>("p1");
  const [lang, setLang] = useState<Lang>("fr");

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  const value = useMemo<KpodjiState>(
    () => ({
      childName: activeProfile.name,
      avatar: activeProfile.avatar,
      seeds: activeProfile.seeds,
      stars: activeProfile.stars,
      streak: activeProfile.streak,
      lang,
      districts: activeProfile.districts,
      badges: initialBadges,
      stories,
      rhymes,
      profiles,
      activeProfileId,
      activeProfile,
      setActiveProfileId,
      updateProfileSettings: (id, settings) => {
        setProfiles((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...settings } : p))
        );
      },
      addSeeds: (n) => {
        setProfiles((prev) =>
          prev.map((p) => (p.id === activeProfileId ? { ...p, seeds: p.seeds + n } : p))
        );
      },
      setLang,
      setChildName: (name) => {
        setProfiles((prev) =>
          prev.map((p) => (p.id === activeProfileId ? { ...p, name } : p))
        );
      },
      setAvatar: (avatar) => {
        setProfiles((prev) =>
          prev.map((p) => (p.id === activeProfileId ? { ...p, avatar } : p))
        );
      },
      advanceDistrict: (districtId, delta) => {
        setProfiles((prev) =>
          prev.map((p) => {
            if (p.id === activeProfileId) {
              const updatedDistricts = p.districts.map((d) =>
                d.id === districtId ? { ...d, progress: Math.min(100, d.progress + delta) } : d
              );
              return { ...p, districts: updatedDistricts };
            }
            return p;
          })
        );
      },
    }),
    [profiles, activeProfileId, activeProfile, lang]
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
