import sgMail from "@sendgrid/mail";
export const runtime = "edge";
sgMail.setApiKey(process.env.SENDGRID_KEY!);

export async function sendLead(payload: any) {
  const txt = `Bil: ${payload.vehicle}\nHeftelser: ${payload.liens.length ?
    "JA" : "Ingen"}\nChecklist: ${JSON.stringify(payload.checklist,null,2)}`;

  // 1. SendGrid email
  await sgMail.send({
    to: "sales@dealer.no",
    from: "noreply@dealer.no",
    subject: `🚗 Ny forespørsel – ${payload.vehicle}`,
    text: txt,
    attachments: [
      { filename:"details.json",
        content: Buffer.from(JSON.stringify(payload)).toString("base64"),
        type:"application/json", disposition:"attachment" }
    ]
  });                                     // SendGrid “/v3/mail/send” pattern :contentReference[oaicite:14]{index=14}

  // 2. Discord webhook
  await fetch(process.env.DISCORD_URL!, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ content:`**Ny kundehenvendelse**\n${txt}` })
  });                                      // Discord docs :contentReference[oaicite:15]{index=15}
}
