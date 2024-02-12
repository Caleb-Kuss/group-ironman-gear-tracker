"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loader from "../../components/Loader";

type SingleGearProps = {
  gear: any;
};

const GearByType: React.FC<SingleGearProps> = ({ gear }) => {
  const { _id, name, type, largePhoto } = gear || {};

  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [groupGear, setGroupGear] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const ownedAlreadyMessage = "You already own this.";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupGearResponse = await fetch("/api/gear/groupOwnedGear/", {
          method: "POST",
          body: JSON.stringify({ name: session?.user?.name }),
        });

        const groupGearData = await groupGearResponse.json();

        if (Array.isArray(groupGearData.result.groupGear)) {
          setGroupGear(groupGearData.result.groupGear);
          setLoading(false);
        } else {
          console.error(`Invalid data received for group gear.`);
          setLoading(false);
        }
      } catch (error: any) {
        console.error(`Error fetching group gear:`, error);
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.name]);

  const selectGear = async (_id: number) => {
    try {
      const response = await fetch("/api/gear/ownGear/", {
        method: "POST",
        body: JSON.stringify({ _id, name: session?.user?.name }),
      });
      const message = await response.json();

      if (message.result === ownedAlreadyMessage) {
        setMessage(ownedAlreadyMessage);
        const time = setTimeout(() => {
          setMessage(null);
        }, 3000);

        setTimeoutId(time);
      } else {
        setMessage("Congratulations on the new toy!");
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

  const userOwnedGear = groupGear.filter(
    (groupGearItem) => groupGearItem.gearId === _id
  );

  return (
    <div
      className={`relative bg-gray-900 text-white p-4 rounded-lg border border-gray-200 shadow hover:bg-gray-700 dark:border-gray-700 dark:bg-gray-500 dark:hover:bg-gray-700 `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {groupGear.length > 0 && (
        <div className="absolute top-2 right-2">
          {userOwnedGear.map((groupGear, index) => (
            <div
              key={index}
              style={{
                backgroundColor: groupGear.selectedColor,
                marginRight: index < userOwnedGear.length - 1 ? "4px" : "0",
              }}
              className="w-2 h-2 rounded-full inline-block"
              title={groupGear.username}
            ></div>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="relative">
          {loadedImages.includes(`/img/${largePhoto}`) ? (
            <Image
              src={`/img/${largePhoto}`}
              alt={name}
              width={40}
              height={40}
              loading="eager"
              className="h-10 w-10 rounded-t-lg"
            />
          ) : (
            <Image
              src={`/img/${largePhoto}`}
              alt={name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-t-lg"
              loading="lazy"
              onLoad={() =>
                setLoadedImages([...loadedImages, `/img/${largePhoto}`])
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
        onClick={() => selectGear(_id)}
      />

      {message && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-black text-sm">
          {message}
        </div>
      )}
    </div>
  );
};

export default GearByType;
