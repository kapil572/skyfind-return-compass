import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/sky";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — SkyAssist" }, { name: "description", content: "About SkyAssist: modules, matching rules and data entities." }, { property: "og:title", content: "About — SkyAssist" }, { property: "og:description", content: "About SkyAssist: modules, matching rules and data entities." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: About,
});

const MODULES = [
  ["Passenger Registration", "Register users and their contact details."],
  ["Lost Item Reporting", "Enter item type, colour, description, location and time."],
  ["Found Item Registration", "Airport staff record recovered belongings."],
  ["Item Matching", "Match lost and found reports using category, colour, location and description."],
  ["Claim Verification", "Staff verify ownership before returning an item."],
  ["Status Tracking", "Track reports from Lost → Matched → Under Verification → Returned."],
  ["Reports Dashboard", "Show successful matches, pending claims and unclaimed items."],
];
const WHY = [
  "More specialised than a general airport management system.",
  "Matching uses simple scoring rules rather than complex AI.",
  "Clear data entities: Passenger, LostItem, FoundItem, MatchRecord and Claim.",
  "Supports UML diagrams and report sections.",
  "Demonstrated with sample airport data — no real airport connection needed.",
];
const RULES = [["Same category", 40], ["Same colour", 25], ["Same location", 15], ["Shared description words", 20]] as const;

function About() {
  return (
    <>
      <PageHeader code="06 · ABOUT" title="About SkyAssist" sub="An airport lost-and-found item matching system. Its key feature is the item-matching and ownership-verification workflow, not just recording lost property." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Main modules">
          <ol className="space-y-3">
            {MODULES.map(([t, d], i) => (
              <li key={t} className="flex gap-3"><span className="sign-chip h-fit">{String(i + 1).padStart(2, "0")}</span><div><div className="font-medium">{t}</div><p className="text-sm text-muted-foreground">{d}</p></div></li>
            ))}
          </ol>
        </Panel>
        <div className="space-y-6">
          <Panel title="How matching works">
            <p className="mb-3 text-sm text-muted-foreground">Each lost/found pair gets a score out of 100. Pairs scoring 60 or more are suggested to staff.</p>
            {RULES.map(([r, p]) => (
              <div key={r} className="flex justify-between border-b border-border py-2 text-sm last:border-0"><span>{r}</span><b className="font-display text-xl">+{p}</b></div>
            ))}
          </Panel>
          <Panel title="Why this project">
            <ul className="list-disc space-y-1 pl-5 text-sm">{WHY.map((w) => <li key={w}>{w}</li>)}</ul>
          </Panel>
          <Panel title="Technology">
            <p className="text-sm text-muted-foreground">Suggested for the academic version: Java + MySQL, or Python Flask + MySQL. This web demo runs in the browser with sample data.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
