import { Stream } from "openai/stream";
import { getVehicle } from "@/lib/tools/getVehicle";
import { checkLiensScrape } from "@/lib/tools/checkLiensScrape";
import { searchFinnInventory } from "@/lib/tools/searchFinn";
import { sendLead } from "./lead-utils";        // see §6

export const runtime = "edge";

const tools = [
  {
    name: "getVehicle",
    description: "Fetch tech data from Statens vegvesen",
    parameters: { type: "object", properties: { plate:{type:"string"}}, required:["plate"] }
  },
  {
    name: "checkLiens",
    description: "Scrape Brønnøysund lien page",
    parameters: { type:"object", properties:{plate:{type:"string"}}, required:["plate"] }
  },
  {
    name: "searchFinnInventory",
    description: "Search local FINN cache",
    parameters: { type:"object", properties:{query:{type:"string"}}, required:["query"] }
  },
  {
    name: "runChecklist",
    description: "Return next unanswered checklist item",
    parameters: { type:"object", properties:{state:{type:"object"}}, required:["state"] }
  }
];

export default async function (req: Request) {
  const { messages } = await req.json();

  const stream = new Stream({
    model: "gpt-4o-mini",
    tools,
    async onCall({ name, args }) {
      switch (name) {
        case "getVehicle":       return getVehicle(args.plate);
        case "checkLiens":       return checkLiensScrape(args.plate);
        case "searchFinnInventory": return searchFinnInventory(args.query);
        case "runChecklist":     return runChecklist(args.state);
      }
    },
    async onComplete(history) {
      if (history.some(m => m.role==="assistant" && m.content==="__CHECKLIST_DONE__")) {
        await sendLead(history);   // §6
      }
    }
  });

  return new Response(stream, { headers:{ "Content-Type":"text/event-stream" }});
}
