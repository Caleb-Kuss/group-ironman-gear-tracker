// pages/api/clues/[type]/route.ts
import { deleteUserClues } from "../../../../../lib/userClues";
import { getClueByType } from "../../../../../lib/clues";
import { NextResponse, NextRequest } from "next/server";

export type Clue = {
  id: string;
  name: string;
  type: string;
};
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const type = req.url?.split("clues/")[1];

    if (!type) {
      return NextResponse.json(
        { status: "error", message: "Type parameter is missing." },
        { status: 400 }
      );
    }

    const clues = (await getClueByType(type)) as Clue[];

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

export async function DELETE(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const clueId = searchParams.get("clueId");
  const name = searchParams.get("name");

  const deleteClue = deleteUserClues(name || "", clueId || "");
  return NextResponse.json({
    status: "success",
    deleteClue,
  });
}
