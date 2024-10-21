import {
  CommandBar,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  Modal,
  TextField,
  Checkbox,
} from "@fluentui/react";
import { Subtitle1 , Subtitle2 , Body1} from "@fluentui/react-components";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const AdminDashboard = () => {
  const {
    adminWorkspaces,
    fetchAdminWorkspaces,
    user,
    logout,
    createWorkspace,
    fetchUsers,
    addUsersToWorkspace,
  } = useAuth();
  const navigate = useNavigate();

  // States for controlling modals and managing input values
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // All available users list
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Selected user IDs
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null); // The workspace ID to add users to

  // Fetch admin workspaces created by the admin when the component mounts
  useEffect(() => {
    if (user) {
      fetchAdminWorkspaces();
    }
  }, [user]);

  // Fetch users when the "Add Users" modal opens
  const handleOpenAddUsersModal = async (workspaceId) => {
    setSelectedWorkspaceId(workspaceId); // Set the workspace ID to add users to
    setIsAddUsersModalOpen(true);
    const fetchedUsers = await fetchUsers(); // Fetch users from backend
    setUsers(fetchedUsers); // Store users in the state
  };

  // Function to handle workspace creation logic
  const handleCreateWorkspace = () => {
    if (workspaceName.trim()) {
      createWorkspace(workspaceName);
      setIsCreateWorkspaceModalOpen(false);
      setWorkspaceName(""); // Reset the field
    }
  };

  // Function to handle user selection via checkboxes
  const handleUserSelection = (userId, isChecked) => {
    if (isChecked) {
      setSelectedUserIds((prevSelected) => [...prevSelected, userId]); // Add user ID to selected list
    } else {
      setSelectedUserIds((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      ); // Remove user ID from selected list
    }
  };

  // Function to handle adding users to the workspace
  const handleAddUsersToWorkspace = async () => {
    if (selectedUserIds.length > 0) {
      try {
        console.log("workspaceId: ", selectedWorkspaceId);
        await addUsersToWorkspace(selectedWorkspaceId, selectedUserIds);
        console.log("Users added successfully");
        //alert("Users added successfully");
        alert("Users added successfully");
        setIsAddUsersModalOpen(false); // Close the modal after adding
        setSelectedUserIds([]); // Reset selected users
        setSelectedWorkspaceId(null); // Reset selected workspace
      } catch (error) {
        console.error("Error adding users: ", error);
      }
    } else {
      console.log("No users selected");
    }
  };

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
          <Subtitle1>Workspaces</Subtitle1>
          {adminWorkspaces.length > 0 && (
            <PrimaryButton
              text="+ Create New Workspace"
              onClick={() => setIsCreateWorkspaceModalOpen(true)} // Open the modal
            />
          )}
        </Stack>

        {/* Workspaces Display */}
        {adminWorkspaces.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ minHeight: "200px" }}
          >
            <Subtitle2>
              No adminWorkspaces found.
            </Subtitle2>
            <PrimaryButton
              text="+ Create New Workspace"
              onClick={() => setIsCreateWorkspaceModalOpen(true)} // Open the modal
              style={{ marginTop: "16px" }}
            />
          </Stack>
        ) : (
          <Stack 
            horizontal 
            horizontalAlign="start"
            verticalAlign="top"
            tokens={{ childrenGap: 16 }} wrap>
            {adminWorkspaces.map((workspace) => (
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
                    navigate(`/admin-projects-dashboard/${workspace._id}`)
                  } // Pass the workspace ID to the route
                />
                <PrimaryButton
                  text="Add Users"
                  onClick={() => handleOpenAddUsersModal(workspace._id)} // Open the Add Users modal and pass workspace ID
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Modal for Creating New Workspace */}
      <Modal
        isOpen={isCreateWorkspaceModalOpen}
        onDismiss={() => setIsCreateWorkspaceModalOpen(false)} // Close modal on dismiss
        isBlocking={false}
      >
        <Stack tokens={{ padding: 16 }} styles={{ root: { width: 400 } }}>
          <Text variant="xLarge" block>
            Create New Workspace
          </Text>
          <TextField
            label="Workspace Name"
            value={workspaceName}
            onChange={(e, newValue) => setWorkspaceName(newValue || "")} // Handle input change
          />
          <Stack
            horizontal
            horizontalAlign="space-between"
            tokens={{ childrenGap: 8, padding: 10 }}
          >
            <PrimaryButton
              text="Create Workspace"
              onClick={handleCreateWorkspace}
            />
            <PrimaryButton
              text="Cancel"
              onClick={() => setIsCreateWorkspaceModalOpen(false)} // Close modal on cancel
            />
          </Stack>
        </Stack>
      </Modal>

      {/* Modal for Adding Users to Workspace */}
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
            Add Users to Workspace
          </Text>
          <Stack tokens={{ childrenGap: 8 }}>
            {users.map((user) => (
              <Checkbox
                key={user._id}
                label={user.email}
                checked={selectedUserIds.includes(user._id)}
                onChange={(e, isChecked) =>
                  handleUserSelection(user._id, isChecked)
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
              text="Add Users"
              onClick={handleAddUsersToWorkspace} // Handle adding users to workspace
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

export default AdminDashboard;
