import { getUsersInSameGroup } from "lib/groups";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const username = await req.json();

    if (!username) {
      return NextResponse.json(
        {
          msg: "Username not found",
        },
        { status: 400 }
      );
    }

    const user = await getUsersInSameGroup(username);

    return NextResponse.json(
      {
        data: user,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
