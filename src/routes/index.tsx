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
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function TrafficNode({ label, icon: Icon, active }: { label: string; icon: React.ElementType; active: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 rounded-xl border px-5 py-4 transition-all duration-500 ${
        active
          ? "border-neon-teal bg-surface-elevated glow-teal-sm"
          : "border-border bg-card"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          active ? "bg-neon-teal/10 text-neon-teal" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon size={20} />
      </div>
      <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">{label}</span>
    </div>
  );
}

function TokenTrafficCopDashboard() {
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [activeLane, setActiveLane] = useState<"fast" | "heavy" | null>(null);
  const routerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoutePrompt = () => {
    if (!sandboxInput.trim()) return;
    setIsRouting(true);
    setSandboxOutput(null);
    setActiveLane(null);

    routerTimer.current = setTimeout(() => {
      setIsRouting(false);
      setActiveLane("fast");
      setSandboxOutput(
        "This is a simulated response from the Fast Lane (Cheap Model). The prompt was analyzed and determined to be a simple query that doesn't require heavy reasoning. The router saved you approximately 95% of the token cost by choosing the lightweight model.\n\nKey stats:\n- Model: gpt-3.5-turbo\n- Tokens: 142\n- Estimated cost: $0.0021\n- Savings vs premium: $0.0399"
      );
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (routerTimer.current) clearTimeout(routerTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-teal/10 text-neon-teal glow-teal-sm">
              <RouteIcon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Token Traffic Cop
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                AI Developer Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-neon-teal/30 bg-neon-teal/5 text-neon-teal font-mono text-[10px] uppercase">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-neon-teal animate-pulse" />
              System Online
            </Badge>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated border border-border text-muted-foreground">
              <Terminal size={14} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-12">
        {/* Section 1: Wallet Tracker */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Wallet Tracker
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Total Money Saved - Big Card */}
            <div className="md:col-span-1 relative overflow-hidden rounded-2xl border border-border bg-card p-6 glow-teal-sm">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-neon-teal/5 blur-3xl" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Total Money Saved
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-teal/10 text-neon-teal glow-teal-sm">
                    <PiggyBank size={22} />
                  </div>
                </div>
                <div className="mb-1 text-5xl font-black tracking-tight text-foreground">
                  $<AnimatedCounter target={142.5} />
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. using premium models for every request
                </p>
                <div className="mt-4 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-neon-teal" />
                  <span className="text-xs font-medium text-neon-teal">+ $12.40 this week</span>
                </div>
              </div>
            </div>

            {/* Cheap Tokens Used */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-teal/5 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Cheap Tokens Used
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-teal/10 text-neon-teal">
                    <Zap size={18} />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold tracking-tight text-foreground font-mono-nums">
                  <AnimatedCounter target={28472} />
                </div>
                <p className="text-xs text-muted-foreground">Fast Lane routings</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-neon-teal to-neon-teal/60" />
                </div>
                <p className="mt-1.5 text-[10px] font-mono text-muted-foreground">78% of total traffic</p>
              </div>
            </div>

            {/* Premium Tokens Used */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-purple/5 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Premium Tokens Used
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple">
                    <Crown size={18} />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold tracking-tight text-foreground font-mono-nums">
                  <AnimatedCounter target={8124} />
                </div>
                <p className="text-xs text-muted-foreground">Heavy Lane routings</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[22%] rounded-full bg-gradient-to-r from-neon-purple to-neon-purple/60" />
                </div>
                <p className="mt-1.5 text-[10px] font-mono text-muted-foreground">22% of total traffic</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Live Traffic Router */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Live Traffic Router
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-neon-teal" />
                  <span className="text-sm font-semibold text-foreground">Live Routing Status</span>
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
                    <ChevronRight size={20} className="text-muted-foreground/40" />
                  </div>
                  <div className="md:hidden">
                    <ChevronRight size={20} className="rotate-90 text-muted-foreground/40" />
                  </div>
                </div>

                {/* Smart Router Node */}
                <div
                  className={`relative flex flex-col items-center gap-2 rounded-xl border px-6 py-5 transition-all duration-500 ${
                    isRouting || activeLane !== null
                      ? "border-neon-teal bg-surface-elevated glow-teal-sm"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="absolute -inset-px rounded-xl border border-neon-teal/20 opacity-0 transition-opacity duration-500" />
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
                      isRouting || activeLane !== null
                        ? "bg-neon-teal/10 text-neon-teal glow-teal-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                    Smart Router
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {isRouting ? "Analyzing..." : activeLane ? "Decision Made" : "Idle"}
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1 md:flex-row">
                  <div className="hidden md:block">
                    <ChevronRight size={20} className="text-muted-foreground/40" />
                  </div>
                  <div className="md:hidden">
                    <ChevronRight size={20} className="rotate-90 text-muted-foreground/40" />
                  </div>
                </div>

                {/* Route Taken */}
                <div
                  className={`flex flex-col items-center gap-2 rounded-xl border px-6 py-5 transition-all duration-500 min-w-[180px] ${
                    activeLane === "fast"
                      ? "border-neon-teal bg-neon-teal/5 glow-teal-sm"
                      : activeLane === "heavy"
                      ? "border-neon-purple bg-neon-purple/5 glow-purple-sm"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      activeLane === "fast"
                        ? "bg-neon-teal/10 text-neon-teal"
                        : activeLane === "heavy"
                        ? "bg-neon-purple/10 text-neon-purple"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {activeLane === "fast" ? <Zap size={20} /> : activeLane === "heavy" ? <Crown size={20} /> : <ArrowRight size={20} />}
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                    {activeLane === "fast" ? "Fast Lane" : activeLane === "heavy" ? "Heavy Lane" : "Route Taken"}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
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
                      ? "border-neon-teal/40 bg-neon-teal/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className={activeLane === "fast" ? "text-neon-teal" : "text-muted-foreground"} />
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground">Fast Lane</span>
                    <div className="ml-auto flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-full transition-all duration-300 ${
                            activeLane === "fast" ? "bg-neon-teal animate-pulse" : "bg-muted"
                          }`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">Lightweight models for simple queries</p>
                </div>

                <div
                  className={`rounded-xl border p-4 transition-all duration-500 ${
                    activeLane === "heavy"
                      ? "border-neon-purple/40 bg-neon-purple/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={14} className={activeLane === "heavy" ? "text-neon-purple" : "text-muted-foreground"} />
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground">Heavy Lane</span>
                    <div className="ml-auto flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-full transition-all duration-300 ${
                            activeLane === "heavy" ? "bg-neon-purple animate-pulse" : "bg-muted"
                          }`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">Premium models for complex reasoning</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Testing Sandbox */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Testing Sandbox
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-neon-teal" />
              <span className="text-sm font-semibold text-foreground">Prompt Tester</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                Type a prompt to see the router in action
              </span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Textarea
                  placeholder="Enter your prompt here... e.g., 'Explain quantum computing in simple terms'"
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  className="min-h-[120px] resize-none border-border bg-surface text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-neon-teal/50"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleRoutePrompt}
                  disabled={isRouting || !sandboxInput.trim()}
                  className="h-12 w-full md:w-auto bg-neon-teal text-primary-foreground font-semibold hover:bg-neon-teal/90 glow-teal-sm disabled:opacity-50 disabled:glow-none"
                >
                  {isRouting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      Routing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Route Prompt
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Response Area */}
            {sandboxOutput && (
              <div className="mt-6 animate-fade-in">
                <div className="rounded-xl border border-border bg-surface p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Response Output
                    </span>
                    <Badge className="bg-neon-teal/10 text-neon-teal border-neon-teal/20 text-[10px] font-mono">
                      Fast Lane
                    </Badge>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                    {sandboxOutput}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-neon-teal/5 border border-neon-teal/20 px-4 py-3">
                  <Sparkles size={16} className="text-neon-teal shrink-0" />
                  <span className="text-xs font-mono font-medium text-neon-teal">
                    Traffic Cop Decision: Routed to Fast Lane (Saved 95% cost!)
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <p className="text-[10px] font-mono text-muted-foreground">
            Token Traffic Cop v1.0.0 — Smart AI Routing
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-neon-teal animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground">All systems nominal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
