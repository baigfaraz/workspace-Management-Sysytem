import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STRINGS } from "../utils/strings";

// Create AuthContext
export const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminWorkspaces, setAdminWorkspaces] = useState([]);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password, role) => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Fetch admin workspaces
  const fetchAdminWorkspaces = async () => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/getworkspaces`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAdminWorkspaces(data);
      } else {
        throw new Error(data.message || "Failed to fetch workspaces");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create workspace
  const createWorkspace = async (workspaceName) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/createworkspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ workspaceName }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        await fetchAdminWorkspaces(); // Refresh workspace list
      } else {
        throw new Error(data.message || "Workspace creation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      return []; // Return empty array on error
    }
  };

  // Add users to workspace
  const addUsersToWorkspace = async (workspaceId, userIds) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/addUsersToWorkspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ workspaceId, userIds }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add users to workspace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get workspace by ID
  const getWorkspaceById = async (workspaceId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/getworkspacebyid?workspaceId=${workspaceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch workspace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create project
  const createProject = async (projectName, workspaceId, teamLeadId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/projects/createproject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ projectName, workspaceId, teamLeadId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Project creation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all projects by admin
  const fetchProjects = async (workspaceId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/projects/getallprojectsbyadmin?workspaceId=${workspaceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          // Remove the body since GET requests should not have a body
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch workspace users of specific workspace
  const fetchWorkspaceUsersOfSpecificWorkSpace = async (workspaceId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/getworkspaceusersofspecificworkspace?workspaceId=${workspaceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      console.log("specific work space users", data);
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch workspace users");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Check user role function
  const checkUserRole = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser).role;
    }
    return null;
  };

  // Fetch user workspaces by userId
  const fetchUserWorkspaces = async () => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/getworkspacesofuser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserWorkspaces(data); // Set the fetched workspaces
      } else {
        throw new Error(data.message || "Failed to fetch workspaces");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch projects by team lead
  const fetchProjectsByTeamLead = async (workspaceId, teamLeadId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/projects/getallprojectsbyteamlead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ workspaceId, teamLeadId }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignUsersToProject = async (projectId, userIds) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/projects/addMembersInProject`,
        {
          method: "POST", // Assuming this API endpoint is a POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            projectId,
            userIds,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to assign users to project"
        );
      }

      const data = await response.json();
      return data; // Optionally return data if needed
    } catch (error) {
      console.error("Error assigning users to project:", error); // Log the error
    }
  };

  const fetchProjectsByUser = async () => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/projects/getprojectsbyuser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return data;
      } else {
        console.log("error in fetching projects by user");
      }
    } catch (error) {
      console.error("Error fetching projects: ", error);
      throw error; // You can choose to handle or throw the error again based on your needs
    }
  };

  // Function to assign a task to a user in a project
  const assignTask = async ({
    taskName,
    description,
    projectId,
    assignedTo,
  }) => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/tasks/assigntask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Bearer token from the authenticated user
        },
        body: JSON.stringify({
          taskName,
          description,
          projectId,
          assignedTo,
        }),
      });

      // Check if the response is OK (status code 201)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error assigning task");
      }

      // Parse and return the JSON data (task details)
      const data = await response.json();
      return data; // You can return this to the calling function or set it in state
    } catch (error) {
      console.error("Error assigning task: ", error);
      throw error; // Rethrow error to be handled by the caller
    }
  };

  // Function to get all tasks in a project by team lead
  const getAllTasksInProject = async (projectId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/tasks/getalltasksinproject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Bearer token from the authenticated user
          },
          body: JSON.stringify({
            projectId,
          }),
        }
      );

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching tasks");
      }

      // Parse and return the JSON data (task details)
      const data = await response.json();
      return data; // You can return this to the calling function or set it in state
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      throw error; // Rethrow error to be handled by the caller
    }
  };

  // Function to get all members of a project
  const getProjectMembers = async (projectId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/projects/getprojectmembers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Bearer token from the authenticated user
          },
          body: JSON.stringify({
            projectId,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch project members");
      }
    } catch (error) {
      console.error("Error fetching project members:", error);
      throw new Error("Failed to fetch project members");
    }
  };

  // Function to get task by ID
  const getTaskById = async (taskId) => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/tasks/gettaskbyid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Bearer token from the authenticated user
        },
        body: JSON.stringify({
          taskId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch task");
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch task");
    }
  };

  const fetchTasksByUser = async (projectId, userId) => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/tasks/gettasksbyuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          projectId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching tasks");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      throw error;
    }
  };

  const updateTaskStatus = async (taskId, taskStatus) => {
    try {
      console.log("taskSatatus", taskStatus);
      const response = await fetch(
        `${STRINGS.BASE_URL}/tasks/updatetaskstatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            taskId,
            taskStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating task status");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error updating task status: ", error);
      throw error;
    }
  };

  const updateTaskEstimatedTime = async (taskId, estimatedTime) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/tasks/updatetaskestimatedtime`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            taskId,
            estimatedTime,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error updating task estimated time"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating task estimated time: ", error);
      throw error;
    }
  };

  const sendMessage = async (projectId, message) => {
    try {
      if (!user || !user.token) {
        throw new Error("User is not authenticated");
      }
      const response = await fetch(`${STRINGS.BASE_URL}/chat/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          projectId,
          message,
        }),
      });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || "Error sending message");
      // }
      const data = await response.json();
      console.log("Message sent successfully: ", data);
    } catch (error) {
      console.error("Error sending message: ", error);
      throw error;
    }
  };

  const fetchAllMessages = async (projectId) => {
    console.log("userToken", user.token); // Fixed the typo: `console.log` instead of `console,log`
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/chat/getChatMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          projectId, // projectId is correctly formatted as a string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching messages");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching messages: ", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const getCompletedTasksInProject = async (projectId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/tasks/getcompletedtasksinproject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            projectId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching completed tasks");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching completed tasks: ", error);
      throw error;
    }
  };

  //delete workspace by Id
  const deleteWorkSpaceById = async (workspaceId) => {
    try {
      const response = await fetch(
        `${STRINGS.BASE_URL}/workspaces/deleteworkspace`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ workspaceId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Workspace deleted successfully:", data);
      } else {
        console.error("Error deleting workspace:", data.error);
      }
    } catch (error) {
      console.error("Error occurred while deleting workspace:", error);
    }
  };

  // delete user by Id
  const deleteUserById = async (userId) => {  
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/users/deleteUserById`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Ensure user.token is defined
        },
        body: JSON.stringify({
          userId
        })
      });
  
      const data = await response.json(); // Make sure the response is JSON
  
      if (response.ok) {
        console.log("User deleted successfully:", data);
      } else {
        console.error("Error deleting user:", data.message || data.error || 'An error occurred');
      }
    } catch (error) {
      console.error("Error occurred while deleting user:", error);
    }
  };
  

  // Provide user, login, logout, register, checkUserRole functions to the children components
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        checkUserRole,
        adminWorkspaces,
        setAdminWorkspaces,
        fetchAdminWorkspaces,
        createWorkspace,
        fetchUsers,
        addUsersToWorkspace,
        getWorkspaceById,
        createProject,
        fetchProjects,
        fetchWorkspaceUsersOfSpecificWorkSpace,
        fetchUserWorkspaces,
        userWorkspaces,
        fetchProjectsByTeamLead,
        assignUsersToProject,
        fetchProjectsByUser,
        assignTask,
        getAllTasksInProject,
        getProjectMembers,
        getTaskById,
        fetchTasksByUser,
        updateTaskStatus,
        updateTaskEstimatedTime,
        sendMessage,
        fetchAllMessages,
        getCompletedTasksInProject,
        deleteWorkSpaceById,
        deleteUserById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
