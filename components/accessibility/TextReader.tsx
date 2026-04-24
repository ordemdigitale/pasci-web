"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Square, ChevronUp, ChevronDown } from "lucide-react";

type State = "idle" | "playing" | "paused";

export default function TextReader() {
  const [state, setState] = useState<State>("idle");
  const [supported, setSupported] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0); // 0-100
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /** Extract visible page text, excluding nav / footer / admin zones */
  function extractPageText(): string {
    const mainEl =
      document.querySelector("main") ||
      document.querySelector("section") ||
      document.querySelector("article");

    const root = mainEl || document.body;

    // Clone to avoid modifying DOM
    const clone = root.cloneNode(true) as HTMLElement;

    // Remove elements we don't want read
    clone.querySelectorAll("nav, footer, script, style, button, input, textarea, select, [aria-hidden='true'], .no-read").forEach((el) => el.remove());

    return (clone.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("idle");
    setProgress(0);
  }, []);

  const speak = useCallback((text: string, rate: number) => {
    window.speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.rate = rate;

    // Prefer a French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utter.voice = frVoice;

    // Track progress by elapsed time vs estimated total duration
    const estimatedDuration = (text.length / 15) * (1 / rate) * 1000; // rough ms
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / estimatedDuration) * 100, 99);
      setProgress(pct);
    }, 300);

    utter.onend = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState("idle");
      setProgress(0);
    };

    utter.onerror = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState("idle");
      setProgress(0);
    };

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
    setState("playing");
  }, []);

  function handlePlay() {
    if (state === "playing") {
      window.speechSynthesis.pause();
      setState("paused");
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    if (state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
      // Restart progress tracking
      const remaining = textRef.current.length;
      const estimatedDuration = (remaining / 15) * (1 / speed) * 1000;
      const startTime = Date.now() - (progress / 100) * estimatedDuration;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / estimatedDuration) * 100, 99);
        setProgress(pct);
      }, 300);
      return;
    }
    // idle → start fresh
    const text = extractPageText();
    if (!text) return;
    textRef.current = text;
    speak(text, speed);
    setExpanded(true);
  }

  function handleStop() {
    stop();
  }

  function handleSpeedChange(newSpeed: number) {
    setSpeed(newSpeed);
    if (state !== "idle") {
      // Restart with new speed from beginning (browser limitation)
      speak(textRef.current, newSpeed);
    }
  }

  if (!supported) return null;

  const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 no-read">
      {/* Expanded panel */}
      {expanded && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-64 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#E05017]" />
              <span className="text-sm font-semibold text-gray-800">Lecture du texte</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Réduire"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E05017] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status */}
          <p className="text-xs text-gray-500 text-center">
            {state === "playing" && "Lecture en cours..."}
            {state === "paused" && "En pause"}
            {state === "idle" && "Appuyer sur Play pour lire la page"}
          </p>

          {/* Controls */}
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

          {/* Speed selector */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5 text-center">Vitesse de lecture</p>
            <div className="flex items-center justify-center gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    speed === s
                      ? "bg-[#E05017] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === 1 ? "×1" : `×${s}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => {
          if (state === "idle") {
            setExpanded(true);
          } else {
            setExpanded((prev) => !prev);
          }
        }}
        className={`group w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          state === "playing"
            ? "bg-[#E05017] animate-pulse"
            : state === "paused"
            ? "bg-amber-500"
            : "bg-[#052838] hover:bg-[#E05017]"
        }`}
        aria-label="Lecteur de texte"
        title="Lire la page"
      >
        {state === "idle" ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
        {!expanded && state === "idle" && (
          <span className="absolute right-16 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Lire la page
          </span>
        )}
      </button>
    </div>
  );
}
