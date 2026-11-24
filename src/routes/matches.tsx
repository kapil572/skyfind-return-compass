import { createFileRoute, Link } from "@tanstack/react-router";
import { useDB, update, uid } from "@/lib/store";
import { scoreMatch, MATCH_THRESHOLD } from "@/lib/matching";
import { PageHeader, Panel, Empty, StatusBadge } from "@/components/sky";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Matching — SkyAssist" }, { name: "description", content: "Match lost and found reports by category, colour, location and description." }, { property: "og:title", content: "Matching — SkyAssist" }, { property: "og:description", content: "Match lost and found reports by category, colour, location and description." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Matches,
});

function Matches() {
  const db = useDB();
  const usedFound = new Set(db.matches.map((m) => m.foundId));
  const open = db.lost.filter((l) => l.status === "Lost");
  const confirm = (lostId: string, foundId: string, score: number) => update((d) => {
    const m = { id: uid("M"), lostId, foundId, score, createdAt: new Date().toISOString() };
    return { ...d, matches: [m, ...d.matches], lost: d.lost.map((l) => l.id === lostId ? { ...l, status: "Matched" as const } : l) };
  });
  const verify = (matchId: string, lostId: string) => update((d) => ({
    ...d,
    claims: [{ id: uid("C"), matchId, idChecked: false, detailsChecked: false, notes: "", decision: "Pending" as const, staff: "", updatedAt: new Date().toISOString() }, ...d.claims],
    lost: d.lost.map((l) => l.id === lostId ? { ...l, status: "Under Verification" as const } : l),
  }));
  return (
    <>
      <PageHeader code="04 · MATCHING" title="Item matching" sub={`Rule-based score out of 100: category 40, colour 25, location 15, description words 20. Suggestions shown at ${MATCH_THRESHOLD}+.`} />
      <div className="space-y-6">
        <Panel title={`Open lost reports (${open.length})`}>
          {open.length === 0 ? <Empty>No reports waiting for a match.</Empty> : (
            <div className="space-y-4">
              {open.map((l) => {
                const cands = db.found.filter((f) => !f.claimed && !usedFound.has(f.id))
                  .map((f) => ({ f, score: scoreMatch(l, f) })).filter((c) => c.score >= MATCH_THRESHOLD).sort((a, b) => b.score - a.score);
                return (
                  <div key={l.id} className="rounded-md border border-border p-3">
                    <div className="font-medium">{l.colour} {l.category} <span className="font-mono text-xs text-muted-foreground">{l.id}</span></div>
                    <p className="mb-3 text-sm text-muted-foreground">{l.description} · {l.location}</p>
                    {cands.length === 0 ? <p className="text-sm text-muted-foreground">No likely matches yet.</p> : cands.map(({ f, score }) => (
                      <div key={f.id} className="mb-2 flex flex-wrap items-center gap-3 rounded bg-muted p-2">
                        <div className="w-16 text-center"><div className="font-display text-2xl">{score}</div><div className="text-[10px] uppercase text-muted-foreground">score</div></div>
                        <div className="min-w-0 flex-1 text-sm"><span className="font-mono text-xs">{f.id}</span> {f.colour} {f.category} — {f.description} <span className="text-muted-foreground">({f.location})</span></div>
                        <button className="btn btn-primary" onClick={() => confirm(l.id, f.id, score)}>Confirm match</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>)}
        </Panel>
        <Panel title={`Match records (${db.matches.length})`}>
          {db.matches.length === 0 ? <Empty>No matches confirmed yet.</Empty> : (
            <ul className="divide-y divide-border">
              {db.matches.map((m) => {
                const l = db.lost.find((x) => x.id === m.lostId);
                if (!l) return null;
                return (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="text-sm"><span className="font-mono text-xs">{m.id}</span> · {l.id} ↔ {m.foundId} · score <b>{m.score}</b></div>
                    <div className="flex items-center gap-2"><StatusBadge s={l.status} />
                      {l.status === "Matched" ? <button className="btn btn-dark" onClick={() => verify(m.id, l.id)}>Start verification</button>
                        : l.status === "Under Verification" ? <Link to="/claims" className="btn btn-ghost">Open claim</Link> : null}
                    </div>
                  </li>
                );
              })}
            </ul>)}
        </Panel>
      </div>
    </>
  );
}
