import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { chatAnswers, type Source } from "@/lib/nexus-data";
import { PageHeader } from "@/components/nexus/PageHeader";
import { useEvidence, SourceChip } from "@/components/nexus/Evidence";

export const Route = createFileRoute("/_shell/ask")({
  head: () => ({
    meta: [
      { title: "Ask NEXUS — Questions about your material" },
      { name: "description", content: "Ask anything about your uploaded study material, with cited sources." },
      { property: "og:title", content: "Ask NEXUS" },
      { property: "og:description", content: "Ask anything about your uploaded study material, with cited sources." },
    ],
  }),
  component: Ask,
});

type Msg = { role: "user" | "ai"; text: string; sources?: Source[]; typing?: boolean };
const suggestions = Object.keys(chatAnswers);

function renderText(t: string) {
  return t.split("\n").map((line, i) => (
    <p key={i} className={line ? "" : "h-2"}>
      {line.split(/(\*\*[^*]+\*\*)/).map((p, j) => (p.startsWith("**") ? <strong key={j}>{p.slice(2, -2)}</strong> : p))}
    </p>
  ));
}

function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const { open } = useEvidence();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const a = chatAnswers[q] ?? chatAnswers["What should I study first?"]!;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: "", typing: true }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m.slice(0, -1), { role: "ai", text: a.text, sources: a.sources }]), 900);
  };
  const submit = (e: FormEvent) => { e.preventDefault(); ask(input); };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <PageHeader title="Ask NEXUS" subtitle="Ask anything about your uploaded material." />
      <div className="flex-1 space-y-6">
        {msgs.length === 0 && (
          <div className="grid gap-2 sm:grid-cols-2 fade-up">
            {suggestions.map((s) => (
              <button key={s} onClick={() => ask(s)} className="card-surface p-4 text-left text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">{s}</button>
            ))}
          </div>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end fade-up"><div className="max-w-md rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-background">{m.text}</div></div>
          ) : (
            <div key={i} className="flex gap-3 fade-up">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-bold text-background">N</span>
              <div className="card-surface max-w-2xl flex-1 p-5 text-sm leading-relaxed">
                {m.typing ? (
                  <div className="flex gap-1 py-1">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: `${k * 150}ms` }} />)}</div>
                ) : (
                  <>
                    {renderText(m.text)}
                    {m.sources && (
                      <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-4">
                        {m.sources.map((s) => <SourceChip key={s.doc + s.page} s={s} onClick={() => open([s])} />)}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ),
        )}
        {msgs.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-10">
            {suggestions.filter((s) => !msgs.some((m) => m.text === s)).map((s) => (
              <button key={s} onClick={() => ask(s)} className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">{s}</button>
            ))}
          </div>
        )}
        <div ref={end} />
      </div>
      <form onSubmit={submit} className="sticky bottom-4 mt-8 flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-lift">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your material…" className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" />
        <button className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background transition hover:opacity-90" aria-label="Send"><ArrowUp className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
