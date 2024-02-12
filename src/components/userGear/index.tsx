import Image from "next/image";
import { SingleClueType } from "../../../types/Clue";
import React, { useState } from "react";

type UserGearCardProps = {
  gear: SingleClueType;
  onDelete: (gearId: number) => void;
};

const UserGearCard: React.FC<UserGearCardProps> = ({ gear, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    onDelete(gear._id);
  };

  if (!gear) {
    return <div>No gear found</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg border border-gray-200 shadow hover:bg-gray-700 dark:border-gray-700 dark:bg-gray-500 dark:hover-bg-gray-700">
      <div
        className={`flex flex-col items-center relative `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={`/img/${gear.spritePhoto}`}
          alt={gear.name}
          width={40}
          height={40}
        />
        {isHovered && (
          <div className="absolute top-0 -mt-14 left-1/2 transform -translate-x-1/2 bg-opacity-50 bg-gray-600 p-2 rounded-md text-white text-center backdrop-filter backdrop-blur-md">
            <div className="hover-card p-4 border hover:border-gray-400 transition-all duration-300">
              <span className="text-xs">{gear.name}</span>
            </div>
          </div>
        )}
      </div>
      <div
        className="relative top-5 left-8 p-2 cursor-pointer"
        onClick={handleDelete}
      >
        <Image
          src="/open-trash-can-svgrepo-com.svg"
          alt="Trash Can"
          height={20}
          width={20}
        />
      </div>
    </div>
  );
};

export default UserGearCard;
