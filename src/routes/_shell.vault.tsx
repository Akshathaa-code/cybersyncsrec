import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Loader2, UploadCloud, Sparkles, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/nexus/PageHeader";
import { deleteDocument, listDocuments, setStatus, uploadPdf, type DocRow, type DocStatus } from "@/lib/documents";

export const Route = createFileRoute("/_shell/vault")({
  head: () => ({
    meta: [
      { title: "Knowledge Vault — NEXUS" },
      { name: "description", content: "Your study material, organized in one place." },
      { property: "og:title", content: "Knowledge Vault — NEXUS" },
      { property: "og:description", content: "Your study material, organized in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Vault,
});

const phases = ["Reading your material...", "Finding repeated topics...", "Identifying priorities..."];
const MAX = 20 * 1024 * 1024;

function StatusBadge({ s }: { s: DocStatus }) {
  if (s === "analyzed") return <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Analyzed</span>;
  if (s === "ready") return <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Ready</span>;
  if (s === "error") return <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5" /> Error</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> {s === "uploading" ? "Uploading" : "Analyzing"}</span>;
}

function Vault() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState(-1);
  const nav = useNavigate();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listDocuments().then(setDocs).catch((e) => setLoadErr(e.message ?? "Could not load documents"));
  }, []);

  const patch = (id: string, status: DocStatus) => setDocs((d) => d.map((x) => (x.id === id ? { ...x, status } : x)));

  const handleFiles = async (list: FileList | null) => {
    if (!list) return;
    setMsg(null);
    for (const file of Array.from(list)) {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) { setMsg(`${file.name} is not a PDF.`); continue; }
      if (file.size > MAX) { setMsg(`${file.name} is larger than 20 MB.`); continue; }
      let id: string | null = null;
      try {
        const row = await uploadPdf(file, (r) => { id = r.id; setDocs((d) => [r, ...d]); });
        patch(row.id, row.status);
      } catch (e) {
        if (id) patch(id, "error");
        setMsg(`Upload failed for ${file.name}: ${(e as Error).message}`);
      }
    }
    if (input.current) input.current.value = "";
  };

  const analyze = async () => {
    setPhase(0);
    const ready = docs.filter((d) => d.status === "ready");
    ready.forEach((d) => { patch(d.id, "analyzing"); setStatus(d.id, "analyzing").catch(() => {}); });
    setTimeout(() => setPhase(1), 900);
    setTimeout(() => setPhase(2), 1800);
    setTimeout(async () => {
      await Promise.all(ready.map((d) => setStatus(d.id, "analyzed").catch(() => {})));
      nav({ to: "/matters" });
    }, 2700);
  };

  const remove = async (d: DocRow) => {
    if (!confirm(`Delete ${d.filename}?`)) return;
    try { await deleteDocument(d); setDocs((x) => x.filter((y) => y.id !== d.id)); setMsg(null); }
    catch (e) { setMsg(`Delete failed for ${d.filename}: ${(e as Error).message}`); }
  };
  const totalMb = (docs.reduce((a, d) => a + (d.size_bytes ?? 0), 0) / 1024 / 1024).toFixed(1);
  const readyCount = docs.filter((d) => d.status === "ready" || d.status === "analyzed").length;

  return (
    <div>
      <PageHeader title="Knowledge Vault" subtitle="Your study material, organized.">
        <button onClick={analyze} disabled={phase >= 0} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-soft transition hover:shadow-lift disabled:opacity-60">
          <Sparkles className="h-4 w-4" /> Analyze
        </button>
      </PageHeader>

      <input ref={input} type="file" accept="application/pdf,.pdf" multiple hidden onChange={(e) => handleFiles(e.target.files)} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed p-12 text-center transition ${drag ? "border-primary bg-accent" : "bg-card hover:border-primary/40"}`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-primary" strokeWidth={1.5} />
        <p className="mt-4 text-lg font-semibold">Drop your study material here</p>
        <p className="mt-1 text-sm text-muted-foreground">PDF files up to 20 MB — notes, modules and previous-year papers</p>
        <button onClick={() => input.current?.click()} className="mt-6 rounded-lg border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted">Choose Files</button>
        {msg && <p className="mt-4 text-sm text-destructive">{msg}</p>}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[[docs.length, "Documents"], [readyCount, "Ready"], [`${totalMb} MB`, "Total size"]].map(([v, l]) => (
          <div key={l} className="card-surface p-5">
            <p className="font-display text-4xl">{v}</p>
            <p className="text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your uploads</p>
      <div className="card-surface divide-y overflow-hidden">
        {loadErr && <p className="px-5 py-4 text-sm text-destructive">{loadErr}</p>}
        {!loadErr && docs.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">No uploads yet. Choose a PDF to get started.</p>}
        {docs.map((f) => (
          <div key={f.id} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50 fade-up">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-high-soft"><FileText className="h-4 w-4 text-high" /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{f.filename}</p>
              <p className="text-xs text-muted-foreground">
                PDF{f.size_bytes ? ` · ${(f.size_bytes / 1024 / 1024).toFixed(1)} MB` : ""} · {new Date(f.created_at).toLocaleString()}
              </p>
            </div>
            <StatusBadge s={f.status} />
            <button onClick={() => remove(f)} disabled={f.status === "uploading"} aria-label={`Delete ${f.filename}`} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-destructive disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
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
