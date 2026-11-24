import { createServerFn } from "@tanstack/react-start";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

export interface ClaimSummaryInput {
  claimId: string; passenger: string; lost: string; found: string; score: number;
  idChecked: boolean; detailsChecked: boolean; notes: string; staff: string;
}

const clip = (s: unknown, n = 600) => String(s ?? "").slice(0, n);

export const summarizeClaim = createServerFn({ method: "POST" })
  .inputValidator((d: ClaimSummaryInput) => ({
    claimId: clip(d.claimId, 20), passenger: clip(d.passenger, 200), lost: clip(d.lost), found: clip(d.found),
    score: Number(d.score) || 0, idChecked: !!d.idChecked, detailsChecked: !!d.detailsChecked,
    notes: clip(d.notes, 400), staff: clip(d.staff, 100),
  }))
  .handler(async ({ data }) => {
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: "You help airport lost-and-found staff review ownership claims. Write a concise summary (max 5 short bullet points, plain text starting with '• '): what was lost vs found, how well they match, which verification checks are done or missing, and a cautious recommendation. Never invent facts.",
        input: `Claim ${data.claimId}
Claimant: ${data.passenger}
Lost report: ${data.lost}
Found item: ${data.found}
Match score: ${data.score}/100
Photo ID checked: ${data.idChecked ? "yes" : "no"}
Hidden details confirmed: ${data.detailsChecked ? "yes" : "no"}
Verified by: ${data.staff || "not set"}
Staff notes: ${data.notes || "none"}`,
      });
      const text = res.output
        .flatMap((o) => (o.type === "message" ? o.content : []))
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("").trim();
      return { summary: text || null, error: text ? null : "The AI returned no summary." };
    } catch (e) {
      if (e instanceof GatewayError) {
        console.error("claim summary failed", e.code, e.ids);
        if (e.httpStatus === 429) return { summary: null, error: "Too many requests — try again shortly." };
        if (e.httpStatus === 402) return { summary: null, error: "AI credits have run out." };
        return { summary: null, error: "The AI summary could not be generated." };
      }
      throw e;
    }
  });
