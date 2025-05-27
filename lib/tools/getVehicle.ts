export async function getVehicle(plate: string) {
    const res = await fetch(
      `https://nvdbapiles-v3.atlas.vegvesen.no/kjoretoyopplysninger/${plate}`,
      { headers: { "SVV-Authorization": `Apikey ${process.env.VEGVESEN_KEY}` } }
    );
    if (!res.ok) throw new Error("Vegvesen "+res.status);
    return await res.json();      // JSON: model, weight, EU-expiry, etc.
  }
  