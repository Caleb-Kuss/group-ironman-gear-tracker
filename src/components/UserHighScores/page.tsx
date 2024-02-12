import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import ScrollToTop from "../ScrollUpButton";
import BackButton from "../backButton";

const keys = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction",
  "League Points",
  "Deadman Points",
  "Bounty Hunter - Hunter",
  "Bounty Hunter - Rogue",
  "Bounty Hunter (Legacy) - Hunter",
  "Bounty Hunter (Legacy) - Rogue",
  "Clue Scrolls (all)",
  "Clue Scrolls (beginner)",
  "Clue Scrolls (easy)",
  "Clue Scrolls (medium)",
  "Clue Scrolls (hard)",
  "Clue Scrolls (elite)",
  "Clue Scrolls (master)",
  "LMS - Rank",
  "PvP Arena - Rank",
  "Soul Wars Zeal",
  "Rifts closed",
  "Abyssal Sire",
  "Alchemical Hydra",
  "Artio",
  "Barrows Chests",
  "Bryophyta",
  "Callisto",
  "Cal'varion",
  "Cerberus",
  "Chambers of Xeric",
  "Chambers of Xeric: Challenge Mode",
  "Chaos Elemental",
  "Chaos Fanatic",
  "Commander Zilyana",
  "Corporeal Beast",
  "Crazy Archaeologist",
  "Dagannoth Prime",
  "Dagannoth Rex",
  "Dagannoth Supreme",
  "Deranged Archaeologist",
  "Duke Sucellus",
  "General Graardor",
  "Giant Mole",
  "Grotesque Guardians",
  "Hespori",
  "Kalphite Queen",
  "King Black Dragon",
  "Kraken",
  "Kree'Arra",
  "K'ril Tsutsaroth",
  "Mimic",
  "Nex",
  "Nightmare",
  "Phosani's Nightmare",
  "Obor",
  "Phantom Muspah",
  "Sarachnis",
  "Scorpia",
  "Skotizo",
  "Spindel",
  "Tempoross",
  "The Gauntlet",
  "The Corrupted Gauntlet",
  "The Leviathan",
  "The Whisperer",
  "Theatre of Blood",
  "Theatre of Blood: Hard Mode",
  "Thermonuclear Smoke Devil",
  "Tombs of Amascut",
  "Tombs of Amascut: Expert Mode",
  "TzKal-Zuk",
  "TzTok-Jad",
  "Vardorvis",
  "Venenatis",
  "Vet'ion",
  "Vorkath",
  "Wintertodt",
  "Zalcano",
  "Zulrah",
];

const header = ["Rank", "Level", "Experience"];

const RuneScapeHighScores: React.FC<{ name: string }> = ({ name }) => {
  const [highScores, setHighScores] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/highscores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        if (response.ok) {
          const result = await response.json();
          const highScoreString = result.usersHighScore;
          const rows = highScoreString.split("\n");
          const dataArray = rows.map((row: string) => row.split(","));

          const resultObject = keys.reduce((obj, key, index) => {
            obj[key] = dataArray[index].map((value: string) =>
              value === "-1" ? "-" : parseInt(value)
            );
            return obj;
          }, {} as any);
          setLoading(false);
          setHighScores(resultObject);
        } else {
          console.error("Error fetching high scores:", response.status);
        }
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchHighScores();
  }, [name]);

  return (
    <div className=" bg-gray-800">
      {loading && <Loader />}
      {highScores && (
        <div className="w-fit mx-auto bg-gray-800 p-2 rounded-lg shadow-lg">
          <br />
          <h2 className="text-lg font-bold mb-2 text-white">High Scores</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full sm:w-full bg-gray-700 text-white rounded-lg overflow-hidden">
              <thead className="bg-gray-600 bg-opacity-75">
                <tr>
                  <th className="px-1 py-1 sm:py-1 w-1/2 sm:w-1/4 text-left"></th>
                  {header.map((key) => (
                    <th
                      key={key}
                      className="px-1 py-1 sm:py-1 w-1/4 sm:w-1/4 text-left"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(highScores).map((playerKey, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } sm:hover:bg-gray-600`}
                  >
                    <td className="border border-gray-600 px-1 py-1 sm:py-1">
                      {playerKey}
                    </td>
                    {highScores[playerKey].map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className="border border-gray-600 px-1 py-1 sm:py-1"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <div className="flex flex-col items-baseline gap-2">
            <ScrollToTop />
            <BackButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default RuneScapeHighScores;
