import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Home, FolderOpen, Target, MessageCircle } from "lucide-react";
import { EvidenceProvider } from "@/components/nexus/Evidence";

export const Route = createFileRoute("/_shell")({ component: Shell });

const nav = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/vault", label: "Knowledge Vault", icon: FolderOpen },
  { to: "/matters", label: "What Matters", icon: Target },
  { to: "/ask", label: "Ask NEXUS", icon: MessageCircle },
] as const;

function Shell() {
  return (
    <EvidenceProvider>
      <div className="flex min-h-screen w-full">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card/60 p-4 md:flex">
          <Link to="/" className="mb-8 flex items-center gap-2 px-2 pt-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-xs font-bold text-background">N</span>
            <span className="text-sm font-bold tracking-[0.2em]">NEXUS</span>
          </Link>
          <nav className="space-y-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border bg-background p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Operating Systems</p>
            9 documents · 247 pages
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <nav className="flex gap-1 overflow-x-auto border-b bg-card/60 p-2 md:hidden">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground">
                {n.label}
              </Link>
            ))}
          </nav>
          <main className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
            <Outlet />
          </main>
        </div>
      </div>
    </EvidenceProvider>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 fade-up">
      <div>
        <h1 className="font-display text-5xl tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
