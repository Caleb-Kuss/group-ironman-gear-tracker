import Image from "next/image";
import { SingleClueType } from "../../../types/Clue";
import React, { useState } from "react";

type UserClueCardProps = {
  clue: SingleClueType;
  onDelete: (clueId: number) => void;
};

const UserClueCard: React.FC<UserClueCardProps> = ({ clue, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    onDelete(clue._id);
  };

  if (!clue) {
    return <div>No clues found</div>;
  }
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg border border-gray-200 shadow hover:bg-gray-700 dark:border-gray-700 dark:bg-gray-500 dark:hover-bg-gray-700">
      <div
        className={`flex flex-col items-center relative `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={`/img/clues/${clue.type}/${clue.spritePhoto}`}
          alt={clue.name}
          width={40}
          height={40}
        />
        {isHovered && (
          <div className="absolute top-0 -mt-14 left-1/2 transform -translate-x-1/2 bg-opacity-50 bg-gray-600 p-2 rounded-md text-white text-center backdrop-filter backdrop-blur-md">
            <div className="hover-card p-4 border hover:border-gray-400 transition-all duration-300">
              <p className="text-xs mb-2">{clue.type} clue</p>
              <p className="text-xs">{clue.name}</p>
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

export default UserClueCard;
