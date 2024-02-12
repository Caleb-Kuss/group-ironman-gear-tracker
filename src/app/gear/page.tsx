/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import GearByType from "./[type]";
import ScrollToTop from "@/components/ScrollUpButton";
import useScroll from "hooks/useScroll";
import { useSession } from "next-auth/react";
import GearSearch from "@/components/GearSearch";

type GearItemType = {
  _id: string;
  name: string;
  type: string;
  largePhoto: string;
};

const Gear: React.FC = () => {
  const { data: session } = useSession();
  const [gear, setGear] = useState<GearItemType[]>([]);
  const [noGearMessage, setNoGearMessage] = useState("");
  const shouldShowScrollButton = useScroll();

  const handleGearByType = async (type: string) => {
    try {
      const response = await fetch(`/api/gear/${type}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch gear for type ${type}`);
      }

      const fetchedGear = await response.json();

      if (Array.isArray(fetchedGear.gear)) {
        if (fetchedGear.gear.length === 0) {
          setNoGearMessage(`There is no ${type} gear to be found!`);
          setGear([]);
        } else {
          setNoGearMessage("");
          setGear(fetchedGear.gear);
        }
      } else {
        setNoGearMessage(`Invalid data received for ${type} gear.`);
        setGear([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (session) {
    return (
      <div className="bg-gray-900 p-4 text-white min-h-screen  flex flex-col  items-center shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Available Gear</h1>
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-4 justify-center space-x-4">
            <button
              onClick={() => handleGearByType("melee")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Melee
            </button>
            <button
              onClick={() => handleGearByType("range")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Range
            </button>
            <button
              onClick={() => handleGearByType("mage")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Mage
            </button>
          </div>
        </div>
        {noGearMessage || (
          <>
            <br />
            <GearSearch />
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gear.map((item) => (
                  <GearByType key={item.name} gear={item} />
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

export default Gear;
