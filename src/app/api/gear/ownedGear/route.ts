import { NextResponse, NextRequest } from "next/server";

import { getUserIdFromName } from "../../../../../lib/userClues";
import { getUserGear } from "../../../../../lib/userGear";

export async function POST(req: NextRequest) {
  const name = await req.json();

  const userId = await getUserIdFromName(name);

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userGear = await getUserGear(userId);

  return NextResponse.json({ userGear }, { status: 200 });
}
