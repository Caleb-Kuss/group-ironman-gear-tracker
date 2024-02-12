import { connect, getClient } from "./mongodb";
import { Db, Collection, MongoClient } from "mongodb";

let client: MongoClient | undefined;
let db: Db | undefined;
let gears: Collection | undefined;

export async function init() {
  if (db && gears) {
    return { db, gears };
  }

  try {
    await connect();
    client = await getClient();
    db = client.db("osrs");
    gears = db.collection("gears");
    return { db, gears };
  } catch (err) {
    throw new Error("Can't connect to DB");
  }
}

(async () => {
  await init();
})();

export async function getAllGear() {
  try {
    const { gears } = await init();
    const result = await gears?.find({}).toArray();
    return result || [];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getGearByType(type: string) {
  try {
    const { gears } = await init();
    const res = await gears?.find({ type }).toArray();
    return res || [];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function searchedGear(searchTerm: string) {
  try {
    if (typeof searchTerm !== "string") {
      throw new Error("Search term must be a string.");
    }

    const { gears } = await init();
    const res = await gears?.find({ name: { $regex: searchTerm } }).toArray();

    return res || [];
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
}
