import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Flame, Sparkles, X, CalendarDays } from "lucide-react";
import { topics, repeated, type Topic } from "@/lib/nexus-data";
import { PageHeader } from "@/components/nexus/PageHeader";
import { useEvidence, SourceChip } from "@/components/nexus/Evidence";

export const Route = createFileRoute("/_shell/matters")({
  head: () => ({
    meta: [
      { title: "What Matters — NEXUS" },
      { name: "description", content: "Patterns and priorities discovered across your study material." },
      { property: "og:title", content: "What Matters — NEXUS" },
      { property: "og:description", content: "Patterns and priorities discovered across your study material." },
    ],
  }),
  component: Matters,
});

const plan = [
  { day: "Day 1", items: ["Deadlocks", "CPU Scheduling"] },
  { day: "Day 2", items: ["Memory Management", "Paging"] },
  { day: "Day 3", items: ["File Systems", "Synchronization"] },
];

function Matters() {
  const [showPlan, setShowPlan] = useState(false);
  return (
    <div>
      <PageHeader title="What Matters" subtitle="Patterns and priorities discovered across your material." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["9", "Documents"], ["47", "Questions"], ["12", "Repeated Topics"], ["5", "High Priority"]].map(([v, l], i) => (
          <div key={l} className="card-surface p-5 fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="font-display text-4xl">{v}</p>
            <p className="text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-primary/25 bg-accent p-6 fade-up">
        <div className="flex flex-wrap items-start gap-4">
          <Sparkles className="mt-1 h-5 w-5 text-primary" />
          <div className="flex-1 min-w-60">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">Your biggest opportunity</p>
            <p className="mt-2 text-lg leading-relaxed">Deadlocks and CPU Scheduling appear most consistently across your previous-year papers. If your preparation time is limited, start here.</p>
          </div>
          <button onClick={() => setShowPlan(true)} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Create Focus Plan</button>
        </div>
      </div>

      <h2 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">High Priority</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t, i) => <TopicCard key={t.name} t={t} i={i} />)}
      </div>

      <h2 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Repeated Questions</h2>
      <div className="space-y-3">
        {repeated.map((r) => <RepeatCard key={r.q} r={r} />)}
      </div>

      {showPlan && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/10 p-4 animate-in fade-in" onClick={() => setShowPlan(false)}>
          <div className="card-surface w-full max-w-lg p-8 shadow-lift animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"><CalendarDays className="h-4 w-4" /> Your 3-day focus plan</p>
              <button onClick={() => setShowPlan(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-6 space-y-3">
              {plan.map((d, i) => (
                <div key={d.day} className="flex gap-4 rounded-xl border bg-background p-4">
                  <span className="font-display text-2xl text-primary">{d.day}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {d.items.map((it) => (
                      <span key={it} className={`rounded-md px-2.5 py-1 text-sm font-medium ${i === 0 ? "bg-high-soft text-high" : i === 1 ? "bg-medium-soft text-medium" : "bg-muted text-muted-foreground"}`}>{it}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Priorities are based on patterns found in your uploaded material, not a prediction of exam questions.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TopicCard({ t, i }: { t: Topic; i: number }) {
  const { open } = useEvidence();
  const high = t.level === "HIGH";
  return (
    <div className="card-surface flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lift fade-up" style={{ animationDelay: `${i * 70}ms` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${high ? "bg-high-soft" : "bg-medium-soft"}`}>
            <Flame className={`h-4 w-4 ${high ? "text-high" : "text-medium"}`} />
          </div>
          <h3 className="text-lg font-semibold">{t.name}</h3>
        </div>
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider ${high ? "bg-high-soft text-high" : "bg-medium-soft text-medium"}`}>{t.level} PRIORITY</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Appeared in <span className="font-semibold text-foreground">{t.count}</span> previous-year papers</p>
      <div className="mt-4 flex gap-1">
        {[0, 1, 2, 3].map((k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k < t.count ? (high ? "bg-high" : "bg-medium") : "bg-muted"}`} />)}
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why it matters</p>
      <ul className="mt-2 space-y-1 text-sm">
        {t.why.map((w) => <li key={w} className="flex gap-2"><span className="text-primary">•</span>{w}</li>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {t.sources.map((s) => <SourceChip key={s.doc + s.page} s={s} onClick={() => open([s])} />)}
      </div>
      <button onClick={() => open(t.sources)} className="mt-5 self-start rounded-lg border px-3.5 py-2 text-sm font-semibold transition hover:bg-muted">View Evidence</button>
    </div>
  );
}

function RepeatCard({ r }: { r: (typeof repeated)[number] }) {
  const [o, setO] = useState(false);
  const { open } = useEvidence();
  return (
    <div className="card-surface overflow-hidden transition hover:shadow-lift">
      <button onClick={() => setO(!o)} className="flex w-full items-center gap-4 p-5 text-left">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent font-display text-xl text-accent-foreground">{r.count}×</span>
        <div className="flex-1">
          <p className="font-semibold">"{r.q}"</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Appeared {r.count} times · {r.years.join(" · ")}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${o ? "rotate-180" : ""}`} />
      </button>
      {o && (
        <div className="space-y-2 border-t bg-background px-5 py-4 animate-in fade-in">
          {r.sources.map((s) => (
            <button key={s.doc} onClick={() => open([s])} className="block w-full rounded-lg p-2 text-left text-sm transition hover:bg-muted">
              <span className="font-semibold">{s.doc} · Page {s.page}</span>
              <span className="block text-muted-foreground">{s.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
