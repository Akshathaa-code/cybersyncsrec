import { createContext, useContext, useState, type ReactNode } from "react";
import { FileText, X } from "lucide-react";
import type { Source } from "@/lib/nexus-data";

type Ctx = { open: (s: Source[]) => void };
const EvidenceCtx = createContext<Ctx>({ open: () => {} });
export const useEvidence = () => useContext(EvidenceCtx);

export function EvidenceProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Source[] | null>(null);
  return (
    <EvidenceCtx.Provider value={{ open: setItems }}>
      {children}
      {items && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/10 animate-in fade-in" onClick={() => setItems(null)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l bg-card p-6 shadow-lift animate-in slide-in-from-right duration-300">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Evidence</p>
                <h3 className="font-display text-3xl">From your material</h3>
              </div>
              <button onClick={() => setItems(null)} className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {items.map((s, i) => (
                <div key={i} className="rounded-xl border bg-background p-4 fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-primary" /> {s.doc}
                    <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Page {s.page}</span>
                  </div>
                  <p className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground">"{s.text}"</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </EvidenceCtx.Provider>
  );
}

export function SourceChip({ s, onClick }: { s: Source; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-accent-foreground">
      <FileText className="h-3 w-3" /> {s.doc} · Page {s.page}
    </button>
  );
}
