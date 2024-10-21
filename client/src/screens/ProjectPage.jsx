import {
  Checkbox,
  Modal,
  PrimaryButton,
  Stack,
  Text
} from "@fluentui/react";
import { Body1, Subtitle1, Subtitle2 } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const ProjectPage = () => {
  const { workspaceId } = useParams();
  const location = useLocation();
  const { workspaceName } = location.state || {};
  const {
    logout,
    fetchProjectsByTeamLead,
    user,
    fetchWorkspaceUsersOfSpecificWorkSpace,
    assignUsersToProject,
    fetchProjectsByUser,
  } = useAuth();
  const navigate = useNavigate();

  const [teamLeadProjects, setTeamLeadProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // All available users list
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Selected user IDs
  const [selectedProjectId, setSelectedProjectId] = useState(null); // The workspace ID to add users to

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setLoading(true);
      try {
        const projects = await fetchProjectsByTeamLead(workspaceId, user._id);
        setTeamLeadProjects(projects);
        const userProjects = await fetchProjectsByUser();
        setUserProjects(userProjects);
      } catch (error) {
        console.error("Failed to fetch workspace data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaceData();
  }, [workspaceId, fetchProjectsByTeamLead , fetchProjectsByUser]);

  // Fetch users when the "Add Users" modal opens
  const handleOpenAddUsersModal = async (projectId) => {
    setSelectedProjectId(projectId); // Set the workspace ID to add users to
    setIsAddUsersModalOpen(true);
    const fetchedUsers = await fetchWorkspaceUsersOfSpecificWorkSpace(
      workspaceId
    ); // Fetch users from backend
    console.log("fetchedUsers", fetchedUsers);
    setUsers(fetchedUsers); // Store users in the state
  };

  // Function to handle user selection via checkboxes
  const handleUserSelection = (userId, isChecked) => {
    console.log("userId" , userId);
    if (isChecked) {
      setSelectedUserIds((prevSelected) => [...prevSelected, userId]); // Add user ID to selected list
    } else {
      setSelectedUserIds((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      ); // Remove user ID from selected list
    }
  };

  const handleAddMembersInProject = async () => {
    if (selectedUserIds.length > 0) {
      try {
        await assignUsersToProject(selectedProjectId, selectedUserIds);
        alert("Users added successfully");
        setIsAddUsersModalOpen(false); // Close the modal after adding
        setSelectedUserIds([]); // Reset selected users
        setSelectedProjectId(null); // Reset selected workspace
      } catch (error) {
        console.error("Error adding users: ", error);
      }
    } else {
      console.log("No users selected");
    }
  };

  return (
    <Stack verticalFill>
      <Header />
      <Subtitle1 variant="xxLarge" block>
        {workspaceName}
      </Subtitle1>
      <Subtitle2>Projects to Lead</Subtitle2>
      <Stack tokens={{ padding: 16 }} horizontalAlign="center">
        <Stack
          horizontal
          horizontalAlign="start"
          verticalAlign="center"
          tokens={{ childrenGap: 16 }}
          style={{ width: "100%" }}
        ></Stack>

        {loading ? (
          <Text>Loading...</Text> // Add loading indicator
        ) : teamLeadProjects.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ minHeight: "200px" }}
          >
            <Subtitle2 >
              No Projects where you are team lead.
            </Subtitle2>
          </Stack>
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
            {teamLeadProjects.map((project) => (
              <Stack
                key={project._id}
                tokens={{ padding: 16, childrenGap: 8 }}
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  minWidth: "200px",
                }}
              >
                <Subtitle2 variant="large" block>
                  {project.projectName}
                </Subtitle2>
                <Body1 variant="small" block>
                  Created on: {new Date(project.dateAdded).toLocaleDateString()}
                </Body1>
                <PrimaryButton
                  text="Open Project"
                  onClick={() => {
                    navigate(`/home/assigned-tasks/${project._id}`, {
                      state: { projectName: project.projectName },
                    });
                  }}
                />
                <PrimaryButton
                  text="Add Members"
                  onClick={() => handleOpenAddUsersModal(project._id)}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
      <Subtitle2>Members in Projects</Subtitle2>
      <Stack tokens={{ padding: 16 }} horizontalAlign="center">
        <Stack
          horizontal
          horizontalAlign="start"
          verticalAlign="center"
          tokens={{ childrenGap: 16 }}
          style={{ width: "100%" }}
        ></Stack>

        {loading ? (
          <Text>Loading...</Text> // Add loading indicator
        ) : userProjects.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ minHeight: "200px" }}
          >
            <Subtitle2 >
              No Projects where you are a member.
            </Subtitle2>
          </Stack>
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
            {userProjects.map((project) => (
              <Stack
                key={project._id}
                tokens={{ padding: 16, childrenGap: 8 }}
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  minWidth: "200px",
                }}
              >
                <Subtitle2 variant="large" block>
                  {project.projectName}
                </Subtitle2>
                <Body1 variant="small" block>
                  Created on: {new Date(project.dateAdded).toLocaleDateString()}
                </Body1>
                <PrimaryButton text="Open Project" onClick={() => {
                  navigate(`/home/workspace/project/${project._id}`, {
                    state: { projectName: project.projectName },
                  });
                }} />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
      {/* Modal for creating a new project */}
      <Modal
        isOpen={isAddUsersModalOpen}
        onDismiss={() => {
          setIsAddUsersModalOpen(false);
          setSelectedUserIds([]); // Reset selected users on dismiss
        }} // Close modal on dismiss
        isBlocking={false}
      >
        <Stack tokens={{ padding: 16 }} styles={{ root: { width: 400 } }}>
          <Text variant="xLarge" block>
            Add Members
          </Text>
          <Stack tokens={{ childrenGap: 8 }}>
            {users.map((user) => (
              <Checkbox
              styles={{ root: { marginTop: 8 } }}
                key={user._id}
                label={user.userId.email}
                checked={selectedUserIds.includes(user.userId._id)}
                onChange={(e, isChecked) =>
                  handleUserSelection(user.userId._id, isChecked)
                }
              />
            ))}
          </Stack>
          <Stack
            horizontal
            horizontalAlign="space-between"
            tokens={{ childrenGap: 8, padding: 10 }}
          >
            <PrimaryButton
              text="Add Members"
              onClick={handleAddMembersInProject} // Handle adding users to workspace
            />
            <PrimaryButton
              text="Cancel"
              onClick={() => {
                // Close modal on cancel and reset selected users
                setIsAddUsersModalOpen(false);
                setSelectedUserIds([]);
              }} // Close modal on cancel and reset selected users
            />
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default ProjectPage;
