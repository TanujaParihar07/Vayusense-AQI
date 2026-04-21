import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const responses: Record<string, string> = {
  default: "I'm VayuBot, your AI air-quality assistant. Ask me about AQI, forecasts, or health tips!",
  aqi: "Today's AQI in New Delhi is 218 — Unhealthy. The dominant pollutant is PM2.5. I recommend limiting outdoor activity and wearing an N95 mask.",
  health: "With AQI above 200, I suggest: 1) Stay indoors during 2-6pm peak hours, 2) Use HEPA air purifiers, 3) Avoid intense exercise outdoors, 4) Stay hydrated.",
  forecast: "Tomorrow's AI forecast shows AQI rising to 232 (Very Unhealthy) before improving to 142 by Friday. Confidence: 94.7%.",
};

const suggestions = [
  { label: "Aaj ka AQI kya hai?", key: "aqi" },
  { label: "Health tips", key: "health" },
  { label: "Kal ka prediction", key: "forecast" },
];

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "👋 Hi! I'm VayuBot. How can I help you breathe better today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string, key?: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = key && responses[key] ? responses[key] : responses.default;
      setMessages((m) => [...m, { role: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl bg-eco shadow-glow flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
        aria-label="Open AI chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary ring-2 ring-background animate-pulse" />}
      </button>

      {/* Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] sm:w-96 h-[520px] glass-strong rounded-3xl shadow-elevated flex flex-col overflow-hidden animate-scale-in origin-bottom-right">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/40 flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-xl bg-eco flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">VayuBot</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-aqi-good animate-pulse" /> AI Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted/60">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-eco text-primary-foreground rounded-br-sm shadow-glow"
                      : "glass rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 0.2, 0.4].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.key}
                  onClick={() => send(s.label, s.key)}
                  className="text-xs px-3 py-1.5 rounded-full glass border border-border/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-border/40 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask VayuBot..."
              className="flex-1 h-10 px-3 bg-muted/40 border border-border/40 rounded-xl text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-xl bg-eco flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
