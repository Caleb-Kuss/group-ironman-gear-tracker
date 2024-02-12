import { Db, Collection, MongoClient } from "mongodb";
import { connect, getClient } from "./mongodb";

let client: MongoClient | undefined;
let db: Db | undefined;
let groups: Collection | undefined;
let users: Collection | undefined;
let userClues: Collection | undefined;
let userGear: Collection | undefined;

export async function init() {
  if (db && groups && users && userClues && userGear) {
    return { db, groups, users, userClues, userGear };
  }

  try {
    await connect();
    client = await getClient();
    db = client.db("osrs");
    groups = db.collection("groups");
    users = db.collection("users");
    userClues = db.collection("userclues");
    userGear = db.collection("usergear");
    return { db, groups, users, userClues, userGear };
  } catch (err) {
    throw new Error("Can't connect to DB");
  }
}

(async () => {
  await init();
})();

export async function getAllGroups() {
  try {
    const { groups } = await init();
    const result = await groups?.find({}).toArray();
    return result || [];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function createGroup(groupName: string) {
  try {
    const { groups } = await init();
    const results = await groups?.insertOne({ groupName: groupName });
    return results;
  } catch (err) {
    console.log(err);
  }
}

export async function joinGroup(
  groupName: string,
  googleName: string,
  googleEmail: string
) {
  try {
    const { users, groups } = await init();

    const group = await groups?.findOne({ "groupName.groupName": groupName });

    if (!group) {
      console.error(`Group ${groupName} not found.`);
      return;
    }

    const clanIsFull = await checkNumberUsersInGroup(group._id);

    if (clanIsFull.length >= 5) {
      throw new Error(`This group is already full.`);
    }

    const user = {
      groupName: group._id,
      name: googleName,
      email: googleEmail,
    };

    const res = await users?.insertOne(user);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function groupClues(name: string) {
  try {
    const { users, userClues } = await init();
    const existingUser = await users?.findOne({ name: name });

    if (!existingUser) {
      console.log(`User not found for name: ${name}`);
      return {
        existingUser: null,
        userGroup: null,
        groupClues: [],
      };
    }

    const userGroup = existingUser.groupName;
    const aggregationResult = await userClues
      ?.aggregate([
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
          $match: { "userData.groupName": userGroup },
        },
        {
          $group: {
            _id: {
              userId: "$userId",
            },
            groupClues: { $push: { clueId: "$clueId" } },
          },
        },
        {
          $unwind: "$groupClues",
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: "clueUserData",
          },
        },
        {
          $unwind: "$clueUserData",
        },
        {
          $project: {
            _id: 0,
            groupClues: {
              userId: "$_id.userId",
              clueId: "$groupClues.clueId",
              username: "$clueUserData.username",
              selectedColor: "$clueUserData.selectedColor",
            },
          },
        },
      ])
      .toArray();
    if (aggregationResult.length === 0) {
      console.log(`No users found for group: ${name}`);
      return {
        groupClues: [],
      };
    }
    return {
      groupClues: aggregationResult.map((item) => item.groupClues),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function groupGear(name: string) {
  try {
    const { users, userGear } = await init();

    const existingUser = await users?.findOne({ name: name });

    if (!existingUser) {
      return {
        existingUser: null,
        userGroup: null,
        groupGear: [],
      };
    }

    const userGroup = existingUser.groupName;

    const aggregationResult = await userGear
      ?.aggregate([
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
          $match: { "userData.groupName": userGroup },
        },
        {
          $group: {
            _id: {
              userId: "$userId",
            },
            groupGear: { $push: { gearId: "$gearId" } },
          },
        },
        {
          $unwind: "$groupGear",
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: "gearUserData",
          },
        },
        {
          $unwind: "$gearUserData",
        },
        {
          $project: {
            _id: 0,
            groupGear: {
              userId: "$_id.userId",
              gearId: "$groupGear.gearId",
              username: "$gearUserData.username",
              selectedColor: "$gearUserData.selectedColor",
            },
          },
        },
      ])
      .toArray();

    if (aggregationResult?.length === 0) {
      console.log(`No users found for group: ${name}`);
      return {
        groupGear: [],
      };
    }

    return {
      groupGear: aggregationResult?.map((item) => item.groupGear),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getUsersInSameGroup(name: string) {
  const { users } = await init();

  try {
    const currentUser = await users.findOne({ name: name });

    if (!currentUser) {
      return [];
    }

    const aggregationPipeline = [
      {
        $match: {
          groupName: currentUser.groupName,
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          selectedColor: 1,
        },
      },
    ];

    const result = await users.aggregate(aggregationPipeline).toArray();
    return result;
  } catch (error) {
    console.error("Error in getUsersInSameGroup:", error);
    throw new Error("Error fetching users in the same group");
  }
}

export async function checkNumberUsersInGroup(name: any) {
  const { users } = await init();

  try {
    const aggregationPipeline = [
      {
        $match: {
          groupName: name,
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          selectedColor: 1,
        },
      },
    ];

    const result = await users.aggregate(aggregationPipeline).toArray();

    return result;
  } catch (error: any) {
    console.error("Error in checkNumberUsersInGroup:", error);
    throw new Error(error);
  }
}
