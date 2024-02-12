"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SingleClueType } from "../../../types/Clue";
import { useSession } from "next-auth/react";
import Loader from "../../components/Loader";

type SingleClueProps = {
  clue: SingleClueType;
};

const SingleClue: React.FC<SingleClueProps> = ({ clue }) => {
  const { _id, name, type, largePhoto } = clue || {};
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [groupClues, setGroupClues] = useState([] as SingleClueType[]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupCluesResponse = await fetch("/api/clues/groupOwnedClues/", {
          method: "POST",
          body: JSON.stringify({ name: session?.user?.name }),
        });

        const groupCluesData = await groupCluesResponse.json();

        const groupNames = groupCluesData.result.groupClues;

        setGroupClues(groupNames);
        setLoading(false);
      } catch (error: any) {
        console.error(`Error fetching group clues:`, error);
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.name]);

  const selectClue = async (_id: number) => {
    try {
      const response = await fetch("/api/clues/ownClues/", {
        method: "POST",
        body: JSON.stringify({ _id, name: session?.user?.name }),
      });
      const message = await response.json();

      if (message.result === "You already own this clue.") {
        setMessage("You already own this clue");
        const time = setTimeout(() => {
          setMessage(null);
        }, 3000);

        setTimeoutId(time);
      } else {
        setMessage("You now own this clue item");
        const time = setTimeout(() => {
          setMessage(null);
        }, 3000);

        setTimeoutId(time);
      }
    } catch (error: any) {
      setMessage("Failed to own this clue. Please try again.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  const userOwnedClues = groupClues.filter(
    (userClue) => userClue.clueId === _id
  );

  return (
    <>
      <div
        className={`relative bg-gray-900 text-white p-4 rounded-lg border border-gray-200 shadow hover:bg-gray-700 dark:border-gray-700 dark:bg-gray-500 dark:hover:bg-gray-700 `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {groupClues.length > 0 && (
          <div className="absolute top-2 right-2">
            {userOwnedClues.map((userClue, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: userClue.selectedColor,
                  marginRight: index < userOwnedClues.length - 1 ? "4px" : "0",
                }}
                className="w-2 h-2 rounded-full inline-block"
                title={userClue.username}
              ></div>
            ))}
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="relative">
            {loadedImages.includes(`/img/clues/${type}/${largePhoto}`) ? (
              <Image
                src={`/img/clues/${type}/${largePhoto}`}
                alt={name}
                width={40}
                height={40}
                loading="eager"
                className="h-10 w-10 rounded-t-lg"
              />
            ) : (
              <Image
                src={`/img/clues/${type}/${largePhoto}`}
                alt={name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-t-lg"
                loading="lazy"
                onLoad={() =>
                  setLoadedImages([
                    ...loadedImages,
                    `/img/clues/${type}/${largePhoto}`,
                  ])
                }
              />
            )}

            {isHovered && (
              <div className="absolute top-0 -mt-14 left-1/2 transform -translate-x-1/2 bg-opacity-80 bg-gray-600 p-2 rounded-md text-white text-center backdrop-filter backdrop-blur-md">
                <div className="hover-card p-4 border hover:border-gray-400 transition-all duration-300">
                  <span className="text-sm">{name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Image
          className="relative bottom-0 p-2 cursor-pointer"
          src={"/green-plus-11975.svg"}
          alt="Plus button"
          width={40}
          height={40}
          onClick={() => selectClue(_id)}
        />

        {message && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-black text-sm">
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default SingleClue;
