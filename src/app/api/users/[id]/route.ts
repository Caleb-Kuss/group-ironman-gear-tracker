// pages/api/users/findByName.js
import { NextResponse, NextRequest } from "next/server";
import { getUser } from "../../../../../lib/users";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required." },
        { status: 400 }
      );
    }

    const user = await getUser(name);

    if (user) {
      return NextResponse.json(
        {
          user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "User not in a group." },
        { status: 404 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}
