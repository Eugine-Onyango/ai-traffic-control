import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  PiggyBank,
  Zap,
  Crown,
  ArrowRight,
  Route as RouteIcon,
  ChevronRight,
  Terminal,
  Sparkles,
  ShieldCheck,
  Activity,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  component: TokenTrafficCopDashboard,
});

function AnimatedCounter({ target, prefix = "" }: { target: number; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-mono-nums">
      {prefix}
      {count.toFixed(2)}
    </span>
  );
}

function StatusLight({ color, label, active }: { color: "teal" | "purple"; label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`h-3 w-3 rounded-full ${
            color === "teal" ? "bg-neon-teal" : "bg-neon-purple"
          } ${active ? "animate-ping-slow" : ""}`}
        />
        <div
          className={`absolute inset-0 h-3 w-3 rounded-full ${
            color === "teal" ? "bg-neon-teal" : "bg-neon-purple"
          } ${active ? "glow-teal-sm" : ""}`}
        />
      </div>
      <span className="text-xs font-mono uppercase tracking-wider text-gray-600">{label}</span>
    </div>
  );
}

function TrafficNode({ label, icon: Icon, active }: { label: string; icon: React.ElementType; active: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 rounded-xl border px-5 py-4 transition-all duration-500 ${
        active
          ? "border-neon-teal bg-white glow-teal-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          active ? "bg-neon-teal/10 text-neon-teal" : "bg-gray-100 text-gray-600"
        }`}
      >
        <Icon size={20} />
      </div>
      <span className="text-xs font-mono font-medium uppercase tracking-wider text-gray-900">{label}</span>
    </div>
  );
}

function TokenTrafficCopDashboard() {
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [activeLane, setActiveLane] = useState<"fast" | "heavy" | null>(null);
  const [stats, setStats] = useState({ cheap_count: 0, premium_count: 0, total_saved_dollars: 0.0 });
  const routerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleResetStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/reset", { method: "POST" });
      const data = await response.json();
      setStats(data);
      setSandboxOutput(null);
      setActiveLane(null);
    } catch (error) {
      console.error("Error resetting stats:", error);
    }
  };

  const handleRoutePrompt = async () => {
    if (!sandboxInput.trim()) return;
    setIsRouting(true);
    setSandboxOutput(null);
    setActiveLane(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sandboxInput }),
      });
      const data = await response.json();
      
      setIsRouting(false);
      setActiveLane(data.route === "cheap" ? "fast" : "heavy");
      const cleanResponse = data.response.replace(/\[Simulation Mode.*?\]\n*/gi, '').replace(/\[Model Used:.*?\]\n*/gi, '').trim();
      const translatedRoute = data.route === "cheap" ? "🐇 The Rabbit Run" : "🐘 The Elephant Trail";
      const translatedReason = data.reason.includes("Short") ? "It was a quick and short message!" : "It was a long or deep message!";
      setSandboxOutput(`${cleanResponse}\n\n---\nDiagnostic:\nPath: ${translatedRoute}\nWhy: ${translatedReason}${data.word_count ? `\nSentence Length (Words): ${data.word_count}` : ""}`);
      if (data.stats) setStats(data.stats);
    } catch (error) {
      console.error(error);
      setIsRouting(false);
      setSandboxOutput("Error: Could not connect to Token Traffic Cop backend.");
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));

    return () => {
      if (routerTimer.current) clearTimeout(routerTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAF1] text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-teal/10 text-neon-teal glow-teal-sm">
              <RouteIcon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Token Traffic Cop
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600">
                AI Developer Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-neon-teal/30 bg-neon-teal/5 text-neon-teal font-mono text-[10px] uppercase">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-neon-teal animate-pulse" />
              System Online
            </Badge>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600">
              <Terminal size={14} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-12">
        {/* Section 1: Wallet Tracker */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600 whitespace-nowrap">
                Wallet Tracker
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>
            <button 
              onClick={handleResetStats}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900 border-2 border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              Reset Stats
            </button>
          </div>

          <div className="flex justify-center">
            <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-white p-10 shadow-[0_0_40px_rgba(236,72,153,0.15)] text-center w-full max-w-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-[120px] leading-none mb-6 drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                  🐷
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-4">
                  Money Kept in Your Pocket:
                </h2>
                
                <div className="text-6xl font-black text-pink-500 drop-shadow-sm flex items-center gap-2">
                  $
                  <AnimatedCounter target={stats.total_saved_dollars} />
                </div>
                
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-500 mt-6 border border-pink-500/20">
                  <Sparkles size={16} />
                  <span>The Rabbit Run saves you money!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Live Traffic Router */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
              Live Traffic Router
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8">
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-neon-teal" />
                  <span className="text-sm font-semibold text-gray-900">Live Routing Status</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusLight color="teal" label="Router Active" active />
                  <StatusLight color="purple" label="Balanced" active={false} />
                </div>
              </div>

              {/* Traffic Flow Visualization */}
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center">
                {/* Incoming Prompt */}
                <TrafficNode label="Incoming Prompt" icon={Terminal} active={isRouting || activeLane !== null} />

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1 md:flex-row">
                  <div className="hidden md:block">
                    <ChevronRight size={20} className="text-gray-600/40" />
                  </div>
                  <div className="md:hidden">
                    <ChevronRight size={20} className="rotate-90 text-gray-600/40" />
                  </div>
                </div>

                {/* Smart Router Node */}
                <div
                  className={`relative flex flex-col items-center gap-2 rounded-xl border px-6 py-5 transition-all duration-500 ${
                    isRouting || activeLane !== null
                      ? "border-neon-teal bg-white glow-teal-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="absolute -inset-px rounded-xl border border-neon-teal/20 opacity-0 transition-opacity duration-500" />
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
                      isRouting || activeLane !== null
                        ? "bg-neon-teal/10 text-neon-teal glow-teal-sm"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-900">
                    Smart Router
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">
                    {isRouting ? "Analyzing..." : activeLane ? "Decision Made" : "Idle"}
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1 md:flex-row">
                  <div className="hidden md:block">
                    <ChevronRight size={20} className="text-gray-600/40" />
                  </div>
                  <div className="md:hidden">
                    <ChevronRight size={20} className="rotate-90 text-gray-600/40" />
                  </div>
                </div>

                {/* Route Taken */}
                <div
                  className={`flex flex-col items-center gap-2 rounded-xl border px-6 py-5 transition-all duration-500 min-w-[180px] ${
                    activeLane === "fast"
                      ? "border-neon-teal bg-neon-teal/5 glow-teal-sm"
                      : activeLane === "heavy"
                      ? "border-neon-purple bg-neon-purple/5 glow-purple-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      activeLane === "fast"
                        ? "bg-neon-teal/10 text-neon-teal"
                        : activeLane === "heavy"
                        ? "bg-neon-purple/10 text-neon-purple"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activeLane === "fast" ? <Zap size={20} /> : activeLane === "heavy" ? <Crown size={20} /> : <ArrowRight size={20} />}
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-900 text-center">
                    {activeLane === "fast" ? "🐇 The Rabbit Run" : activeLane === "heavy" ? "🐘 The Elephant Trail" : "Route Taken"}
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">
                    {activeLane === "fast"
                      ? "Cheap Model"
                      : activeLane === "heavy"
                      ? "Premium Model"
                      : "Waiting..."}
                  </span>
                  {activeLane === "fast" && (
                    <Badge className="mt-1 bg-neon-teal/10 text-neon-teal border-neon-teal/20 text-[10px]">
                      Saved 95%
                    </Badge>
                  )}
                  {activeLane === "heavy" && (
                    <Badge className="mt-1 bg-neon-purple/10 text-neon-purple border-neon-purple/20 text-[10px]">
                      Premium Quality
                    </Badge>
                  )}
                </div>
              </div>

              {/* Lane Indicators */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div
                  className={`rounded-xl border p-4 transition-all duration-500 ${
                    activeLane === "fast"
                      ? "border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className={activeLane === "fast" ? "text-green-500" : "text-gray-600"} />
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-900">🐇 The Rabbit Run</span>
                    <div className="ml-auto flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-full transition-all duration-300 ${
                            activeLane === "fast" ? "bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-gray-100"
                          }`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-gray-600">The Quick & Light Lane (Saves Your Money!)</p>
                </div>

                <div
                  className={`rounded-xl border p-4 transition-all duration-500 ${
                    activeLane === "heavy"
                      ? "border-orange-500/50 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={14} className={activeLane === "heavy" ? "text-orange-500" : "text-gray-600"} />
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-900">🐘 The Elephant Trail</span>
                    <div className="ml-auto flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-full transition-all duration-300 ${
                            activeLane === "heavy" ? "bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.6)]" : "bg-gray-100"
                          }`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-gray-600">The Deep Thinking Lane (For Tough Questions!)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Testing Sandbox */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
              Testing Sandbox
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-neon-teal" />
              <span className="text-sm font-semibold text-gray-900">Prompt Tester</span>
              <span className="ml-auto text-[10px] font-mono text-gray-600">
                Type a prompt to see the router in action
              </span>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="w-full max-w-3xl flex flex-col gap-4 relative">
                {/* Speech Bubble Input */}
                <div className="relative">
                  <Textarea
                    placeholder="Type anything you want to ask the computer here..."
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    className="min-h-[140px] resize-none border-2 border-gray-200 bg-white text-black text-lg p-6 shadow-xl rounded-[2.5rem] rounded-bl-md focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-400"
                  />
                  {/* Little speech bubble tail visual */}
                  <div className="absolute -bottom-3 left-6 w-6 h-6 bg-white border-b-2 border-l-2 border-gray-200 transform rotate-45 shadow-sm rounded-bl-sm pointer-events-none" />
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleRoutePrompt}
                    disabled={isRouting || !sandboxInput.trim()}
                    className="h-16 px-16 bg-yellow-400 text-black font-black text-2xl uppercase tracking-widest hover:bg-yellow-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] disabled:opacity-50 rounded-full"
                  >
                    {isRouting ? (
                      <span className="flex items-center gap-3">
                        <span className="h-6 w-6 animate-spin rounded-full border-4 border-black/30 border-t-black" />
                        Thinking...
                      </span>
                    ) : (
                      "Go!"
                    )}
                  </Button>
                </div>
              </div>

              {/* The Two Doors Layout (Future Animation Target) */}
              <div className="w-full max-w-3xl grid grid-cols-2 gap-8 mt-4">
                {/* Door 1: Rabbit */}
                <div className={`relative flex flex-col items-center gap-3 p-6 rounded-[2rem] border-4 transition-all duration-500 ${
                  activeLane === "fast" 
                    ? "border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-105" 
                    : "border-gray-200 bg-gray-50 opacity-70 hover:opacity-100"
                }`}>
                  <div className="text-6xl mb-2">🐇</div>
                  <h3 className="font-black text-xl text-center text-gray-900">Door 1</h3>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30 font-bold uppercase tracking-wider">The Rabbit Run</Badge>
                </div>

                {/* Door 2: Elephant */}
                <div className={`relative flex flex-col items-center gap-3 p-6 rounded-[2rem] border-4 transition-all duration-500 ${
                  activeLane === "heavy" 
                    ? "border-orange-500 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-105" 
                    : "border-gray-200 bg-gray-50 opacity-70 hover:opacity-100"
                }`}>
                  <div className="text-6xl mb-2">🐘</div>
                  <h3 className="font-black text-xl text-center text-gray-900">Door 2</h3>
                  <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 font-bold uppercase tracking-wider">The Elephant Trail</Badge>
                </div>
              </div>
            </div>

            {/* Response Area */}
            {sandboxOutput && (
              <div className="mt-6 animate-fade-in">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-800">
                      🤖 The Computer's Answer:
                    </span>
                    <Badge className={
                      activeLane === "fast" 
                        ? "bg-neon-teal/10 text-neon-teal border-neon-teal/20 text-[10px] font-mono"
                        : "bg-neon-purple/10 text-neon-purple border-neon-purple/20 text-[10px] font-mono"
                    }>
                      {activeLane === "fast" ? "🐇 The Rabbit Run" : "🐘 The Elephant Trail"}
                    </Badge>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 font-mono">
                    {sandboxOutput}
                  </div>
                </div>

                <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 border ${
                  activeLane === "fast" 
                    ? "bg-neon-teal/5 border-neon-teal/20" 
                    : "bg-neon-purple/5 border-neon-purple/20"
                }`}>
                  <Sparkles size={16} className={`shrink-0 ${
                    activeLane === "fast" ? "text-neon-teal" : "text-neon-purple"
                  }`} />
                  <span className={`text-xs font-mono font-medium ${
                    activeLane === "fast" ? "text-neon-teal" : "text-neon-purple"
                  }`}>
                    {activeLane === "fast" ? "✨ The Traffic Cop chose the Rabbit! You saved money!" : "✨ The Traffic Cop chose the Elephant! Deep thinking activated!"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 mt-12">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <p className="text-[10px] font-mono text-gray-600">
            Token Traffic Cop v1.0.0 — Smart AI Routing
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-neon-teal animate-pulse" />
            <span className="text-[10px] font-mono text-gray-600">All systems nominal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
