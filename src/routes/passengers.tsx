import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDB, update, uid } from "@/lib/store";
import { PageHeader, Panel, Field, inputCls, Empty } from "@/components/sky";

export const Route = createFileRoute("/passengers")({
  head: () => ({ meta: [{ title: "Passengers — SkyAssist" }, { name: "description", content: "Register passengers and their contact details." }, { property: "og:title", content: "Passengers — SkyAssist" }, { property: "og:description", content: "Register passengers and their contact details." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Passengers,
});

function Passengers() {
  const db = useDB();
  const [f, setF] = useState({ name: "", email: "", phone: "", flight: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <PageHeader code="01 · PASSENGERS" title="Passenger registration" sub="Register travellers so they can report lost belongings and be contacted." />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel title="New passenger">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((d) => ({ ...d, passengers: [{ id: uid("P"), ...f }, ...d.passengers] })); setF({ name: "", email: "", phone: "", flight: "" }); }}>
            <Field label="Full name"><input required className={inputCls} value={f.name} onChange={set("name")} /></Field>
            <Field label="Email"><input required type="email" className={inputCls} value={f.email} onChange={set("email")} /></Field>
            <Field label="Phone"><input required className={inputCls} value={f.phone} onChange={set("phone")} /></Field>
            <Field label="Flight no."><input className={inputCls} value={f.flight} onChange={set("flight")} placeholder="AI 504" /></Field>
            <button className="btn btn-primary w-full justify-center">Register passenger</button>
          </form>
        </Panel>
        <Panel title={`Registered (${db.passengers.length})`}>
          {db.passengers.length === 0 ? <Empty>No passengers yet.</Empty> : (
            <ul className="divide-y divide-border">
              {db.passengers.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div><div className="font-medium">{p.name}</div><div className="text-sm text-muted-foreground">{p.email} · {p.phone}</div></div>
                  <span className="font-mono text-xs text-muted-foreground">{p.flight || "—"} · {p.id}</span>
                </li>
              ))}
            </ul>)}
        </Panel>
      </div>
    </>
  );
}
