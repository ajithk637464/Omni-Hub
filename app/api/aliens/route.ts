import { connection } from "next/server";

const aliensApiUrl =
  process.env.ALIENS_API_URL ?? "http://localhost:5000/aliens";

export async function GET() {
  await connection();

  try {
    const response = await fetch(aliensApiUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { error: `The aliens backend returned ${response.status}.` },
        { status: 502 },
      );
    }

    const aliens: unknown = await response.json();
    return Response.json(aliens);
  } catch (error) {
    console.error("Unable to fetch the alien roster from the backend.", error);

    return Response.json(
      { error: "The aliens backend is unavailable." },
      { status: 502 },
    );
  }
}
