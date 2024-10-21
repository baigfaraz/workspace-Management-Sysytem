import { FluentProvider, webDarkTheme , webLightTheme } from "@fluentui/react-components";
import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./screens/AdminDashboard";
import HomePage from "./screens/HomePage";
import LoginPage from "./screens/LoginPage";
import ProjectPage from "./screens/ProjectPage";
import RegisterPage from "./screens/RegisterPage";
import TaskPage from "./screens/TaskPage";
import AdminProjectsDashboard from "./screens/AdminProjectsDashboard";
import AdminTaskView from "./screens/AdminTaskView";
import LeadAssignedTasks from "./screens/LeadAssignedTasks";
import StartPage from "./screens/StartPage";

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<StartPage/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-projects-dashboard/:workspaceId" element={<AdminProjectsDashboard />}/>
            <Route path="/admin-task-view/:projectId" element={<AdminTaskView />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/home/projects/:workspaceId" element={<ProjectPage />} />
            <Route path="/home/assigned-tasks/:projectId" element={<LeadAssignedTasks />} />
            <Route path="/home/workspace/project/:projectId" element={<TaskPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </FluentProvider>
  );
}

export default App;
