"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ScrollToTop from "../../../components/ScrollUpButton";
import useScroll from "../../../../hooks/useScroll";
import Loader from "../../../components/Loader";
import BackButton from "@/components/backButton";
import UserGearCard from "@/components/userGear";

const fetchUserClues = async (name: string) => {
  const response = await fetch("/api/gear/ownedGear", {
    method: "POST",
    body: JSON.stringify(name),
  });

  const data = await response.json();

  return data.userGear;
};

type SingleGearType = {
  _id: number;
  type: string;
  spritePhoto: string;
  name: string;
};

const GearList: React.FC<{
  userGear: SingleGearType[];
  onDelete: (gearId: number) => void;
}> = ({ userGear, onDelete }) => (
  <div className="flex flex-col items-center w-full">
    <h1 className="text-3xl text-gray-400 text-center font-semibold mb-4">
      Gear Owned
    </h1>
    <div className="flex flex-wrap justify-center">
      {userGear.map((gear) => (
        <UserGearCard
          key={gear._id}
          gear={gear}
          onDelete={() => onDelete(gear._id)}
        />
      ))}
    </div>
  </div>
);

const NoGearMessage: React.FC = () => (
  <>
    <h1 className="text-3xl text-red-400 text-center font-semibold mb-4">
      No gear to be found
    </h1>
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-32">
      <BackButton />
    </button>
  </>
);

const GearPage: React.FC = () => {
  const shouldShowScrollButton = useScroll();
  const [loading, setLoading] = useState(true);
  const [userGear, setUserGear] = useState<SingleGearType[]>([]);
  const { data: session } = useSession();

  const handleDeleteClue = async (gearId: number) => {
    try {
      const response = await fetch(
        `/api/gear/delete/?gearId=${gearId}&name=${encodeURIComponent(
          session?.user?.name as string
        )}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedUserClues = userGear.filter((gear) => gear._id !== gearId);
        setUserGear(updatedUserClues);
      } else {
        console.error("Failed to delete clue:", response.statusText);
      }
    } catch (error: any) {
      console.error(`Error Deleting owned clues:`, error);
    }
  };

  useEffect(() => {
    const userName = session?.user?.name;
    if (userName) {
      fetchUserClues(userName)
        .then((data) => {
          setLoading(false);
          setUserGear(data);
        })
        .catch((error) => {
          console.error("Error fetching user clues:", error);
        });
    }
  }, [session]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-900 p-4 text-white min-h-screen flex flex-col items-center justify-start">
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 max-w-screen-md mx-auto">
          {userGear.length ? (
            <GearList userGear={userGear} onDelete={handleDeleteClue} />
          ) : (
            <NoGearMessage />
          )}
        </div>
        <br />
        {userGear.length ? <BackButton /> : ""}
      </div>
      <br />
      {shouldShowScrollButton && <ScrollToTop />}
    </div>
  );
};

export default GearPage;
