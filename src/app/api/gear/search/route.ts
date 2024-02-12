// pages/api/clues/[type]/route.ts
import { searchedGear } from "../../../../../lib/gear";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { term } = await req.json();

    const gear = await searchedGear(term);

    if (!gear)
      return NextResponse.json(
        { status: "error", message: "No gear found." },
        { status: 404 }
      );
    return NextResponse.json(
      {
        status: "success",
        results: gear.length,
        gear,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred while fetching gear.",
      },
      { status: 500 }
    );
  }
}
