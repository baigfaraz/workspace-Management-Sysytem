import {
  Checkbox,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Icon,
  IconButton,
} from "@fluentui/react";
import { Body1, Subtitle1, Subtitle2 } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const AdminProjectsDashboard = () => {
  const { workspaceId } = useParams();
  const {
    getWorkspaceById,
    fetchProjects,
    fetchWorkspaceUsersOfSpecificWorkSpace,
    createProject,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState("");
  const [adminProjects, setAdminProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setLoading(true);
      try {
        const workspace = await getWorkspaceById(workspaceId);
        setWorkspaceName(workspace.workspaceName);
        const projects = await fetchProjects(workspaceId);
        setAdminProjects(projects);
        const usersData = await fetchWorkspaceUsersOfSpecificWorkSpace(workspaceId);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch workspace data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaceData();
  }, [workspaceId, getWorkspaceById, fetchProjects, fetchWorkspaceUsersOfSpecificWorkSpace]);

  const handleCreateProject = async () => {
    if (projectName && selectedUserId && workspaceId) {
      try {
        await createProject({
          projectName,
          workspaceId,
          teamLeadId: selectedUserId,
        });
        alert("Project created successfully");
        setIsCreateProjectModalOpen(false);
        const updatedProjects = await fetchProjects(workspaceId);
        setAdminProjects(updatedProjects);
        setSelectedUserId(null);
        setProjectName("");
      } catch (error) {
        console.error("Failed to create project: ", error);
      }
    }
  };

  // Filter projects and users based on search query
  const filteredProjects = adminProjects.filter(project =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.userId.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Columns for the Projects Table
  const projectColumns = [
    {
      key: "projectName",
      name: "Project Name",
      fieldName: "projectName",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    
    {
      key: "dateAdded",
      name: "Created Date",
      fieldName: "dateAdded",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => new Date(item.dateAdded).toLocaleDateString()
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
          title="Remove Project"
          onClick={() => handleDeleteUser(item._id)}
        />
      ),
    },
    {
      key: "open Project",
      name: "Open Project",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: "OpenFile" }}
            title="Open Project"
            onClick={() => navigate(`/admin-task-view/${item._id}`)}
          />
        </Stack>
      )
    }
  ];

  // Columns for the Users Table
  const userColumns = [
    {
      key: "email",
      name: "Email",
      fieldName: "email",
      minWidth: 200,
      maxWidth: 300,
      isResizable: true,
      onRender: (item) => item.userId.email
    },
    {
      key: "role",
      name: "Role",
      fieldName: "role",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => item.role || "Member"
    },
    {
      key: "dateAdded",
      name: "Date Added",
      fieldName: "dateAdded",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => new Date(item.dateAdded).toLocaleDateString()
    }
  ];

  return (
    <Stack verticalFill className="h-full bg-gray-100" style={{height: "100vh"}}>
      <Header />
      
      {/* Main Content with Side Panel */}
      <Stack horizontal className="h-full" >
        {/* Side Panel */}
        <Stack className="w-64 bg-gray-200 p-4">
          <div
            className={`flex items-center space-x-2 p-3 cursor-pointer ${
              activeTab === "projects" ? "text-blue-600" : "text-black"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            <Icon iconName="ProjectCollection" className="text-l" />
            <Text className="text-sm">Projects</Text>
          </div>

          <div
            className={`flex items-center space-x-2 p-3 cursor-pointer ${
              activeTab === "users" ? "text-blue-600" : "text-black"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Icon iconName="People" className="text-l" />
            <Text className="text-sm">Workspace Members</Text>
          </div>
        </Stack>

        {/* Main Content Area */}
        <Stack className="flex-grow p-6">
          {/* Header with Search and Actions */}
          <Stack
            horizontal
            className="justify-between items-center mb-4"
          >
            <Stack>
              <Text className="text-2xl font-bold">{workspaceName}</Text>
              <Text className="text-sm text-gray-600">
                {activeTab === "projects" ? "All Projects" : "Workspace Members"}
              </Text>
            </Stack>

            {/* Search Box */}
            <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
              <TextField
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(_, newValue) => setSearchQuery(newValue || "")}
                styles={{ root: { width: 200 } }}
              />
              
              {activeTab === "projects" && (
                <PrimaryButton
                  text="+ Create Project"
                  onClick={() => setIsCreateProjectModalOpen(true)}
                  className="bg-blue-500 text-white"
                />
              )}
            </Stack>
          </Stack>

          {/* Content Area */}
          {activeTab === "projects" ? (
            <Stack>
              {filteredProjects.length === 0 ? (
                <Stack
                  horizontalAlign="center"
                  verticalAlign="center"
                  className="min-h-[200px]"
                >
                  <Subtitle2>No Projects found.</Subtitle2>
                  <PrimaryButton
                    text="+ Create New Project"
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    className="mt-4"
                  />
                </Stack>
              ) : (
                <DetailsList
                  items={filteredProjects}
                  columns={projectColumns}
                  selectionMode={SelectionMode.none}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                />
              )}
            </Stack>
          ) : (
            <DetailsList
              items={filteredUsers}
              columns={userColumns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.fixedColumns}
            />
          )}
        </Stack>
      </Stack>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateProjectModalOpen}
        onDismiss={() => setIsCreateProjectModalOpen(false)}
        isBlocking={false}
      >
        <Stack tokens={{ padding: 16 }} styles={{ root: { width: 400 } }}>
          <Text variant="large">Create New Project</Text>
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e, newValue) => setProjectName(newValue || "")}
          />

          <Text variant="medium" block className="my-4">
            Select Team Lead:
          </Text>

          {users.map((user) => (
            <Checkbox
              key={user.userId._id}
              label={user.userId.email}
              checked={selectedUserId === user.userId._id}
              onChange={() => setSelectedUserId(user.userId._id)}
              className="mb-2"
            />
          ))}

          <Stack horizontal tokens={{ childrenGap: 16 }} className="mt-4">
            <PrimaryButton
              text="Create"
              onClick={handleCreateProject}
              disabled={!projectName || !selectedUserId}
            />
            <PrimaryButton
              text="Cancel"
              onClick={() => {
                setIsCreateProjectModalOpen(false);
                setSelectedUserId(null);
                setProjectName("");
              }}
              styles={{ root: { backgroundColor: "#D32F2F", color: "#fff" } }}
            />
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AdminProjectsDashboard;