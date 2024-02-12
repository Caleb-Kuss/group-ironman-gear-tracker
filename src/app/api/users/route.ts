import { NextResponse } from "next/server";

import { getAllUsers } from "../../../../lib/users";

export async function GET() {
  try {
    const result = await getAllUsers();
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
