import React, { useState, useRef } from "react";
import { IconButton, Persona, PersonaSize, Stack, Text, Callout, DirectionalHint } from "@fluentui/react";
import { useAuth } from "../context/AuthContext";
import { mergeStyles } from "@fluentui/merge-styles";

// Tailwind and Fluent UI styles
const headerContainerClass = mergeStyles('w-full bg-gray-200');
const projectNameClass = mergeStyles('text-lg font-semibold text-gray-700');
const calloutBoxClass = mergeStyles('p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64');
const profileIconButtonClass = mergeStyles('text-blue-600');

// Header component
const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const iconButtonRef = useRef(null); // Reference to anchor the Callout

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <div className={headerContainerClass}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" padding="10px 20px">
        {/* Left side: Project name */}
        <Text className={projectNameClass}>Team Management System</Text>

        {/* Right side: Profile Icon */}
        <div ref={iconButtonRef} className="relative">
          <IconButton
            iconProps={{ iconName: "Contact" }}
            className={profileIconButtonClass}
            onClick={toggleMenu}
          />
          {isMenuVisible && (
            <Callout
              className={calloutBoxClass}
              target={iconButtonRef.current}
              onDismiss={toggleMenu}
              setInitialFocus
              directionalHint={DirectionalHint.bottomRightEdge} // Open below the icon
            >
              {/* User Information */}
              <Stack tokens={{ childrenGap: 10 }} className="text-center">
                <Persona
                  text={user?.username || "Username"}
                  secondaryText={user?.email || "Email"}
                  size={PersonaSize.size40}
                  hidePersonaDetails={false}
                  imageAlt="User profile"
                />
                {/* Logout Button */}
                <button
                  className="w-full mt-8 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </Stack>
            </Callout>
          )}
        </div>
      </Stack>
    </div>
  );
};

export default Header;
