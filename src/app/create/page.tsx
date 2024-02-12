"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type GroupFormProps = {};
const GroupForm: React.FC<GroupFormProps> = () => {
  const router = useRouter();

  const [groupName, setGroupName] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupName }),
      });

      if (response.ok) {
        setMessage("Group Created Successfully");
        setTimeout(() => setMessage(null), 3000);
        router.push("/groups");
      } else {
        console.error("Failed to create group.");
        setMessage("Failed to create group. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }

    setGroupName("");
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">Group Name:</span>
          <input
            className="mt-1 p-2 w-full border rounded-md"
            type="text"
            value={groupName}
            onChange={handleGroupNameChange}
            required
          />
        </label>
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
          type="submit"
        >
          Create Group
        </button>
        {message && (
          <div
            className={`mt-2 p-2 ${
              message.includes("Successfully") ? "bg-green-200" : "bg-red-200"
            } rounded-md`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default GroupForm;
