"use client";
import RuneScapeHighScores from "@/components/UserHighScores/page";
import { useSearchParams } from "next/navigation";

const HighScores: React.FC = () => {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");

  return (
    <>
      {name && <RuneScapeHighScores name={name || ""} />}
      {!name && (
        <div className="bg-gray-900 p-4 text-white min-h-screen flex flex-col items-center justify-start">
          <h1>
            We cant fetch your highscores at this time. Have you set your
            username in the settings page yet?
          </h1>
        </div>
      )}
    </>
  );
};
export default HighScores;
