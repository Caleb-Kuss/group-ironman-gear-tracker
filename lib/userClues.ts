import { connect, getClient } from "./mongodb";
import {
  ObjectId,
  Db,
  Collection,
  MongoNetworkError,
  InsertOneResult,
} from "mongodb";
type CreateUserClueResult = InsertOneResult<any> | string;

let db: Db | undefined;
let userClues: Collection | undefined;
let users: Collection | undefined;
let clues: Collection | undefined;

export async function init() {
  if (db && userClues && users && clues) {
    return { users, userClues, clues };
  }

  try {
    await connect();
    const client = await getClient();
    db = client.db("osrs");
    users = db.collection("users");
    userClues = db.collection("userclues");
    clues = db.collection("clues");
    return { users, userClues, clues };
  } catch (error: any) {
    if (error instanceof MongoNetworkError) {
      throw new Error("MongoDB network error. Check your connection.");
    } else {
      throw new Error(`MongoDB connection error: ${error.message}`);
    }
  }
}

(async () => {
  await init();
})();

export async function getUserIdFromName(name: string) {
  try {
    const { users } = await init();
    const user = await users?.findOne({ name: name });

    if (user) {
      return user._id;
    }

    return null;
  } catch (error) {
    console.error("Error in getUserIdFromName:", error);
    throw error;
  }
}

export async function createUserClue(
  clueId: string,
  userId: string
): Promise<CreateUserClueResult | null> {
  try {
    const { userClues, users, clues } = await init();

    const nameToId = await getUserIdFromName(userId);
    const objectId = new ObjectId(clueId);

    if (!nameToId) {
      console.error(`User ${userId} not found.`);
      throw new Error(`User ${userId} not found.`);
    }

    const aggregationResult = await userClues
      ?.aggregate([
        {
          $match: { userId: nameToId, clueId: objectId },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "clues",
            localField: "clueId",
            foreignField: "_id",
            as: "clue",
          },
        },
        {
          $unwind: "$clue",
        },
      ])
      .toArray();

    const existingUserClue = aggregationResult[0];

    if (existingUserClue) {
      return "You already own this clue.";
    }

    const user = await users?.findOne({ _id: nameToId });
    const clue = await clues?.findOne({ _id: objectId });

    if (!user) {
      console.error(`User ${nameToId} not found.`);
      throw new Error(`User ${nameToId} not found.`);
    }

    if (!clue) {
      console.error(`Clue ${clueId} not found.`);
      throw new Error(`Clue ${clueId} not found.`);
    }

    const usersClue = {
      userId: user._id,
      groupName: user.groupName,
      clueId: clue._id,
    };

    const result = await userClues?.insertOne(usersClue);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserClues(userId: ObjectId): Promise<any[]> {
  try {
    const { userClues, users, clues } = await init();

    const userCluesArray = await userClues
      ?.aggregate([
        {
          $match: { userId },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            _id: 0,
            clueId: 1,
            userData: {
              username: 1,
              color: 1,
            },
          },
        },
      ])
      .toArray();

    if (!userCluesArray.length) {
      return [];
    }

    const clueIds = userCluesArray.map((userClue) => userClue.clueId);

    const result =
      (await clues?.find({ _id: { $in: clueIds } }).toArray()) || [];

    return result.map((clue) => {
      const userClueData = userCluesArray.find((uc) =>
        uc.clueId.equals(clue._id)
      );

      return {
        ...clue,
        userData: userClueData?.userData,
      };
    });
  } catch (error) {
    console.error("Error fetching user clues:", error);
    throw error;
  }
}

export async function deleteUserClues(userId: string, clueId: string) {
  try {
    const { userClues } = await init();

    const nameToId = await getUserIdFromName(userId);

    const clueToDelete = await userClues?.findOne({
      userId: new ObjectId(nameToId || ""),
      clueId: new ObjectId(clueId),
    });

    if (!clueToDelete) {
      console.log(
        `User gear not found for userId: ${userId} and clueId: ${clueId}`
      );
      return null;
    }

    const result = await userClues?.deleteOne({ _id: clueToDelete._id });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
