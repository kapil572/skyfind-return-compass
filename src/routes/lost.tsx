import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDB, update, uid } from "@/lib/store";
import { PageHeader, Panel, Field, inputCls, Empty, StatusBadge, Steps, fmt } from "@/components/sky";
import { ItemForm } from "@/components/ItemForm";

export const Route = createFileRoute("/lost")({
  head: () => ({ meta: [{ title: "Lost reports — SkyAssist" }, { name: "description", content: "Passengers report lost items with type, colour, description, location and time." }, { property: "og:title", content: "Lost reports — SkyAssist" }, { property: "og:description", content: "Passengers report lost items with type, colour, description, location and time." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Lost,
});

function Lost() {
  const db = useDB();
  const [pid, setPid] = useState("");
  return (
    <>
      <PageHeader code="02 · LOST" title="Lost item reporting" sub="Record what the passenger lost, where and when. Reports start in the Lost status." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="New report">
          {db.passengers.length === 0 ? <Empty>Register a passenger first.</Empty> : (
            <ItemForm submit="File lost report"
              extra={<Field label="Passenger"><select required className={inputCls} value={pid} onChange={(e) => setPid(e.target.value)}><option value="">Select…</option>{db.passengers.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}</select></Field>}
              onSubmit={(f) => { if (!pid) return; update((d) => ({ ...d, lost: [{ id: uid("L"), passengerId: pid, status: "Lost", ...f }, ...d.lost] })); }} />)}
        </Panel>
        <Panel title={`Reports (${db.lost.length})`}>
          {db.lost.length === 0 ? <Empty>No lost reports.</Empty> : (
            <ul className="space-y-3">
              {db.lost.map((l) => (
                <li key={l.id} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div><div className="font-medium">{l.colour} {l.category} <span className="font-mono text-xs text-muted-foreground">{l.id}</span></div>
                      <p className="text-sm text-muted-foreground">{l.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{l.location} · {fmt(l.time)} · {db.passengers.find((p) => p.id === l.passengerId)?.name}</p></div>
                    <StatusBadge s={l.status} />
                  </div>
                  <div className="mt-3"><Steps s={l.status} /></div>
                </li>
              ))}
            </ul>)}
        </Panel>
      </div>
    </>
  );
}
