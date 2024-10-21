import {
  PrimaryButton,
  Stack
} from "@fluentui/react";
import { Body1, Subtitle1, Subtitle2 } from "@fluentui/react-components";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { fetchUserWorkspaces, user, logout, userWorkspaces } = useAuth();
  const navigate = useNavigate();

  // Fetch admin workspaces created by the admin when the component mounts
  useEffect(() => {
    if (user) {
      fetchUserWorkspaces();
    }
  }, [user]);

  return (
    <Stack verticalFill>
      {/* Navbar */}
      <Header />

      {/* Main Content */}
      <Stack tokens={{ padding: 16 }} horizontalAlign="center">
        {/* Header Section */}
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          tokens={{ childrenGap: 16 }}
          style={{ width: "100%" }}
        >
          <Subtitle1 variant="xxLarge" block>
            Available Workspaces
          </Subtitle1>
        </Stack>

        {/* Workspaces Display */}
        {userWorkspaces.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ minHeight: "200px" }}
          >
            <Subtitle2>
              No Workspace availaible.
            </Subtitle2>
          </Stack>
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
            {userWorkspaces.map((workspace) => (
              <Stack
                key={workspace._id}
                tokens={{ padding: 16, childrenGap: 8 }}
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  minWidth: "200px",
                }}
              >
                <Subtitle2 variant="large" block>
                  {workspace.workspaceName}
                </Subtitle2>
                <Body1 variant="small" block>
                  Created on:{" "}
                  {new Date(workspace.dateCreated).toLocaleDateString()}
                </Body1>
                <PrimaryButton
                  text="Open Workspace"
                  onClick={() =>
                    navigate(`/home/projects/${workspace._id}`, {
                      state: { workspaceName: workspace.workspaceName },
                    })
                  }
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default HomePage;
