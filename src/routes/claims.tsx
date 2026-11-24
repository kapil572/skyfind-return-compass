import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useDB, update } from "@/lib/store";
import { summarizeClaim } from "@/lib/claim-summary.functions";
import type { Claim } from "@/lib/matching";
import { PageHeader, Panel, Empty, Field, inputCls } from "@/components/sky";

export const Route = createFileRoute("/claims")({
  head: () => ({ meta: [{ title: "Claims — SkyAssist" }, { name: "description", content: "Staff verify ownership before returning an item." }, { property: "og:title", content: "Claims — SkyAssist" }, { property: "og:description", content: "Staff verify ownership before returning an item." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Claims,
});

function Claims() {
  const db = useDB();
  const summarize = useServerFn(summarizeClaim);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<Record<string, string>>({});
  const patch = (id: string, p: Partial<Claim>) => update((d) => ({ ...d, claims: d.claims.map((c) => c.id === id ? { ...c, ...p, updatedAt: new Date().toISOString() } : c) }));
  const decide = (c: Claim, ok: boolean) => update((d) => {
    const m = d.matches.find((x) => x.id === c.matchId)!;
    return {
      ...d,
      claims: d.claims.map((x) => x.id === c.id ? { ...x, decision: ok ? "Approved" as const : "Rejected" as const } : x),
      matches: ok ? d.matches : d.matches.filter((x) => x.id !== m.id),
      lost: d.lost.map((l) => l.id === m.lostId ? { ...l, status: ok ? "Returned" as const : "Lost" as const } : l),
      found: d.found.map((f) => f.id === m.foundId && ok ? { ...f, claimed: true } : f),
    };
  });
  return (
    <>
      <PageHeader code="05 · CLAIMS" title="Claim verification" sub="Check the passenger's ID and item details before handing anything back. Rejected claims send the report back to Lost." />
      {db.claims.length === 0 ? <Empty>No claims yet — confirm a match and start verification.</Empty> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {db.claims.map((c) => {
            const m = db.matches.find((x) => x.id === c.matchId);
            const l = db.lost.find((x) => x.id === m?.lostId);
            const f = db.found.find((x) => x.id === m?.foundId);
            const p = db.passengers.find((x) => x.id === l?.passengerId);
            const pending = c.decision === "Pending";
            return (
              <Panel key={c.id}>
                <div className="mb-3 flex items-center justify-between"><span className="font-mono text-xs">{c.id}</span>
                  <span className={`status-badge ${c.decision === "Approved" ? "status-returned" : c.decision === "Rejected" ? "status-lost" : "status-verify"}`}>{c.decision}</span></div>
                {l && f ? (
                  <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                    <div><div className="text-xs uppercase text-muted-foreground">Claimant</div><b>{p?.name}</b><div className="text-muted-foreground">{p?.phone}</div><div className="mt-1">{l.description}</div></div>
                    <div><div className="text-xs uppercase text-muted-foreground">Found item {f.id}</div><b>{f.colour} {f.category}</b><div className="mt-1">{f.description}</div></div>
                  </div>) : <p className="mb-3 text-sm text-muted-foreground">Match no longer exists.</p>}
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" disabled={!pending} checked={c.idChecked} onChange={(e) => patch(c.id, { idChecked: e.target.checked })} /> Photo ID matches passenger</label>
                  <label className="flex items-center gap-2"><input type="checkbox" disabled={!pending} checked={c.detailsChecked} onChange={(e) => patch(c.id, { detailsChecked: e.target.checked })} /> Passenger described hidden details correctly</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Verified by"><input disabled={!pending} className={inputCls} value={c.staff} onChange={(e) => patch(c.id, { staff: e.target.value })} /></Field>
                    <Field label="Notes"><input disabled={!pending} className={inputCls} value={c.notes} onChange={(e) => patch(c.id, { notes: e.target.value })} /></Field>
                  </div>
                </div>
                {l && f && m && (
                  <div className="mt-4 rounded-md border border-border bg-muted p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI summary</span>
                      <button className="btn btn-ghost disabled:opacity-50" disabled={busy === c.id} onClick={async () => {
                        setBusy(c.id); setErr((e) => ({ ...e, [c.id]: "" }));
                        try {
                          const r = await summarize({ data: { claimId: c.id, passenger: `${p?.name ?? "Unknown"} (${p?.phone ?? ""})`, lost: `${l.colour} ${l.category} — ${l.description} at ${l.location}, ${l.time}`, found: `${f.colour} ${f.category} — ${f.description} at ${f.location}, ${f.time}`, score: m.score, idChecked: c.idChecked, detailsChecked: c.detailsChecked, notes: c.notes, staff: c.staff } });
                          if (r.summary) patch(c.id, { aiSummary: r.summary, aiSummaryAt: new Date().toISOString() });
                          else setErr((e) => ({ ...e, [c.id]: r.error ?? "Failed." }));
                        } catch { setErr((e) => ({ ...e, [c.id]: "The AI summary could not be generated." })); }
                        finally { setBusy(null); }
                      }}>{busy === c.id ? "Summarising…" : c.aiSummary ? "Refresh" : "Generate summary"}</button>
                    </div>
                    {c.aiSummary ? <p className="whitespace-pre-line text-sm">{c.aiSummary}</p> : <p className="text-sm text-muted-foreground">No summary yet.</p>}
                    {err[c.id] && <p className="mt-2 text-sm text-destructive">{err[c.id]}</p>}
                    <p className="mt-2 text-[11px] text-muted-foreground">AI-generated — staff must still verify ownership in person.</p>
                  </div>)}
                {pending && m && (
                  <div className="mt-4 flex gap-2">
                    <button className="btn btn-primary disabled:opacity-40" disabled={!c.idChecked || !c.detailsChecked || !c.staff} onClick={() => decide(c, true)}>Approve &amp; return</button>
                    <button className="btn btn-danger" onClick={() => decide(c, false)}>Reject</button>
                  </div>)}
              </Panel>
            );
          })}
        </div>)}
    </>
  );
}
