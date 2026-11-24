import { createFileRoute, Link } from "@tanstack/react-router";
import { useDB, resetDemo } from "@/lib/store";
import { PageHeader, Panel, StatusBadge, Steps, Empty, STEPS } from "@/components/sky";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — SkyAssist" }, { name: "description", content: "Overview of matches, pending claims and unclaimed items at the airport." }, { property: "og:title", content: "Dashboard — SkyAssist" }, { property: "og:description", content: "Overview of matches, pending claims and unclaimed items at the airport." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Dashboard,
});

function Dashboard() {
  const db = useDB();
  const returned = db.lost.filter((l) => l.status === "Returned").length;
  const stats = [
    ["Successful matches", db.matches.length],
    ["Pending claims", db.claims.filter((c) => c.decision === "Pending").length],
    ["Unclaimed found items", db.found.filter((f) => !f.claimed).length],
    ["Items returned", returned],
  ] as const;
  return (
    <>
      <PageHeader code="00 · DASHBOARD" title="Reports dashboard" sub="Live view of every lost report, match and claim at the lost-and-found desk." />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="panel"><div className="font-display text-5xl">{v}</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</div></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><Panel title="Status tracking">
          {db.lost.length === 0 ? <Empty>No lost reports yet.</Empty> : (
            <ul className="divide-y divide-border">
              {db.lost.map((l) => {
                const p = db.passengers.find((x) => x.id === l.passengerId);
                return (
                  <li key={l.id} className="py-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="min-w-0"><span className="font-mono text-xs text-muted-foreground">{l.id}</span> <span className="font-medium">{l.colour} {l.category}</span> <span className="text-sm text-muted-foreground">· {p?.name}</span></div>
                      <StatusBadge s={l.status} />
                    </div>
                    <Steps s={l.status} />
                  </li>
                );
              })}
            </ul>)}
        </Panel></div>
        <Panel title="By status">
          {STEPS.map((s) => (
            <div key={s} className="flex items-center justify-between border-b border-border py-2 last:border-0"><StatusBadge s={s} /><span className="font-display text-2xl">{db.lost.filter((l) => l.status === s).length}</span></div>
          ))}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/matches" className="btn btn-primary">Run matching</Link>
            <button className="btn btn-ghost" onClick={() => confirm("Reset all data to the sample airport data?") && resetDemo()}>Reset demo data</button>
          </div>
        </Panel>
      </div>
    </>
  );
}
