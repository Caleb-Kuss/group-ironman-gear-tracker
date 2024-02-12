// path/to/highScoreUtil.js
import { getUserSettings } from "lib/users";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const userName = await req.json();

  const { username } = (await getUserSettings(userName)) || {};

  try {
    const highScoreData = await fetch(
      `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`
    );
    const usersHighScore = await highScoreData.text();

    return NextResponse.json(
      {
        usersHighScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching highscore data:", error);
    throw error;
  }
}
