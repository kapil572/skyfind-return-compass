import { useState, type ReactNode } from "react";
import { CATEGORIES, LOCATIONS } from "@/lib/matching";
import { Field, inputCls } from "./sky";

export interface ItemFields { category: string; colour: string; description: string; location: string; time: string }
const empty = (): ItemFields => ({ category: CATEGORIES[0]!, colour: "", description: "", location: LOCATIONS[0]!, time: new Date().toISOString().slice(0, 16) });

export function ItemForm({ extra, submit, onSubmit }: { extra: ReactNode; submit: string; onSubmit: (f: ItemFields) => void }) {
  const [f, setF] = useState(empty);
  const set = (k: keyof ItemFields) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(f); setF(empty()); }}>
      {extra}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Item type"><select className={inputCls} value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Colour"><input required className={inputCls} value={f.colour} onChange={set("colour")} placeholder="Black" /></Field>
      </div>
      <Field label="Description"><textarea required rows={3} className={inputCls} value={f.description} onChange={set("description")} placeholder="Brand, marks, contents…" /></Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Location"><select className={inputCls} value={f.location} onChange={set("location")}>{LOCATIONS.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Date & time"><input type="datetime-local" required className={inputCls} value={f.time} onChange={set("time")} /></Field>
      </div>
      <button className="btn btn-primary w-full justify-center">{submit}</button>
    </form>
  );
}
