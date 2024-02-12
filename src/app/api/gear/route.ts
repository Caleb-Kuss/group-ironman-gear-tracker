import { NextResponse } from "next/server";

import { getAllClues } from "../../../../lib/clues";
import { SingleClueType } from "../../../../types/Clue";

export async function GET() {
  try {
    const result = (await getAllClues()) as SingleClueType[];

    const count = result.length;
    return NextResponse.json(
      {
        count,
        result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
