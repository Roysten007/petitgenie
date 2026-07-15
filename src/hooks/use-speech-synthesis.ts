import { useEffect, useRef, useState, useCallback } from "react";

export interface SpeechPart {
  text: string;
  lang: "fr" | "en";
}

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [totalSentences, setTotalSentences] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<"fr" | "en">("fr");

  // Keep references to prevent garbage collection and race conditions
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<SpeechPart[]>([]);
  const queueIndexRef = useRef(0);
  const sentencesRef = useRef<string[]>([]);
  const sentenceIndexRef = useRef(0);
  const langRef = useRef<"fr" | "en">("fr");

  // Refs for internal functions to resolve circular references
  const speakSentenceRef = useRef<() => void>(() => {});
  const speakNextQueueItemRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getBestVoice = useCallback((lang: "fr" | "en") => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    const targetLang = lang === "fr" ? "fr" : "en";
    const langVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(targetLang)
    );

    if (langVoices.length === 0) return null;

    // Preference list for premium/natural sounding voices
    const searchTerms =
      lang === "fr"
        ? ["natural", "google français", "hortense", "julie", "paul", "microsoft"]
        : ["natural", "google us english", "samantha", "zira", "david", "microsoft"];

    for (const term of searchTerms) {
      const match = langVoices.find((v) =>
        v.name.toLowerCase().includes(term)
      );
      if (match) return match;
    }

    return langVoices[0]; // fallback
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
    setTotalSentences(0);
    setSentences([]);
    queueRef.current = [];
    queueIndexRef.current = 0;
    sentencesRef.current = [];
    sentenceIndexRef.current = 0;
  }, []);

  const speakSentence = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    if (sentenceIndexRef.current >= sentencesRef.current.length) {
      // Move to next part in queue
      queueIndexRef.current += 1;
      speakNextQueueItemRef.current();
      return;
    }

    const text = sentencesRef.current[sentenceIndexRef.current];
    setCurrentSentenceIndex(sentenceIndexRef.current);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Voice and Language Setup
    const languageCode = langRef.current === "fr" ? "fr-FR" : "en-US";
    utterance.lang = languageCode;
    
    const voice = getBestVoice(langRef.current);
    if (voice) {
      utterance.voice = voice;
    }

    // Kids-friendly speech settings: slow pace, high-warm pitch
    utterance.rate = langRef.current === "fr" ? 0.75 : 0.72; // slow and clear
    utterance.pitch = 1.15; // friendly, warm

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      // Speak next sentence in this queue item
      sentenceIndexRef.current += 1;
      speakSentenceRef.current();
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      // Skip or finish
      sentenceIndexRef.current += 1;
      speakSentenceRef.current();
    };

    synth.speak(utterance);
  }, [getBestVoice]);

  const speakNextQueueItem = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    if (queueIndexRef.current >= queueRef.current.length) {
      stop();
      return;
    }

    const currentPart = queueRef.current[queueIndexRef.current];
    setActiveLanguage(currentPart.lang);
    
    // Split the text of this part into sentences
    const matches = currentPart.text.match(/[^.!?]+[.!?]+(\s|$)/g);
    const partSentences = matches ? matches.map((s) => s.trim()) : [currentPart.text];
    
    sentencesRef.current = partSentences;
    setSentences(partSentences);
    setTotalSentences(partSentences.length);
    sentenceIndexRef.current = 0;
    setCurrentSentenceIndex(0);
    langRef.current = currentPart.lang;

    speakSentenceRef.current();
  }, [stop]);

  // Bind ref variables to actual functions on each render
  speakSentenceRef.current = speakSentence;
  speakNextQueueItemRef.current = speakNextQueueItem;

  const speakQueue = useCallback((parts: SpeechPart[]) => {
    stop();
    if (parts.length === 0) return;
    queueRef.current = parts;
    queueIndexRef.current = 0;
    setIsPlaying(true);
    
    speakNextQueueItemRef.current();
  }, [stop]);

  const speakText = useCallback((text: string, lang: "fr" | "en") => {
    speakQueue([{ text, lang }]);
  }, [speakQueue]);

  const pause = useCallback(() => {
    if (synthRef.current && isPlaying && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  return {
    isPlaying,
    isPaused,
    currentSentenceIndex,
    totalSentences,
    sentences,
    activeLanguage,
    speakText,
    speakQueue,
    pause,
    resume,
    stop,
  };
}
