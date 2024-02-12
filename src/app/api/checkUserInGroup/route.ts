import { BASE_API_URL } from "@/utils/constants";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const usersName = session.user?.name;
    const requestBody = JSON.stringify({ name: usersName });
    const apiResponse = await fetch(`${BASE_API_URL}/api/users/${usersName}`, {
      method: "POST",
      body: requestBody,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      return NextResponse.json({ data }, { status: 200 });
    } else {
      throw new Error("Error checking group membership");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
