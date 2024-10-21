import React from "react";
import { CommandBar } from "@fluentui/react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();

  const commandBarItems = [
    {
      key: "codefest",
      text: "CodeFest",
      disabled: true, // Disable if you don't want it to be interactive.
      iconProps: { iconName: "" }, // No icon for this item.
    },
  ];

  const farCommandBarItems = [
    {
      key: "logout",
      text: "Logout",
      iconProps: { iconName: "SignOut" },
      onClick: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout failed: ", error);
        }
      },
    },
  ];

  return (
    <CommandBar
      items={commandBarItems} // Items on the left (CodeFest)
      farItems={farCommandBarItems} // Items on the right (Logout)
      styles={{
        root: { padding: "10px 20px", backgroundColor: "#f3f2f1" }, // Add padding and background style if needed.
      }}
    />
  );
};

export default Header;
