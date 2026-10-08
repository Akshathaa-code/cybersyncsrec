import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
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
