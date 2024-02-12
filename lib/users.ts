import { connect, getClient } from "./mongodb";
import { Db, Collection, ObjectId, MongoNetworkError } from "mongodb";
import { getUserIdFromName } from "./userClues";

let db: Db | undefined;
let users: Collection | undefined;

export async function init() {
  if (db && users) {
    return { db, users };
  }

  try {
    await connect();
    const client = await getClient();
    db = client.db("osrs");
    users = db.collection("users");
    return { db, users };
  } catch (err: any) {
    if (err instanceof MongoNetworkError) {
      throw new Error("MongoDB network error. Check your connection.");
    } else {
      throw new Error(`MongoDB connection error: ${err.message}`);
    }
  }
}

(async () => {
  await init();
})();

export async function getAllUsers() {
  try {
    const { users } = await init();
    const res = await users?.find({}).toArray();
    return res || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getUser(name: string) {
  try {
    const { users } = await init();
    const res = await users?.findOne({ name });
    return res || "";
  } catch (err) {
    console.log(err);
    return "User not found";
  }
}

export async function getUserSettings(username: any) {
  try {
    const { users } = await init();

    let name;

    if (typeof username === "object") {
      name = username.name;
    } else {
      name = username;
    }

    const user = await users?.findOne({ name: name });

    if (user) {
      const { username, selectedColor } = user;
      if (!username || !selectedColor) return null;
      return { username, selectedColor };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

export async function updateUserSettings(
  userStringId: any,
  username: string,
  selectedColor: string
) {
  try {
    const { users } = await init();

    const userNameToId = await getUserIdFromName(userStringId);

    if (!userNameToId) {
      console.error(`User with id ${userStringId} not found.`);
      return;
    }

    const user = await users?.findOne({ _id: userNameToId as ObjectId });

    if (!user) {
      console.error(`User with id ${userStringId} not found.`);
      return;
    }

    await users?.updateOne(
      { _id: userNameToId as ObjectId },
      {
        $set: {
          username: username,
          selectedColor: selectedColor,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}
