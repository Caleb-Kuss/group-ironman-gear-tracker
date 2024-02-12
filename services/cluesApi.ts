import { BASE_API_URL } from "@/utils/constants";

export async function getAllClues() {
  try {
    const res = await fetch(`${BASE_API_URL}/clues`, {
      method: "GET",
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getCluesByType(type: string) {
  const allCluesTypeEndpoint = `${BASE_API_URL}/clues/${type}`;
  try {
    const res = await fetch(allCluesTypeEndpoint, {
      method: "GET",
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
}
