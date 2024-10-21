import {
  Stack,
  Text
} from "@fluentui/react";
import { Body1, Subtitle1, Subtitle2 } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const AdminTaskView = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const { projectName  , projectLead} = location.state || {};
  const {
    logout,
    getAllTasksInProject,
    getCompletedTasksInProject,
  } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  
  
  // Fetch all tasks in the project
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
  }, [projectId, getAllTasksInProject , getCompletedTasksInProject]);


  return (
    <Stack verticalFill>
      <Header />
      <Stack tokens={{ padding: 16 }} horizontalAlign="center">
        <Stack
          horizontalAlign="start"
          verticalAlign="top"
          tokens={{ childrenGap: 16 }}
          style={{ width: "100%" }}
        >
          <Subtitle1 variant="xxLarge" block>
            {projectName || "Project Tasks"}
          </Subtitle1>
          <Body1>
            Total Tasks: {tasks.length}
          </Body1>
          <Body1>
            Project Progress: {((completedTasks.length/tasks.length)*100).toFixed(0)}%
          </Body1>
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
              No Task Available!
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
                  Task Name: {task.taskName}
                </Subtitle2>
                <Body1 variant="medium" block>
                  Status: {task.taskStatus}
                </Body1>
                <Body1 variant="small" block>
                  Created on: {new Date(task.dateCreated).toLocaleDateString()}
                </Body1>
                <Body1 variant="small" block>
                  Estimated Time : {task.estimatedTime} hour
                </Body1>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

    </Stack>
  );
};

export default AdminTaskView;
