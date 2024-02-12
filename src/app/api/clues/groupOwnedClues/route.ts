import { NextResponse, NextRequest } from "next/server";

import { groupClues } from "../../../../../lib/groups";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    const result = await groupClues(name);

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
