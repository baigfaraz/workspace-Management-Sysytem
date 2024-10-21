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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const LeadAssignedTasks = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const { projectName } = location.state || {};
  const { logout, getAllTasksInProject, getProjectMembers, assignTask, getTaskById } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAssignTaskModalOpen, setisAssignTaskModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // All available users list
  const [selectedUserId, setSelectedUserId] = useState(null); // Selected user ID
  const [taskName, setTaskName] = useState(""); // Task name
  const [taskDescription, setTaskDescription] = useState(""); // Task description
  const [selectedTask, setSelectedTask] = useState(null); // Task details


  // Fetch all tasks in the project
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getAllTasksInProject(projectId);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, getAllTasksInProject]);

  const handleOpenAssignTaskModal = async () => {
    setisAssignTaskModalOpen(true);
    const fetchedUsers = await getProjectMembers(projectId);
    setUsers(fetchedUsers);
  };

  const handleAssignTask = async () => {
    try {
      // Check if all required fields are provided
      if (taskName && taskDescription && selectedUserId && projectId) {
        // Log the values to verify they are correct before assignment
        console.log("Assigning task with details: ", {
          taskName,
          description: taskDescription,
          projectId,
          assignedTo: selectedUserId, // This should be the user ID
        });
  
        // Call the assignTask function
        const assignedTask = await assignTask({
          taskName,
          description: taskDescription, // Ensure the variable name is correct
          projectId,
          assignedTo: selectedUserId, // This should be the user ID
        });
  
        // Notify the user of success
        alert("Task assigned successfully");
  
        // Close the modal and reset states
        setisAssignTaskModalOpen(false);
  
        // Fetch the updated task list
        const updatedTasks = await getAllTasksInProject(projectId);
        setTasks(updatedTasks);
  
        // Reset input fields and selected user
        setSelectedUserId(null);
        setTaskName("");
        setTaskDescription("");
      } else {
        // Provide feedback if any required field is missing
        alert("Please fill in all fields.");
      }
    } catch (error) {
      console.error("Failed to assign task: ", error);
      alert("An error occurred while assigning the task. Please try again.");
    }
  };
  

  const handleOpenTaskDetailsModal = async (taskId) => {
    setIsTaskDetailsModalOpen(true);
    try {
      const taskData = await getTaskById(taskId);
      setSelectedTask(taskData);
    } catch (error) {
      console.error("Error fetching task details:", error);
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
          <PrimaryButton
            text="+ Assign Task"
            onClick={handleOpenAssignTaskModal}
          />
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
            <Subtitle2>
              No Assigned tasks yet!
            </Subtitle2>
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
                  Task Name : {task.taskName}
                </Subtitle2>
                <Body1 variant="medium" block>
                  Status : {task.taskStatus}
                </Body1>
                <Body1 variant="small" block>
                  Created on :{" "}
                  {new Date(task.dateCreated).toLocaleDateString()}
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

      {/* Modal for assigning task */}
      <Modal
        isOpen={isAssignTaskModalOpen}
        onDismiss={() => {
          setisAssignTaskModalOpen(false);
          setSelectedUserId(null);
          setTaskName("");
          setTaskDescription("");
        }}
        isBlocking={false}
      >
        <Stack tokens={{ padding: 16 }} styles={{ root: { width: 400 } }}>
          <Text variant="xLarge">Assign Task</Text>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e, newValue) => setTaskName(newValue || "")}
          />
          <TextField
            label="Task Description"
            value={taskDescription}
            onChange={(e, newValue) => setTaskDescription(newValue || "")}
          />

          <Text variant="medium" block style={{ margin: "16px 0 8px" }}>
            Assign To:
          </Text>

          {/* Render checkboxes for each user */}
          {users.map((user) => (
            <Checkbox
            styles={{ root: { marginTop: 8 } }}
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
              text="Assign"
              onClick={handleAssignTask}
              disabled={!taskName || !taskDescription || !selectedUserId}
            />
            <PrimaryButton
              text="Cancel"
              onClick={() => {
                setisAssignTaskModalOpen(false);
                setSelectedUserId(null);
                setTaskName("");
                setTaskDescription("");
              }}
              styles={{ root: { backgroundColor: "#D32F2F", color: "#fff" } }}
            />
          </Stack>
        </Stack>
      </Modal>

      {/* Modal for viewing task details */}
      <Modal
        isOpen={isTaskDetailsModalOpen}
        onDismiss={() => {
          setIsTaskDetailsModalOpen(false);
          setSelectedTask(null);
        }}
        isBlocking={false}
      >
        <Stack tokens={{ padding: 16 }} styles={{ root: { width: 400 } }}>
          <Text variant="xLarge">Task Details</Text>
          {selectedTask ? (
            <>
              <Text variant="large">Task Name: {selectedTask.taskName}</Text>
              <Text variant="medium">Description: {selectedTask.description}</Text>
              <Text variant="medium">Status: {selectedTask.taskStatus}</Text>
              <Text variant="small">Assigned To: {selectedTask.assignedTo.username}</Text>
              <Text variant="small">Assigned To: {selectedTask.assignedTo.email}</Text>
              <Text variant="small">Created on: {new Date(selectedTask.dateCreated).toLocaleDateString()}</Text>
              <Text variant="small">Estimated Time: {selectedTask.estimatedTime}</Text>
            </>
          ) : (
            <Text>Loading task details...</Text>
          )}
          <PrimaryButton
            text="Close"
            onClick={() => {
              setIsTaskDetailsModalOpen(false);
              setSelectedTask(null);
            }}
          />
        </Stack>
      </Modal>
    </Stack>
  );
};

export default LeadAssignedTasks;
