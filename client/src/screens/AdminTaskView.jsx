import {
  Stack,
  Text,
  Spinner,
  FontWeights,
  mergeStyles
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

// Styles
const titleStyles = mergeStyles({
  fontSize: '24px',
  fontWeight: FontWeights.semibold,
  padding: '0 0 8px 0'
});

const statsTextStyles = mergeStyles({
  fontSize: '16px',
  fontWeight: FontWeights.regular,
  padding: '4px 0'
});

const taskCardStyles = mergeStyles({
  background: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  borderRadius: '8px',
  padding: '16px',
  minWidth: '200px'
});

const taskTitleStyles = mergeStyles({
  fontSize: '16px',
  fontWeight: FontWeights.semibold,
  padding: '0 0 8px 0'
});

const taskDetailsStyles = mergeStyles({
  fontSize: '14px',
  padding: '2px 0'
});

const AdminTaskView = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const { projectName, projectLead } = location.state || {};
  const {
    logout,
    getAllTasksInProject,
    getCompletedTasksInProject,
  } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getAllTasksInProject(projectId);
        setTasks(tasksData);
        const completedTasksData = await getCompletedTasksInProject(projectId);
        setCompletedTasks(completedTasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, getAllTasksInProject, getCompletedTasksInProject]);

  return (
    <Stack verticalFill>
      <Header />
      <Stack tokens={{ padding: 16 }} horizontalAlign="center">
        <Stack
          horizontalAlign="start"
          verticalAlign="top"
          tokens={{ childrenGap: 16 }}
          styles={{ root: { width: '100%' } }}
        >
          <Text className={titleStyles}>
            {projectName || "Project Tasks"}
          </Text>
          <Text className={statsTextStyles}>
            Total Tasks: {tasks.length}
          </Text>
          <Text className={statsTextStyles}>
            Project Progress: {tasks.length ? ((completedTasks.length/tasks.length)*100).toFixed(0) : 0}%
          </Text>
        </Stack>

        {loading ? (
          <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { minHeight: 200 } }}>
            <Spinner label="Loading tasks..." />
          </Stack>
        ) : tasks.length === 0 ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            styles={{ root: { minHeight: 200 } }}
          >
            <Text variant="large">No Tasks Available!</Text>
          </Stack>
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
            {tasks.map((task) => (
              <Stack
                key={task._id}
                className={taskCardStyles}
              >
                <Text className={taskTitleStyles}>
                  Task Name: {task.taskName}
                </Text>
                <Text className={taskDetailsStyles}>
                  Status: {task.taskStatus}
                </Text>
                <Text className={taskDetailsStyles}>
                  Created on: {new Date(task.dateCreated).toLocaleDateString()}
                </Text>
                <Text className={taskDetailsStyles}>
                  Estimated Time: {task.estimatedTime} hour
                </Text>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default AdminTaskView;