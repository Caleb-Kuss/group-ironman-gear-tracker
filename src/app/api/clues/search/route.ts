// pages/api/clues/[type]/route.ts
import { searchedClues } from "../../../../../lib/clues";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { term } = await req.json();

    const clues = await searchedClues(term);

    if (!clues)
      return NextResponse.json(
        { status: "error", message: "No clues found." },
        { status: 404 }
      );
    return NextResponse.json(
      {
        status: "success",
        results: clues.length,
        clues,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred while fetching clues.",
      },
      { status: 500 }
    );
  }
}
