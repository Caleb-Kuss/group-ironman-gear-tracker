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
let userGear: Collection | undefined;
let users: Collection | undefined;
let gears: Collection | undefined;

export async function init() {
  if (db && userGear && users && gears) {
    return { users, userGear, gears };
  }

  try {
    await connect();
    const client = await getClient();
    db = client.db("osrs");
    users = db.collection("users");
    userGear = db.collection("usergear");
    gears = db.collection("gears");
    return { users, userGear, gears };
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

export async function createUserGear(
  clueId: string,
  userId: string
): Promise<CreateUserClueResult | null> {
  try {
    const { userGear, users, gears } = await init();

    const nameToId = await getUserIdFromName(userId);
    const objectId = new ObjectId(clueId);

    if (!nameToId) {
      console.error(`User ${userId} not found.`);
      throw new Error(`User ${userId} not found.`);
    }

    const aggregationResult = await userGear
      ?.aggregate([
        {
          $match: { userId: nameToId, gearId: objectId },
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
            from: "gears",
            localField: "gearId",
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
      return "You already own this.";
    }

    const user = await users?.findOne({ _id: nameToId });
    const gear = await gears?.findOne({ _id: objectId });

    if (!user) {
      console.error(`User ${nameToId} not found.`);
      throw new Error(`User ${nameToId} not found.`);
    }

    if (!gear) {
      console.error(`Clue ${gear} not found.`);
      throw new Error(`Clue ${gear} not found.`);
    }

    const usersGear = {
      userId: user._id,
      groupName: user.groupName,
      gearId: gear._id,
    };

    const result = await userGear?.insertOne(usersGear);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserGear(userId: ObjectId): Promise<any[]> {
  try {
    const { userGear, users, gears } = await init();

    const userGearArray = await userGear
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
            gearId: 1,
            userData: {
              username: 1,
              color: 1,
            },
          },
        },
      ])
      .toArray();

    if (!userGearArray.length) {
      return [];
    }

    const gearIds = userGearArray.map((userGear) => userGear.gearId);

    const result =
      (await gears?.find({ _id: { $in: gearIds } }).toArray()) || [];

    return result.map((gear) => {
      const userGearData = userGearArray.find((ug) =>
        ug.gearId.equals(gear._id)
      );

      return {
        ...gear,
        userData: userGearData?.userData,
      };
    });
  } catch (error) {
    console.error("Error fetching user gears:", error);
    throw error;
  }
}

export async function deleteUserGear(userId: string, gearId: string) {
  try {
    const { userGear } = await init();

    const nameToId = await getUserIdFromName(userId);

    const gearToDelete = await userGear?.findOne({
      userId: new ObjectId(nameToId || ""),
      gearId: new ObjectId(gearId),
    });

    if (!gearToDelete) {
      console.log(
        `User gear not found for userId: ${userId} and gearId: ${gearId}`
      );
      return null;
    }

    const result = await userGear?.deleteOne({ _id: gearToDelete._id });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
