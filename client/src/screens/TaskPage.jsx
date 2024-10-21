import { Dropdown, Modal, PrimaryButton, Stack, Text } from "@fluentui/react";
import { Body1, Subtitle1, Subtitle2 } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const TaskPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const { projectName } = location.state || {};
  const {
    logout,
    fetchTasksByUser,
    user,
    updateTaskStatus,
    updateTaskEstimatedTime,
  } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  // Task status options
  const statusOptions = [
    { key: "Not Started", text: "Not Started" },
    { key: "In Progress", text: "In Progress" },
    { key: "Completed", text: "Completed" },
  ];

  // Estimated time options (for example, in hours)
  const estimatedTimeOptions = [
    { key: "1", text: "1 Hour" },
    { key: "2", text: "2 Hours" },
    { key: "4", text: "4 Hours" },
    { key: "8", text: "8 Hours" },
  ];

  // Fetch all tasks in the project
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await fetchTasksByUser(projectId, user._id);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, fetchTasksByUser]);

  const handleOpenTaskDetailsModal = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setSelectedTask(task);
    setSelectedStatus(task.taskStatus); // Set initial status
    setEstimatedTime(task.estimatedTime || ""); // Set initial estimated time
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = async () => {
    try {
      if (selectedTask) {
        // Update task status
        if (selectedStatus) {
          console.log("Updating task status:", selectedStatus);
          await updateTaskStatus(selectedTask._id, selectedStatus);
        }
        // Update estimated time if provided
        if (estimatedTime) {
          await updateTaskEstimatedTime(selectedTask._id, estimatedTime);
        }
        // Optionally, refetch tasks or update the state
        const updatedTasks = await fetchTasksByUser(projectId, user._id);
        setTasks(updatedTasks);
      }
      handleCloseModal(); // Close the modal after updating
    } catch (error) {
      console.error("Failed to update task:", error);
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
            {projectName || "Project Tasks"}
          </Subtitle1>
        </Stack>

        {/* Show loading or task list */}
        {loading ? (
          <Text>Loading...</Text> // Add loading indicator
        ) : tasks.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ minHeight: "200px" }}
          >
            <Subtitle2>No Assigned tasks yet!</Subtitle2>
          </Stack>
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
            {tasks.map((task) => (
              <Stack
                key={task._id}
                tokens={{ padding: 16, childrenGap: 8 }}
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  minWidth: "200px",
                }}
              >
                <Subtitle2 variant="large" block>
                  Task Name: {task.taskName}
                </Subtitle2>
                <Body1 variant="medium" block>
                  Status: {task.taskStatus}
                </Body1>
                <Body1 variant="small" block>
                  Created on: {new Date(task.dateCreated).toLocaleDateString()}
                </Body1>
                <PrimaryButton
                  text="Open Task"
                  onClick={() => handleOpenTaskDetailsModal(task._id)}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Modal for task details */}
      {selectedTask && (
        <Modal
          isOpen={isModalOpen}
          onDismiss={handleCloseModal}
          isBlocking={false}
        >
          <Stack tokens={{ padding: 16 }}>
            <Text
              variant="large"
              style={{ marginBottom: "8px", fontWeight: "bold" }}
            >
              Task Details
            </Text>
            <Text variant="medium">Name: {selectedTask.taskName}</Text>
            <Text variant="medium">
              Description: {selectedTask.description}
            </Text>
            <Text variant="medium">
              Estimated Time: {selectedTask.estimatedTime} hour
            </Text>
            <Text variant="medium">Progress: {selectedTask.taskStatus}</Text>
            {selectedTask.taskStatus !== "Completed" && (
              <Dropdown
                selectedKey={selectedStatus}
                placeholder="Select status"
                label="Set Status"
                options={statusOptions}
                onChange={(_, option) => setSelectedStatus(option.key)}
              />
            )}
            {selectedTask.estimatedTime === 0 && (
              <Dropdown
                selectedKey={estimatedTime}
                placeholder="Select Estimated time"
                label="Set estimated Time"
                options={estimatedTimeOptions}
                onChange={(_, option) => setEstimatedTime(option.key)}
              />
            )}

            <Stack
              horizontal
              horizonatAlign="space-between"
              tokens={{ childrenGap: 16, padding: 16 }}
            >
              <PrimaryButton text="Update Task" onClick={handleUpdateTask} />
              <PrimaryButton text="Close" onClick={handleCloseModal} />
            </Stack>
          </Stack>
        </Modal>
      )}

      {/* ChatBox Component */}
      <ChatBox projectId={projectId} />
    </Stack>
  );
};

export default TaskPage;
