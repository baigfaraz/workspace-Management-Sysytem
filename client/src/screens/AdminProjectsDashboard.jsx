import {
  Checkbox,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  TextField
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
  const [users, setUsers] = useState([]); // For storing all users
  const [selectedUserId, setSelectedUserId] = useState(null); // Store selected team lead
  const [projectName, setProjectName] = useState(""); // Store project name
  const [loading, setLoading] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setLoading(true);
      try {
        const workspace = await getWorkspaceById(workspaceId);
        setWorkspaceName(workspace.workspaceName);
        const projects = await fetchProjects(workspaceId);
        setAdminProjects(projects);
        const usersData = await fetchWorkspaceUsersOfSpecificWorkSpace(
          workspaceId
        ); 
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch workspace data: ", error);
      } finally {
        setLoading(false);
      }
    };
      fetchWorkspaceData();
  }, [
    workspaceId,
    getWorkspaceById,
    fetchProjects,
    fetchWorkspaceUsersOfSpecificWorkSpace,
    adminProjects,
  ]);

  // Handle the creation of the project
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

  

  return (
    <Stack verticalFill>
      <Header />
      <Stack tokens={{ padding: 16 }} horizontalAlign="center">
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          tokens={{ childrenGap: 16 }}
          style={{ width: "100%" }}
        >
          <Subtitle1 variant="xxLarge" block>
            {workspaceName}
          </Subtitle1>
          {adminProjects.length > 0 && (
            <PrimaryButton
              text="+ Create New Project"
              onClick={() => setIsCreateProjectModalOpen(true)} // Open the modal
            />
          )}
        </Stack>
        {adminProjects.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ minHeight: "200px" }}
          >
            <Subtitle2>
              No Projects found.
            </Subtitle2>
            <PrimaryButton
              text="+ Create New Project"
              onClick={() => setIsCreateProjectModalOpen(true)} // Open the modal
              style={{ marginTop: "16px" }}
            />
          </Stack>
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
            {adminProjects.map((project) => (
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
                    navigate(`/admin-task-view/${project._id}`),{
                    state:{projectName: project.projectName , projectLead: project.teamLeadId.email}}
                  }
                    // Handle navigation to project page
                  }
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Modal for creating a new project */}
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

          <Text variant="medium" block style={{ margin: "16px 0 8px" }}>
            Select Team Lead:
          </Text>

          {/* Render checkboxes for each user */}
          {users.map((user) => (
            <Checkbox
            styles={{ root: { marginBottom: 8 } }}
              key={user._id}
              label={user.userId.email}
              checked={selectedUserId === user.userId._id}
              onChange={() => setSelectedUserId(user.userId._id)}
            />
          ))}

          <Stack
            horizontal
            tokens={{ childrenGap: 16 }}
            style={{ marginTop: 16 }}
          >
            <PrimaryButton
              text="Create"
              onClick={handleCreateProject}
              disabled={!projectName || !selectedUserId} // Disable if no name or team lead is selected
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
