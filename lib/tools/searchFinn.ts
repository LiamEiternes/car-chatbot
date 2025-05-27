import { kv } from "@vercel/kv";
export async function searchFinnInventory(query: string) {
  // simple “contains” search in pre-synced cache
  const ads = (await kv.get<any[]>("inventory")) ?? [];
  return ads.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
}
