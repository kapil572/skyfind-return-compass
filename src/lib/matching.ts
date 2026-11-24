export type Status = "Lost" | "Matched" | "Under Verification" | "Returned";
export interface Passenger { id: string; name: string; email: string; phone: string; flight: string }
export interface LostItem { id: string; passengerId: string; category: string; colour: string; description: string; location: string; time: string; status: Status }
export interface FoundItem { id: string; staff: string; category: string; colour: string; description: string; location: string; time: string; claimed: boolean }
export interface MatchRecord { id: string; lostId: string; foundId: string; score: number; createdAt: string }
export interface Claim { id: string; matchId: string; idChecked: boolean; detailsChecked: boolean; notes: string; decision: "Pending" | "Approved" | "Rejected"; staff: string; updatedAt: string }

const STOP = new Set(["a","an","the","with","and","of","in","on","my","is","it","has","to","for"]);
export const words = (s: string) =>
  new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));

/** Rule-based score out of 100: category 40, colour 25, location 15, description overlap 20. */
export function scoreMatch(l: Pick<LostItem,"category"|"colour"|"location"|"description">, f: Pick<FoundItem,"category"|"colour"|"location"|"description">) {
  let s = 0;
  if (l.category.toLowerCase() === f.category.toLowerCase()) s += 40;
  if (l.colour.trim().toLowerCase() === f.colour.trim().toLowerCase()) s += 25;
  if (l.location.toLowerCase() === f.location.toLowerCase()) s += 15;
  const a = words(l.description), b = words(f.description);
  if (a.size && b.size) {
    const common = [...a].filter((w) => b.has(w)).length;
    s += Math.round((common / Math.min(a.size, b.size)) * 20);
  }
  return Math.min(100, s);
}
export const MATCH_THRESHOLD = 60;
export const CATEGORIES = ["Bag","Electronics","Documents","Wallet","Jewellery","Clothing","Toy","Other"];
export const LOCATIONS = ["Terminal 1","Terminal 2","Security Check","Gate A","Gate B","Baggage Claim","Food Court","Lounge"];
