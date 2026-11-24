import type { ReactNode } from "react";
import type { Status } from "@/lib/matching";

export function PageHeader({ code, title, sub }: { code: string; title: string; sub: string }) {
  return (
    <div className="mb-8 border-b border-border pb-6">
      <div className="sign-chip mb-3">{code}</div>
      <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{sub}</p>
    </div>
  );
}
export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="panel">
      {title && <h2 className="mb-4 font-display text-xl uppercase tracking-wider">{title}</h2>}
      {children}
    </section>
  );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm"><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
export const inputCls = "field-input";
export const STEPS: Status[] = ["Lost", "Matched", "Under Verification", "Returned"];
export function StatusBadge({ s }: { s: Status }) {
  const v = { Lost: "status-lost", Matched: "status-matched", "Under Verification": "status-verify", Returned: "status-returned" }[s];
  return <span className={`status-badge ${v}`}>{s}</span>;
}
export function Steps({ s }: { s: Status }) {
  const i = STEPS.indexOf(s);
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((st, k) => <div key={st} title={st} className={`h-1.5 flex-1 rounded-full ${k <= i ? "bg-primary" : "bg-muted"}`} />)}
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{children}</p>;
}
export const fmt = (t: string) => new Date(t).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
