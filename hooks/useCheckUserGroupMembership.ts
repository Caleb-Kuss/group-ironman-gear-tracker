// hooks/useCheckUserGroupMembership.js
"use client";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

function useCheckUserGroupMembership(session: Session | null) {
  const [clan, setClan] = useState(false);

  useEffect(() => {
    const checkUserGroupMembership = async () => {
      if (session) {
        try {
          const usersName = session.user?.name;
          const requestBody = JSON.stringify({ name: usersName });
          const response = await fetch(`/api/users/${usersName}`, {
            method: "POST",
            body: requestBody,
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (data.user.groupName) {
              setClan(true);
            } else {
              setClan(false);
            }
          }
        } catch (error) {
          console.error("Error checking group membership:", error);
        }
      }
    };

    checkUserGroupMembership();
  }, [session]);

  return clan;
}

export default useCheckUserGroupMembership;
