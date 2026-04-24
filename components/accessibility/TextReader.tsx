"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Square, ChevronDown } from "lucide-react";

type State = "idle" | "playing" | "paused";

export default function TextReader() {
  const [state, setState] = useState<State>("idle");
  const [supported, setSupported] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  const fullTextRef = useRef<string>("");
  const pausedAtRef = useRef<number>(0);
  const totalCharsRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function extractPageText(): string {
    const root =
      document.querySelector("main") ||
      document.querySelector("section") ||
      document.querySelector("article") ||
      document.body;
    const clone = root.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll(
        "nav, footer, script, style, button, input, textarea, select, [aria-hidden='true'], .no-read"
      )
      .forEach((el) => el.remove());
    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function clearProgress() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function speakFrom(text: string, fromChar: number, rate: number) {
    window.speechSynthesis.cancel();
    clearProgress();

    const slice = text.substring(fromChar);
    if (!slice.trim()) {
      setState("idle");
      setProgress(0);
      pausedAtRef.current = 0;
      return;
    }

    const utter = new SpeechSynthesisUtterance(slice);
    utter.lang = "fr-FR";
    utter.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utter.voice = frVoice;

    utter.onboundary = (e) => {
      const absChar = fromChar + e.charIndex;
      pausedAtRef.current = absChar;
      setProgress(Math.min((absChar / totalCharsRef.current) * 100, 99));
    };

    utter.onend = () => {
      clearProgress();
      setState("idle");
      setProgress(0);
      pausedAtRef.current = 0;
    };

    utter.onerror = (e) => {
      if (e.error === "interrupted") return;
      clearProgress();
      setState("idle");
      setProgress(0);
    };

    window.speechSynthesis.speak(utter);
    setState("playing");
  }

  function handlePlay() {
    if (state === "playing") {
      // cancel() est plus fiable que pause() dans Chrome
      window.speechSynthesis.cancel();
      clearProgress();
      setState("paused");
      return;
    }
    if (state === "paused") {
      speakFrom(fullTextRef.current, pausedAtRef.current, speed);
      return;
    }
    const text = extractPageText();
    if (!text) return;
    fullTextRef.current = text;
    totalCharsRef.current = text.length;
    pausedAtRef.current = 0;
    speakFrom(text, 0, speed);
    setExpanded(true);
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    clearProgress();
    setState("idle");
    setProgress(0);
    pausedAtRef.current = 0;
  }

  function handleSpeedChange(newSpeed: number) {
    setSpeed(newSpeed);
    if (state === "playing") speakFrom(fullTextRef.current, pausedAtRef.current, newSpeed);
  }

  if (!supported) return null;

  const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 no-read">
      {expanded && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-64 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#E05017]" />
              <span className="text-sm font-semibold text-gray-800">Lecture du texte</span>
            </div>
            <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-600" aria-label="Réduire">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Barre de progression */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#E05017] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          {/* Statut */}
          <p className="text-xs text-gray-500 text-center">
            {state === "playing" && "Lecture en cours..."}
            {state === "paused" && "En pause — cliquer sur ▶ pour reprendre"}
            {state === "idle" && "Cliquer sur ▶ pour lire la page"}
          </p>

          {/* Boutons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePlay}
              className="w-10 h-10 bg-[#E05017] hover:bg-[#c44315] text-white rounded-full flex items-center justify-center transition-colors shadow"
              aria-label={state === "playing" ? "Pause" : "Lecture"}
            >
              {state === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleStop}
              disabled={state === "idle"}
              className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
              aria-label="Arrêter"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vitesse */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5 text-center">Vitesse</p>
            <div className="flex items-center justify-center gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    speed === s ? "bg-[#E05017] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === 1 ? "×1" : `×${s}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className={`group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          state === "playing" ? "bg-[#E05017] animate-pulse" : state === "paused" ? "bg-amber-500" : "bg-[#052838] hover:bg-[#E05017]"
        }`}
        aria-label="Lecteur de texte"
        title="Lire la page"
      >
        {state === "idle" ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
        {!expanded && state === "idle" && (
          <span className="absolute right-16 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Lire la page
          </span>
        )}
      </button>
    </div>
  );
}
