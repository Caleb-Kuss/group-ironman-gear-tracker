import { NextResponse, NextRequest } from "next/server";

import { getAllGroups, joinGroup } from "../../../../../lib/groups";
import { getAllUsers } from "../../../../../lib/users";
import { Group } from "../../../../../types/Group";

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

export async function POST(req: NextRequest) {
  try {
    const { groupName, googleName, googleEmail } = await req.json();

    if (!googleName || !googleEmail) {
      return NextResponse.json(
        {
          msg: "Must provide a name and a valid email address.",
        },
        { status: 400 }
      );
    }

    const rawAllUsers = await getAllUsers();
    const allUsers = Array.isArray(rawAllUsers) ? rawAllUsers : [];

    if (allUsers.find((user) => user.email && user.email === googleEmail)) {
      return NextResponse.json(
        {
          msg: "This user already exists in a group.",
        },
        { status: 400 }
      );
    } else {
      const result = await joinGroup(groupName, googleName, googleEmail);

      return NextResponse.json(
        {
          result,
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
