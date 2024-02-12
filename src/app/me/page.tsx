"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type UserGearDashboardProps = {};

const UserGearDashboard: React.FC<UserGearDashboardProps> = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-gray-900 p-4 text-white min-h-screen flex flex-col items-center shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">User Gear Dashboard</h1>
      <div className="flex flex-wrap items-center gap-4 justify-center space-x-4">
        <Link
          href="/me/clues"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Clues
        </Link>
        <Link
          href="/me/melee"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Gear
        </Link>
        <Link
          href="/me/userSettings"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Settings
        </Link>
        <Link
          href={{
            pathname: "/me/highScores",
            query: { name: session?.user?.name },
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          HighScores
        </Link>
      </div>
      <div></div>
    </div>
  );
};

export default UserGearDashboard;
