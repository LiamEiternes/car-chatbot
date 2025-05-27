import { kv } from "@vercel/kv";

export const runtime = "edge";

export default async function () {
  const url = "https://cache.api.finn.no/iad/search/car-norway?orgId=YOUR_ORG";
  const res = await fetch(url, { headers: { "x-finn-apikey": process.env.FINN_KEY! } });
  const data = await res.json();
  await kv.set("inventory", data.docs, { ex: 300 });
  return new Response("ok");
}