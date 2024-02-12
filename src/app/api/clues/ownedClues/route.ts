import { NextResponse, NextRequest } from "next/server";

import { getUserClues, getUserIdFromName } from "../../../../../lib/userClues";

export async function POST(req: NextRequest) {
  const name = await req.json();

  const userId = await getUserIdFromName(name);

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userClues = await getUserClues(userId);

  return NextResponse.json({ userClues }, { status: 200 });
}
