"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserClueCard from "../../../components/userClues";
import Link from "next/link";
import ScrollToTop from "../../../components/ScrollUpButton";
import useScroll from "../../../../hooks/useScroll";
import Loader from "../../../components/Loader";
import BackButton from "../../../components/backButton";

const fetchUserClues = async (name: string) => {
  const response = await fetch("/api/clues/ownedClues", {
    method: "POST",
    body: JSON.stringify(name),
  });

  const data = await response.json();

  return data.userClues;
};

type SingleClueType = {
  _id: number;
  type: string;
  spritePhoto: string;
  name: string;
};

const CluesPage: React.FC = () => {
  const shouldShowScrollButton = useScroll();
  const [loading, setLoading] = useState(true);

  const [userClues, setUserClues] = useState<SingleClueType[]>([]);
  const { data: session } = useSession();

  const handleDeleteClue = async (clueId: number) => {
    try {
      const response = await fetch(
        `/api/clues/delete/?clueId=${clueId}&name=${encodeURIComponent(
          session?.user?.name as string
        )}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedUserClues = userClues.filter(
          (clue) => clue._id !== clueId
        );
        setUserClues(updatedUserClues);
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
          setUserClues(data);
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
          {userClues.length ? (
            <div className="flex flex-col items-center w-full">
              <h1 className="text-3xl text-gray-400 text-center font-semibold mb-4">
                Clues Owned
              </h1>
              <div className="flex flex-wrap justify-center">
                {userClues.map((clue) => (
                  <UserClueCard
                    key={clue._id}
                    clue={clue}
                    onDelete={() => handleDeleteClue(clue._id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl text-red-400 text-center font-semibold mb-4">
                You do not own any clues yet
              </h1>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-32">
                <Link href="/me">Go back</Link>
              </button>
            </>
          )}
        </div>
        <br />
        {userClues.length ? <BackButton /> : ""}
      </div>
      <br />
      {shouldShowScrollButton && <ScrollToTop />}
    </div>
  );
};

export default CluesPage;
