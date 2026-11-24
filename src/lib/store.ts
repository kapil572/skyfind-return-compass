import { useSyncExternalStore } from "react";
import type { Passenger, LostItem, FoundItem, MatchRecord, Claim } from "./matching";

export interface DB { passengers: Passenger[]; lost: LostItem[]; found: FoundItem[]; matches: MatchRecord[]; claims: Claim[] }
const KEY = "skyassist-db-v2";
const seed: DB = {
  passengers: [
    { id: "P1", name: "Ananya Rao", email: "ananya@mail.com", phone: "+91 98450 11122", flight: "AI 504" },
    { id: "P2", name: "James Carter", email: "jcarter@mail.com", phone: "+44 7700 900123", flight: "BA 118" },
    { id: "P3", name: "Mei Lin", email: "mei.lin@mail.com", phone: "+65 8123 4567", flight: "SQ 423" },
    { id: "P4", name: "Rahul Mehta", email: "rahul.m@mail.com", phone: "+91 99001 23456", flight: "6E 211" },
    { id: "P5", name: "Sofia Rossi", email: "sofia.r@mail.com", phone: "+39 320 555 0199", flight: "EK 568" },
    { id: "P6", name: "David Kim", email: "dkim@mail.com", phone: "+82 10 2345 6789", flight: "KE 896" },
  ],
  lost: [
    { id: "L1", passengerId: "P1", category: "Bag", colour: "Black", description: "Black leather backpack with laptop sleeve and red tag", location: "Security Check", time: "2026-11-23T09:30", status: "Lost" },
    { id: "L2", passengerId: "P2", category: "Electronics", colour: "Silver", description: "Silver iPhone with cracked screen protector", location: "Gate A", time: "2026-11-23T14:10", status: "Lost" },
    { id: "L3", passengerId: "P3", category: "Documents", colour: "Blue", description: "Blue passport cover with boarding pass inside", location: "Lounge", time: "2026-11-24T07:45", status: "Lost" },
    { id: "L4", passengerId: "P4", category: "Wallet", colour: "Brown", description: "Brown leather wallet with driving licence and two cards", location: "Food Court", time: "2026-11-22T12:15", status: "Matched" },
    { id: "L5", passengerId: "P5", category: "Jewellery", colour: "Gold", description: "Gold bracelet with small heart charm", location: "Lounge", time: "2026-11-21T20:40", status: "Under Verification" },
    { id: "L6", passengerId: "P6", category: "Toy", colour: "White", description: "White plush bunny toy with blue ribbon", location: "Gate B", time: "2026-11-20T06:50", status: "Returned" },
  ],
  found: [
    { id: "F1", staff: "Officer Singh", category: "Bag", colour: "Black", description: "Leather backpack, laptop sleeve, red luggage tag", location: "Security Check", time: "2026-11-23T10:05", claimed: false },
    { id: "F2", staff: "Officer Diaz", category: "Electronics", colour: "Silver", description: "iPhone, screen protector cracked", location: "Gate A", time: "2026-11-23T15:00", claimed: false },
    { id: "F3", staff: "Officer Patel", category: "Clothing", colour: "Grey", description: "Grey wool scarf", location: "Food Court", time: "2026-11-22T18:20", claimed: false },
    { id: "F4", staff: "Officer Singh", category: "Wallet", colour: "Brown", description: "Brown leather wallet, licence and cards inside", location: "Food Court", time: "2026-11-22T13:00", claimed: false },
    { id: "F5", staff: "Officer Diaz", category: "Jewellery", colour: "Gold", description: "Gold bracelet with heart charm", location: "Lounge", time: "2026-11-21T22:10", claimed: false },
    { id: "F6", staff: "Officer Patel", category: "Toy", colour: "White", description: "Plush bunny toy with blue ribbon", location: "Gate B", time: "2026-11-20T08:00", claimed: true },
  ],
  matches: [
    { id: "M1", lostId: "L4", foundId: "F4", score: 98, createdAt: "2026-11-22T14:00" },
    { id: "M2", lostId: "L5", foundId: "F5", score: 100, createdAt: "2026-11-22T09:00" },
    { id: "M3", lostId: "L6", foundId: "F6", score: 100, createdAt: "2026-11-20T09:00" },
  ],
  claims: [
    { id: "C1", matchId: "M2", idChecked: true, detailsChecked: false, notes: "Passenger to describe engraving", decision: "Pending", staff: "Officer Diaz", updatedAt: "2026-11-22T09:30" },
    { id: "C2", matchId: "M3", idChecked: true, detailsChecked: true, notes: "Returned at desk T1", decision: "Approved", staff: "Officer Patel", updatedAt: "2026-11-20T10:00" },
  ],
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
