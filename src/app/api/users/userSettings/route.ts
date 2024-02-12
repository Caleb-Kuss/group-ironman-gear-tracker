import { NextResponse, NextRequest } from "next/server";

import { getUserSettings, updateUserSettings } from "lib/users";

export async function POST(req: NextRequest) {
  const { name, username, selectedColor } = await req.json();

  try {
    const result = await updateUserSettings(name, username, selectedColor);
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
export async function GET(req: NextRequest) {
  const name = req.url?.split("userSettings/")[1];

  try {
    const result = await getUserSettings(name);
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
