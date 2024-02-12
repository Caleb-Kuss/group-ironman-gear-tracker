import { NextResponse, NextRequest } from "next/server";

import { createUserClue } from "../../../../../lib/userClues";

export async function POST(req: NextRequest) {
  try {
    const { _id, name } = await req.json();

    const result = await createUserClue(_id, name);

    return NextResponse.json(
      {
        result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
