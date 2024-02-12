import { BASE_API_URL } from "@/utils/constants";

export async function getAllGroups() {
  const allGroups = `${BASE_API_URL}/api/groups`;
  try {
    const res = await fetch(allGroups, {
      method: "GET",
    });
    return res;
  } catch (err) {
    console.log(err);
  }
}
