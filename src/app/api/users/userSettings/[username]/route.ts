import { NextResponse, NextRequest } from "next/server";

import { getUserSettings } from "lib/users";

export async function GET(req: NextRequest) {
  const username = decodeURIComponent(req.url?.split("userSettings/")[1]);

  try {
    const result = await getUserSettings(username);

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
