import { kv } from "@vercel/kv";
import * as cheerio from "cheerio";

export async function checkLiensScrape(plate: string) {
  const cached = await kv.get<{ liens:any[] }>(`liens:${plate}`);
  if (cached) return cached;

  const url = `https://rettsstiftelser.brreg.no/nb/oppslag?type=motorvogn&register=losore&query=${plate}`;
  const html = await fetch(url, {
    headers: { "User-Agent": "dealer-ai/1.0 (contact@dealer.no)" }
  }).then(r => r.text());

  const $ = cheerio.load(html);          // Cheerio load API :contentReference[oaicite:10]{index=10}
  const liens = $("table tbody tr").map((_, row) => ({
      id:   $(row).find("td").eq(0).text().trim(),
      date: $(row).find("td").eq(1).text().trim(),
      party:$(row).find("td").eq(2).text().trim()
  })).get();

  const result = liens.length ? { liens } : { liens: [] };
  await kv.set(`liens:${plate}`, result, { ex: 1800 }); // cache 30 min
  return result;
}
