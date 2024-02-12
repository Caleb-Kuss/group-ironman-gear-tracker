"use client";
import { useSession } from "next-auth/react";
import useCheckUserGroupMembership from "../../hooks/useCheckUserGroupMembership";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

type User = {
  username: string;
  selectedColor: string;
};

function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const clan = useCheckUserGroupMembership(session);
  const [username, setUsername] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/groups/usersGroup/`, {
          method: "POST",
          body: JSON.stringify(session?.user?.name),
        });

        const { data } = await response.json();

        if (!response.ok) {
          console.error(`Server error: ${response.status} - ${data.error}`);
          return;
        }

        setUsername(data);
      } catch (error) {
        console.error("Error fetching user settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [session?.user?.name]);

  if (session) {
    return loading ? (
      <Loader />
    ) : (
      <div className="bg-gray-900 p-4 text-white min-h-screen flex flex-col items-center shadow-lg">
        <div className="flex-grow my-10 text-center">
          {clan ? (
            <>
              <h1 className="mb-4 text-center text-xl text-white">
                See your clan members and their color identifiers below.
              </h1>
              <br />
              <div className="grid grid-cols-2 gap-4">
                {username &&
                  username.map((user) => (
                    <div key={user.username} className="flex items-center">
                      <p>{user.username}</p>
                      <div
                        className="ml-4 rounded-full"
                        style={{
                          backgroundColor: user.selectedColor,
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <h1 className="font-bold">Join a clan to get started</h1>
          )}
        </div>
      </div>
    );
  } else {
    <div className="bg-gray-900 p-4 text-white min-h-screen flex flex-col items-center shadow-lg">
      <div className="text-center">
        <p className="font-bold">
          Welcome to the OSRS Group Iron Man gear tracker.
        </p>
        <p className="font-bold">
          This is a very simple tracker for your team.
        </p>
        <p className="font-bold">
          Please sign in then join a group to get started.
        </p>
      </div>
    </div>;
  }
}

export default Home;
