import { useSyncExternalStore } from "react";
import type { Passenger, LostItem, FoundItem, MatchRecord, Claim } from "./matching";

export interface DB { passengers: Passenger[]; lost: LostItem[]; found: FoundItem[]; matches: MatchRecord[]; claims: Claim[] }
const KEY = "skyassist-db-v1";
const seed: DB = {
  passengers: [
    { id: "P1", name: "Ananya Rao", email: "ananya@mail.com", phone: "+91 98450 11122", flight: "AI 504" },
    { id: "P2", name: "James Carter", email: "jcarter@mail.com", phone: "+44 7700 900123", flight: "BA 118" },
    { id: "P3", name: "Mei Lin", email: "mei.lin@mail.com", phone: "+65 8123 4567", flight: "SQ 423" },
  ],
  lost: [
    { id: "L1", passengerId: "P1", category: "Bag", colour: "Black", description: "Black leather backpack with laptop sleeve and red tag", location: "Security Check", time: "2026-11-23T09:30", status: "Lost" },
    { id: "L2", passengerId: "P2", category: "Electronics", colour: "Silver", description: "Silver iPhone with cracked screen protector", location: "Gate A", time: "2026-11-23T14:10", status: "Lost" },
    { id: "L3", passengerId: "P3", category: "Documents", colour: "Blue", description: "Blue passport cover with boarding pass inside", location: "Lounge", time: "2026-11-24T07:45", status: "Lost" },
  ],
  found: [
    { id: "F1", staff: "Officer Singh", category: "Bag", colour: "Black", description: "Leather backpack, laptop sleeve, red luggage tag", location: "Security Check", time: "2026-11-23T10:05", claimed: false },
    { id: "F2", staff: "Officer Diaz", category: "Electronics", colour: "Silver", description: "iPhone, screen protector cracked", location: "Gate A", time: "2026-11-23T15:00", claimed: false },
    { id: "F3", staff: "Officer Patel", category: "Clothing", colour: "Grey", description: "Grey wool scarf", location: "Food Court", time: "2026-11-22T18:20", claimed: false },
  ],
  matches: [], claims: [],
};
let db: DB = seed; let loaded = false;
const subs = new Set<() => void>();
function load() { if (loaded || typeof window === "undefined") return; loaded = true; try { const r = localStorage.getItem(KEY); if (r) db = JSON.parse(r); } catch {} }
export function update(fn: (d: DB) => DB) { load(); db = fn(db); localStorage.setItem(KEY, JSON.stringify(db)); subs.forEach((s) => s()); }
export function resetDemo() { update(() => seed); }
export function useDB() {
  return useSyncExternalStore((cb) => { subs.add(cb); load(); cb(); return () => subs.delete(cb); }, () => db, () => seed);
}
export const uid = (p: string) => p + Math.random().toString(36).slice(2, 7).toUpperCase();
