import {
  PrimaryButton,
  Stack,
  Text,
  Modal,
  TextField,
  IconButton,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Checkbox,
  Icon,
} from "@fluentui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const AdminDashboard = () => {
  const {
    adminWorkspaces,
    fetchAdminWorkspaces,
    user,
    createWorkspace,
    fetchUsers,
    addUsersToWorkspace,
    deleteWorkSpaceById,
    deleteUserById,
  } = useAuth();
  const navigate = useNavigate();

  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] =
    useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchAdminWorkspaces();
      handleFetchUsers();
    }
  }, [user]);

  const handleFetchUsers = async () => {
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
  };

  const handleCreateWorkspace = () => {
    if (workspaceName.trim()) {
      createWorkspace(workspaceName);
      setIsCreateWorkspaceModalOpen(false);
      setWorkspaceName("");
    }
  };

  const handleUserSelection = (userId, isChecked) => {
    if (isChecked) {
      setSelectedUserIds((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedUserIds((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  const handleAddUsersToWorkspace = async () => {
    if (selectedUserIds.length > 0) {
      try {
        await addUsersToWorkspace(selectedWorkspaceId, selectedUserIds);
        alert("Users added successfully");
        setIsAddUsersModalOpen(false);
        setSelectedUserIds([]);
        setSelectedWorkspaceId(null);
      } catch (error) {
        console.error("Error adding users: ", error);
      }
    } else {
      console.log("No users selected");
    }
  };

  const filteredWorkspaces = adminWorkspaces.filter((workspace) =>
    workspace.workspaceName.toLowerCase().includes(searchQuery)
  );

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery)
  );

  const handleDeleteWorkspace = async (workspaceId) => {
    await deleteWorkSpaceById(workspaceId);
    await fetchAdminWorkspaces();
    alert("Workspace deleted successfully");
  };

  const handleDeleteUser = async (userId) => {
    await deleteUserById(userId);
    handleFetchUsers();
    alert("User deleted successfully");
  };

  // Columns for the Workspaces Table
  const workspaceColumns = [
    {
      key: "name",
      name: "Workspace Name",
      fieldName: "workspaceName",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "createdAt",
      name: "Created At",
      fieldName: "dateCreated",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => new Date(item.dateCreated).toLocaleDateString(),
    },
    {
      key: "addMember",
      name: "Add Members",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "Add" }}
          title="Add Members"
          onClick={() => {
            setIsAddUsersModalOpen(true);
            setSelectedWorkspaceId(item._id);
          }}
        />
      ),
    },
    {
      key: "removeWorkspace",
      name: "Actions",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "Delete" }}
          title="Remove Workspace"
          onClick={() => handleDeleteWorkspace(item._id)}
        />
      ),
    },
    {
      key: "openworkspace",
      name: "Open Workspace",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "FabricOpenFolderHorizontal" }} // Updated icon name
          title="Open Workspace"
          onClick={() => navigate(`/admin-projects-dashboard/${item._id}`)}
        />
      ),
    },
  ];

  // Columns for the Users Table
  const userColumns = [
    {
      key: "username",
      name: "Username",
      fieldName: "username",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "email",
      name: "Email",
      fieldName: "email",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "createdAt",
      name: "Created At",
      fieldName: "createdAt",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "Delete" }}
          title="Remove User"
          onClick={() => handleDeleteUser(item._id)}
        />
      ),
    },
  ];

  return (
    <Stack className="h-full bg-gray-100" style={{ height: "100vh" }}>
      {/* Navbar */}
      <Header />

      {/* Main Content with Full-Height Side Panel */}
      <Stack horizontal className="h-full">
        {/* Side Panel */}
        <Stack className="w-64 bg-gray-200 p-4">
          <div
            className={`flex items-center space-x-2 p-3 cursor-pointer ${
              activeTab === "users" ? "text-blue-600" : "text-black"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Icon iconName="People" className="text-l" />
            <Text className="text-sm">Active Users</Text>
          </div>

          <div
            className={`flex items-center space-x-2 p-3 cursor-pointer ${
              activeTab === "workspaces" ? "text-blue-600" : "text-black"
            }`}
            onClick={() => setActiveTab("workspaces")}
          >
            <Icon iconName="FabricFolderFill" className="text-l" />
            <Text className="text-sm">Active Workspaces</Text>
          </div>
        </Stack>

        {/* Main Content Area */}
        <Stack className="flex-grow p-6">
          {/* Search Bar and Create Project Button */}
          <Stack horizontal className="justify-between items-center mb-4">
            <Text className="text-xl font-bold">
              {activeTab === "workspaces"
                ? "All Workspaces"
                : "All Registered Users"}
            </Text>
            <Stack horizontal className="gap-4">
              <TextField
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(_, newValue) => setSearchQuery(newValue || "")}
                styles={{ root: { width: 200 } }}
              />

              {activeTab === "workspaces" && (
                <PrimaryButton
                  text="+ Create Workspace"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsCreateWorkspaceModalOpen(true)}
                />
              )}
            </Stack>
          </Stack>

          {/* Display Users or Workspaces in a Table */}
          <Stack className="overflow-auto ">
            {activeTab === "users" ? (
              filteredUsers.length === 0 ? (
                <Text>No users found.</Text>
              ) : (
                <DetailsList
                  items={filteredUsers}
                  columns={userColumns}
                  selectionMode={SelectionMode.none}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                />
              )
            ) : filteredWorkspaces.length === 0 ? (
              <Text>No workspaces found.</Text>
            ) : (
              <DetailsList
                items={filteredWorkspaces}
                columns={workspaceColumns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                onClick={(item) =>
                  navigate(`/admin-projects-dashboard/${item._id}`)
                }
              />
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Modal for Creating New Workspace */}
      <Modal
        isOpen={isCreateWorkspaceModalOpen}
        onDismiss={() => setIsCreateWorkspaceModalOpen(false)}
        isBlocking={false}
      >
        <Stack className="p-6 w-96">
          <Text className="text-2xl font-bold">Create New Workspace</Text>
          <TextField
            label="Workspace Name"
            value={workspaceName}
            onChange={(e, newValue) => setWorkspaceName(newValue)}
            required
          />
          <Stack horizontal className="mt-4 justify-between">
            
            <PrimaryButton
              text="Cancel"
              onClick={() => setIsCreateWorkspaceModalOpen(false)}
              />
              <PrimaryButton
              text="Create"
              onClick={handleCreateWorkspace}
            />
          </Stack>
        </Stack>
      </Modal>

      {/* Modal for Adding Users to Workspace */}
      <Modal
        isOpen={isAddUsersModalOpen}
        onDismiss={() => setIsAddUsersModalOpen(false)}
        isBlocking={false}
      >
        <Stack className="p-6 w-96">
          <Text className="text-2xl font-bold mb-2">Add Users to Workspace</Text>

          {users.map((user) => (
            <Checkbox
              label={user.email}
              key={user._id}
              onChange={(e, checked) => handleUserSelection(user._id, checked)}
              className="mb-2"
            />
          ))}

          <PrimaryButton
            text="Add Users"
            onClick={handleAddUsersToWorkspace}
            className="mt-4 bg-blue-500 text-white"
          />
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AdminDashboard;
