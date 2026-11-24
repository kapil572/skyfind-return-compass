import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDB, update, uid } from "@/lib/store";
import { PageHeader, Panel, Field, inputCls, Empty, fmt } from "@/components/sky";
import { ItemForm } from "@/components/ItemForm";

export const Route = createFileRoute("/found")({
  head: () => ({ meta: [{ title: "Found items — SkyAssist" }, { name: "description", content: "Airport staff record recovered belongings." }, { property: "og:title", content: "Found items — SkyAssist" }, { property: "og:description", content: "Airport staff record recovered belongings." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Found,
});

function Found() {
  const db = useDB();
  const [staff, setStaff] = useState("");
  return (
    <>
      <PageHeader code="03 · FOUND" title="Found item registration" sub="Staff log every recovered belonging so it can be matched against passenger reports." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="Log recovered item">
          <ItemForm submit="Register found item"
            extra={<Field label="Recorded by (staff)"><input required className={inputCls} value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="Officer name" /></Field>}
            onSubmit={(f) => update((d) => ({ ...d, found: [{ id: uid("F"), staff, claimed: false, ...f }, ...d.found] }))} />
        </Panel>
        <Panel title={`Inventory (${db.found.length})`}>
          {db.found.length === 0 ? <Empty>No found items.</Empty> : (
            <ul className="space-y-3">
              {db.found.map((f) => (
                <li key={f.id} className="flex items-start justify-between gap-2 rounded-md border border-border p-3">
                  <div><div className="font-medium">{f.colour} {f.category} <span className="font-mono text-xs text-muted-foreground">{f.id}</span></div>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.location} · {fmt(f.time)} · {f.staff}</p></div>
                  <span className={`status-badge ${f.claimed ? "status-returned" : "status-lost"}`}>{f.claimed ? "Returned" : "Unclaimed"}</span>
                </li>
              ))}
            </ul>)}
        </Panel>
      </div>
    </>
  );
}
