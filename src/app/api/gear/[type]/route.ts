// pages/api/clues/[type]/route.ts
import { deleteUserGear } from "../../../../../lib/userGear";
import { NextResponse, NextRequest } from "next/server";
import { getGearByType } from "lib/gear";

export type Gear = {
  id: string;
  name: string;
  type: string;
};
export async function GET(req: NextRequest) {
  try {
    const type = req.url?.split("gear/")[1];

    if (!type) {
      return NextResponse.json(
        { status: "error", message: "Type parameter is missing." },
        { status: 400 }
      );
    }

    const gear = (await getGearByType(type)) as Gear[];

    return NextResponse.json(
      {
        status: "success",
        results: gear.length,
        gear,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred while fetching clues.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const gearId = searchParams.get("gearId");
  const name = searchParams.get("name");

  const deleteClue = deleteUserGear(name || "", gearId || "");
  return NextResponse.json({
    status: "success",
    deleteClue,
  });
}
