/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import SingleClue from "./[type]";
import { SingleClueType } from "../../../types/Clue";
import { useSession } from "next-auth/react";
import ScrollToTop from "@/components/ScrollUpButton";
import useScroll from "hooks/useScroll";
import ClueSearch from "@/components/ClueSearch";

const Clues: React.FC = () => {
  const { data: session } = useSession();
  const [clues, setClues] = useState<SingleClueType[]>([]);
  const [noCluesMessage, setNoCluesMessage] = useState("");
  const shouldShowScrollButton = useScroll();

  const handleCluesByType = async (type: string) => {
    try {
      const response = await fetch(`/api/clues/${type}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch clues for type ${type}`);
      }

      const fetchedClues = await response.json();

      if (Array.isArray(fetchedClues.clues)) {
        if (fetchedClues.clues.length === 0) {
          setNoCluesMessage(`There are no ${type} clue rewards to be found!`);
          setClues([]);
        } else {
          setNoCluesMessage("");
          setClues(fetchedClues.clues);
        }
      } else {
        setNoCluesMessage(`Invalid data received for ${type} clues.`);
        setClues([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (session) {
    return (
      <div className="bg-gray-900 p-4 text-white min-h-screen  flex flex-col  items-center shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Clue Rewards</h1>
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-4 justify-center space-x-4">
            <button
              onClick={() => handleCluesByType("beginner")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Beginner
            </button>
            <button
              onClick={() => handleCluesByType("easy")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Easy
            </button>
            <button
              onClick={() => handleCluesByType("medium")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Medium
            </button>
            <button
              onClick={() => handleCluesByType("hard")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Hard
            </button>
            <button
              onClick={() => handleCluesByType("elite")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Elite
            </button>
            <button
              onClick={() => handleCluesByType("master")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Master
            </button>
          </div>
        </div>
        {noCluesMessage || (
          <>
            <br />
            <ClueSearch />
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {clues.map((clue) => (
                  <SingleClue key={clue.name} clue={clue} />
                ))}
              </div>
            </div>
            {shouldShowScrollButton && <ScrollToTop />}
          </>
        )}
      </div>
    );
  }
  return (
    <>
      <div className="bg-gray-900 p-4 text-white min-h-screen flex flex-col items-center shadow-lg">
        <h1 className="font-bold">You must log in to access this content.</h1>
      </div>
    </>
  );
};

export default Clues;
