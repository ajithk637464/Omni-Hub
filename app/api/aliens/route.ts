import { connection } from "next/server";

const aliensApiUrl =
  process.env.ALIENS_API_URL ?? "http://localhost:5000/aliens";

type CreateAlienPayload = {
  AlienName: string;
  Species: string;
  HomePlanet: string;
  Description: string;
  EnergyConsumption: number;
  Strength: number;
  Speed: number;
  Intelligence: number;
  Accuracy: number;
  AlienLevel: number;
  Unlocked: boolean;
  IsActive: boolean;
  SortOrder: number;
  PowerList: { AlienPowerId: number; IsMainPower: boolean }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isCreateAlienPayload(value: unknown): value is CreateAlienPayload {
  if (!isRecord(value)) return false;

  const hasRequiredText = (field: string) =>
    typeof value[field] === "string" && value[field].trim().length > 0;
  const isStat = (field: string) =>
    isFiniteNumber(value[field]) && value[field] >= 0 && value[field] <= 10;

  return (
    hasRequiredText("AlienName") &&
    hasRequiredText("Species") &&
    hasRequiredText("HomePlanet") &&
    hasRequiredText("Description") &&
    isFiniteNumber(value.EnergyConsumption) &&
    value.EnergyConsumption >= 0 &&
    isStat("Strength") &&
    isStat("Speed") &&
    isStat("Intelligence") &&
    isStat("Accuracy") &&
    isFiniteNumber(value.AlienLevel) &&
    Number.isInteger(value.AlienLevel) &&
    value.AlienLevel >= 1 &&
    value.AlienLevel <= 10 &&
    typeof value.Unlocked === "boolean" &&
    typeof value.IsActive === "boolean" &&
    isFiniteNumber(value.SortOrder) &&
    Number.isInteger(value.SortOrder) &&
    value.SortOrder >= 0 &&
    Array.isArray(value.PowerList) &&
    value.PowerList.every(
      (power) =>
        isRecord(power) &&
        isFiniteNumber(power.AlienPowerId) &&
        Number.isInteger(power.AlienPowerId) &&
        power.AlienPowerId > 0 &&
        typeof power.IsMainPower === "boolean",
    )
  );
}

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

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "The request body must contain valid JSON." },
      { status: 400 },
    );
  }

  if (!isCreateAlienPayload(payload)) {
    return Response.json(
      { error: "The alien data is invalid. Check the required fields and stat ranges." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(aliensApiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return Response.json(
        {
          error:
            errorBody ||
            `The aliens backend returned ${response.status} ${response.statusText}.`,
        },
        { status: response.status },
      );
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Unable to create an alien in the backend.", error);

    return Response.json(
      { error: "The aliens backend is unavailable. The alien was not created." },
      { status: 502 },
    );
  }
}
