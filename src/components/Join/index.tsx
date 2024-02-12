// components/Join.js
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Join() {
  const { data: session } = useSession();
  const [clan, setClan] = useState(false);
  const [showLeaveMessage, setShowLeaveMessage] = useState(false);

  useEffect(() => {
    const checkUserGroupMembership = async () => {
      try {
        const apiResponse = await fetch("/api/checkUserInGroup");
        const { data } = await apiResponse.json();

        if (apiResponse.ok) {
          if (data.user.groupName) {
            setClan(true);
          } else {
            setClan(false);
          }
        }
      } catch (error) {
        console.error("Error checking group membership:", error);
      }
    };

    checkUserGroupMembership();
  }, [session]);

  const handleLeaveGroup = () => {
    // TODO: Implement the actual leave group functionality

    setShowLeaveMessage(true);
    setTimeout(() => setShowLeaveMessage(false), 3000);
  };

  if (session && clan) {
    return (
      <div className="mr-4 flex-grow text-yellow-300 hover:text-yellow-400">
        <button onClick={handleLeaveGroup}>Leave group</button>
        {showLeaveMessage && (
          <p className="text-red-500">GG I didnt wire this up yet.</p>
        )}
      </div>
    );
  }

  // Hiding the create button to keep for personal use
  return (
    <div className="flex-nowrap justify-evenly items-center">
      <Link href="/groups">
        <button>Join Group</button>
      </Link>
      {/* <Link href="/create">
        <button>Create Group</button>
      </Link> */}
    </div>
  );
}
