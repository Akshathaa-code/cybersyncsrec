import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, Lightbulb, ListOrdered } from "lucide-react";

export const Route = createFileRoute("/_shell/")({
  head: () => ({
    meta: [
      { title: "NEXUS — Stop reading everything. Know what matters." },
      { name: "description", content: "Upload your syllabus, notes and previous-year papers. NEXUS finds recurring questions and important topics." },
      { property: "og:title", content: "NEXUS — Know what matters" },
      { property: "og:description", content: "NEXUS finds recurring questions, important topics and what deserves your attention." },
    ],
  }),
  component: Home,
});

const steps = [
  { n: "01", t: "Upload", d: "Bring your study material together.", icon: Upload },
  { n: "02", t: "Understand", d: "Find recurring topics and important information.", icon: Lightbulb },
  { n: "03", t: "Prioritize", d: "Know what to study first.", icon: ListOrdered },
];

function Home() {
  return (
    <div className="py-8">
      <div className="fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Information → Understanding → Priority → Action
        </span>
        <h1 className="mt-8 font-display text-6xl leading-[1.02] tracking-tight md:text-8xl">
          Stop reading everything.
          <br />
          <span className="italic text-primary">Know what matters.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Upload your syllabus, notes and previous-year papers. NEXUS finds recurring questions, important topics and what deserves your attention.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/vault" className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-soft transition hover:shadow-lift">
            Start Analyzing <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link to="/matters" className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-muted">
            View Demo
          </Link>
        </div>
      </div>
      <div className="mt-20 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.n} className="card-surface p-6 transition hover:-translate-y-0.5 hover:shadow-lift fade-up" style={{ animationDelay: `${150 + i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl text-muted-foreground">{s.n}</span>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-6 font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
