import { connect, getClient } from "./mongodb";
import { Db, Collection, MongoClient } from "mongodb";

let client: MongoClient | undefined;
let db: Db | undefined;
let clues: Collection | undefined;

export async function init() {
  if (db && clues) {
    return { db, clues };
  }

  try {
    await connect();
    client = await getClient();
    db = client.db("osrs");
    clues = db.collection("clues");
    return { db, clues };
  } catch (err) {
    throw new Error("Can't connect to DB");
  }
}

(async () => {
  await init();
})();

export async function getAllClues() {
  try {
    const { clues } = await init();
    const result = await clues?.find({}).toArray();
    return result || [];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getClueByType(type: string) {
  try {
    const { clues } = await init();
    const res = await clues?.find({ type }).toArray();
    return res || [];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function searchedClues(searchTerm: string) {
  try {
    if (typeof searchTerm !== "string") {
      throw new Error("Search term must be a string.");
    }

    const { clues: cluesCollection } = await init();
    const res = await cluesCollection
      ?.find({ name: { $regex: searchTerm } })
      .toArray();

    return res || [];
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
}
