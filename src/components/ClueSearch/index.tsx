import React, { useState } from "react";
import { BASE_API_URL } from "@/utils/constants";
import Fuse from "fuse.js";
import SingleClue from "@/app/clues/[type]";

type Clue = {
  _id: string;
  name: string;
  type: string;
};

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Clue[]>([]);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return function (...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounce(async (term: string) => {
    try {
      if (term.trim() !== "") {
        const response = await fetch(`${BASE_API_URL}/api/clues/search`, {
          method: "POST",
          body: JSON.stringify({ term }),
        });
        const { clues } = await response.json();

        setSearchResults(clues);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;

    setSearchTerm(term);
    debouncedSearch(term);
  };

  const fuse = new Fuse(searchResults, {
    keys: ["name", "type"],
    isCaseSensitive: false,
    includeMatches: true,
    ignoreLocation: true,
  });

  const fuzzySearchResults = fuse.search(searchTerm);

  return (
    <div>
      <input
        type="text"
        className="border-2 border-gray-400 rounded p-2 w-full text-black"
        placeholder="Search for an item..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm.trim() !== "" && (
        <div>
          <h2>Search Results:</h2>
          {fuzzySearchResults.length > 0 ? (
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-7 gap-4">
                {fuzzySearchResults.map(({ item }: any) => (
                  <SingleClue key={item.name} clue={item} />
                ))}
              </div>
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
