import { NextResponse, NextRequest } from "next/server";

import { createGroup } from "../../../../../lib/groups";

export async function POST(req: NextRequest) {
  try {
    const result = await req.json();

    const group = await createGroup(result);
    return NextResponse.json(
      {
        group,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
