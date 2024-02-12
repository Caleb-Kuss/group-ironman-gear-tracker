"use client";
import React, { useState, useEffect } from "react";
import { TwitterPicker } from "react-color";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import BackButton from "@/components/backButton";

const SettingsPage = () => {
  const { data: session } = useSession();

  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch(
          `/api/users/userSettings/${session?.user?.name}`
        );
        const { result } = await response.json();

        if (response.ok) {
          setUsername(result.username);
          setSelectedColor(result.selectedColor);
        } else {
          console.error("Error fetching user settings:", result.error);
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [session?.user?.name]);

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
    setShowColorPicker(false);
  };

  const handleSelectColorClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!username.trim()) {
      console.error("Username cannot be empty");
      setUsernameError("Username cannot be empty");
      return;
    }
    const response = await fetch("/api/users/userSettings", {
      method: "POST",
      body: JSON.stringify({
        name: session?.user?.name,
        username,
        selectedColor,
      }),
    });
    const data = await response.json();

    window.location.reload();
    return data.userClues;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-900 p-4 text-white min-h-screen flex  justify-center">
      <div>
        <br />
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <form onSubmit={handleSubmit}>
          {" "}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              className="border p-2 text-black"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select your color
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleSelectColorClick}
              >
                Select Color
              </button>
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <TwitterPicker
                    color={selectedColor}
                    onChange={handleColorChange}
                  />
                </div>
              )}
              {selectedColor && (
                <>
                  <span className="ml-4">Current Color</span>
                  <div
                    className="color-box ml-4 rounded-full"
                    style={{
                      backgroundColor: selectedColor,
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </form>
        <br />
        <BackButton />
      </div>
    </div>
  );
};

export default SettingsPage;
