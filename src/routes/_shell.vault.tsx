import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, UploadCloud, Sparkles } from "lucide-react";
import { initialFiles } from "@/lib/nexus-data";
import { PageHeader } from "@/components/nexus/PageHeader";

export const Route = createFileRoute("/_shell/vault")({
  head: () => ({
    meta: [
      { title: "Knowledge Vault — NEXUS" },
      { name: "description", content: "Your study material, organized in one place." },
      { property: "og:title", content: "Knowledge Vault — NEXUS" },
      { property: "og:description", content: "Your study material, organized in one place." },
    ],
  }),
  component: Vault,
});

const extra = ["OS PYQ 2021.pdf", "OS Module 5 - File Systems.pdf", "Synchronization Notes.pdf"];
const phases = ["Reading your material...", "Finding repeated topics...", "Identifying priorities..."];

function Vault() {
  const [files, setFiles] = useState(initialFiles.map((f) => ({ ...f, done: true })));
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState(-1);
  const nav = useNavigate();
  const added = useRef(0);

  const addFile = () => {
    const name = extra[added.current % extra.length] + (added.current >= extra.length ? ` (${added.current})` : "");
    added.current++;
    setFiles((f) => [{ name, pages: 12, done: false }, ...f]);
    setTimeout(() => setFiles((f) => f.map((x) => (x.name === name ? { ...x, done: true } : x))), 1200);
  };

  const analyze = () => {
    setPhase(0);
    setTimeout(() => setPhase(1), 900);
    setTimeout(() => setPhase(2), 1800);
    setTimeout(() => nav({ to: "/matters" }), 2700);
  };

  const pages = files.reduce((a, f) => a + f.pages, 0);

  return (
    <div>
      <PageHeader title="Knowledge Vault" subtitle="Your study material, organized.">
        <button onClick={analyze} disabled={phase >= 0} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-soft transition hover:shadow-lift disabled:opacity-60">
          <Sparkles className="h-4 w-4" /> Analyze
        </button>
      </PageHeader>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFile(); }}
        className={`rounded-2xl border-2 border-dashed p-12 text-center transition ${drag ? "border-primary bg-accent" : "bg-card hover:border-primary/40"}`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-primary" strokeWidth={1.5} />
        <p className="mt-4 text-lg font-semibold">Drop your study material here</p>
        <p className="mt-1 text-sm text-muted-foreground">PDF, notes, modules and previous-year papers</p>
        <button onClick={addFile} className="mt-6 rounded-lg border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted">Choose Files</button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[[files.length, "Documents"], [pages, "Pages"], [(1284 + (files.length - 9) * 61).toLocaleString(), "Sections"]].map(([v, l]) => (
          <div key={l} className="card-surface p-5">
            <p className="font-display text-4xl">{v}</p>
            <p className="text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card-surface divide-y overflow-hidden">
        {files.map((f) => (
          <div key={f.name} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50 fade-up">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-high-soft"><FileText className="h-4 w-4 text-high" /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{f.name}</p>
              <p className="text-xs text-muted-foreground">PDF · {f.pages} pages</p>
            </div>
            {f.done ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Analyzed</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing</span>
            )}
          </div>
        ))}
      </div>

      {phase >= 0 && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="card-surface w-80 p-8 shadow-lift">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div className="mt-6 space-y-3">
              {phases.map((p, i) => (
                <p key={p} className={`flex items-center gap-2 text-sm transition ${i <= phase ? "text-foreground" : "text-muted-foreground/40"}`}>
                  {i < phase ? <CheckCircle2 className="h-4 w-4 text-success" /> : <span className={`h-1.5 w-1.5 rounded-full ${i === phase ? "bg-primary" : "bg-border"} mx-[5px]`} />}
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
