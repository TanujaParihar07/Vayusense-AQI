"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, X, Bot, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AIChatbot = ({ currentAQI }: { currentAQI?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: "bot",
      content:
        "👋 Hi! I'm VayuBot AI.\nAsk AQI, city pollution, or health advice.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // 🔥 MAP → CHATBOT
  useEffect(() => {
    const handler = (e: any) => {
      const { city, aqi } = e.detail;

      const reply = `📍 ${city} AQI is ${aqi}\n${getHealthAdvice(aqi)}`;

      localStorage.setItem("current_aqi", String(aqi));

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: reply },
      ]);

      speak(reply);
    };

    window.addEventListener("map-aqi", handler);
    return () => window.removeEventListener("map-aqi", handler);
  }, []);

  // 🎤 VOICE INPUT
  const startMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    setListening(true);

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      handleSend(text);
    };

    recognition.onend = () => setListening(false);
  };

  // 🔊 VOICE OUTPUT
  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // ❤️ HEALTH
  const getHealthAdvice = (aqi: number) => {
    if (aqi <= 50) return "😊 Safe air. Enjoy outdoors!";
    if (aqi <= 100) return "🙂 Moderate air. Be careful.";
    if (aqi <= 200) return "😷 Unhealthy. Wear mask.";
    return "☠️ Hazardous! Stay indoors.";
  };

  // 🧠 REALISTIC AQI (FIXED)
  const cityAQIData: any = {
    delhi: 124,
    mumbai: 90,
    gwalior: 124,
    indore: 80,
    bhopal: 110,
  };

  const getCityAQI = (city: string) => {
    const aqi =
      cityAQIData[city.toLowerCase()] ||
      Math.floor(80 + Math.random() * 40);

    localStorage.setItem("current_aqi", String(aqi));

    return `📍 ${city.toUpperCase()} AQI is ${aqi}\n${getHealthAdvice(aqi)}`;
  };

  // 🧠 SMART AI FIXED
  const getReply = (msg: string) => {
    const text = msg.toLowerCase();

    if (text.match(/hi|hello|hey/))
      return "👋 Hello! Ask AQI, city pollution or health advice.";

    // 🔥 CITY AQI
    if (text.includes("aqi")) {
      const cities = ["delhi", "mumbai", "gwalior", "indore", "bhopal"];

      for (let c of cities) {
        if (text.includes(c)) {
          return getCityAQI(c);
        }
      }

      return "❌ Please specify city (e.g. Delhi AQI)";
    }

    // 🔥 CURRENT
    if (text.includes("current")) {
      const aqi =
        currentAQI ||
        Number(localStorage.getItem("current_aqi")) ||
        100;

      return `🌫️ Current AQI is ${aqi}\n${getHealthAdvice(aqi)}`;
    }

    // 🔥 HEALTH
    if (text.includes("health")) {
      const aqi =
        currentAQI ||
        Number(localStorage.getItem("current_aqi")) ||
        100;

      return getHealthAdvice(aqi);
    }

    return "🤖 Try: Delhi AQI / Current AQI / Health advice";
  };

  // 🚀 SEND
  const handleSend = (voiceText?: string) => {
    const msg = voiceText || input;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getReply(msg);

      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
      speak(reply);
      setIsTyping(false);
    }, 500);
  };

  const suggestions = ["Delhi AQI", "Current AQI", "Health advice"];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 w-[370px] h-[540px] bg-slate-900 rounded-2xl flex flex-col shadow-2xl"
          >
            <div className="p-3 bg-blue-600 flex justify-between">
              <div className="flex gap-2 items-center">
                <Bot />
                VayuBot AI
              </div>
              <X onClick={() => setIsOpen(false)} />
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-sm whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-blue-600 ml-auto w-fit"
                      : "bg-white/10"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2 px-3 pb-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-white/10 px-2 py-1 rounded"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="p-2 flex gap-2 border-t border-white/10">
              <button onClick={startMic}>
                <Mic className={listening ? "text-red-400" : "text-green-400"} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white/10 p-2 rounded text-sm"
                placeholder="Ask AQI..."
              />

              <button onClick={() => handleSend()}>
                <Send />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 p-4 rounded-full"
      >
        <MessageSquare />
      </button>
    </div>
  );
};