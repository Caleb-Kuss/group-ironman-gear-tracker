/* eslint-disable react/prop-types */
"use client";
import { getAllGroups } from "../../../services/groupsApi";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Group = {
  _id: string;
  groupName: {
    groupName: string;
  };
};

type Message = {
  text: string;
  color: string;
};

function Groups() {
  const router = useRouter();

  const groupJoined = `/api/groups/join/`;

  const [groups, setGroups] = useState<Group[]>([]);
  const [message, setMessage] = useState<Message>({ text: "", color: "" });
  const { data: session } = useSession();

  const handleInsertData = async (group: any) => {
    try {
      const { groupName } = group;
      const { name, email } = session?.user as any;

      const response = await fetch(groupJoined, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          groupName: groupName.groupName,
          googleName: name,
          googleEmail: email
        })
      });
      if (response.ok) {
        const data = await response.json();

        setMessage({
          text: `Joined Successfully!`,
          color: "text-green-500"
        });
        router.push("/me/userSettings");
      } else {
        const errorData = await response.json();

        setMessage({
          text: errorData.error || errorData.msg || "An error occurred",
          color: "text-yellow-400"
        });
      }
    } catch (error: any) {
      console.error("Error inserting data:", error);
      setMessage({
        text: `${error}`,
        color: "text-red-500"
      });
    }
  };
  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await getAllGroups();
        if (!response) {
          return null;
        }
        const data = await response.json();
        setGroups(data.result);
      } catch (err) {
        console.log(err);
      }
    }

    fetchGroups();
  }, []);

  return (
    <div className="bg-gray-900 p-4 text-white min-h-screen  flex flex-col  shadow-lg">
      <div className="bg-osrs-bg text-osrs-text flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">Groups</h1>
      </div>
      <ul className="text-xl">
        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => handleInsertData(group)}
            className="mb-2 ml-5 p-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md shadow-md"
          >
            {message && <p className={message.color}>{message.text}</p>}
            <h3 className="text-lg">{group.groupName.groupName}</h3>
          </button>
        ))}
      </ul>
    </div>
  );
}

export default Groups;
