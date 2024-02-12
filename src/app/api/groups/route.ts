import { NextResponse } from "next/server";

import { getAllGroups } from "../../../../lib/groups";
import { Group } from "../../../../types/Group";

export async function GET() {
  try {
    const result = (await getAllGroups()) as Group[];
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
