import { describe, it, expect } from "vitest";
import { scoreMatch } from "./matching";
const base = { category: "Bag", colour: "Black", location: "Gate A", description: "leather backpack red tag" };
describe("scoreMatch", () => {
  it("gives 100 for identical reports", () => expect(scoreMatch(base, base)).toBe(100));
  it("gives 40 for category only", () => expect(scoreMatch(base, { category: "Bag", colour: "Blue", location: "Lounge", description: "zzz" })).toBe(40));
  it("gives 0 when nothing matches", () => expect(scoreMatch(base, { category: "Toy", colour: "Pink", location: "Lounge", description: "zzz" })).toBe(0));
});
