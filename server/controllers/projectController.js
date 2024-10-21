import Project from "../models/project.js";
import ProjectMember from "../models/projectMember.js";
import mongoose from "mongoose";

// Create a new project
const createProject = async (req, res) => {
  // const { projectName, workspaceId, teamLeadId } = req.body;
  const { projectName, workspaceId, teamLeadId } = req.body.projectName;
  try {
    // Ensure the workspaceId exists and the current user is the admin of the workspace (logic for this should be in middleware or verified here)
    if(!workspaceId){
      return res.status(400).json({ message: "Please provide a workspace ID" });
    }

    const project = new Project({
      projectName: String(projectName),
      workspaceId,
      teamLeadId,
    });
    

    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.deleteOne({ _id: projectId });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all projects by admin
const getAllProjectsByAdmin = async (req, res) => {
  const { workspaceId } = req.query;

  // Check if workspaceId is provided and valid
  if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace ID" });
  }

  try {
    const projects = await Project.find({ workspaceId })
      .populate('teamLeadId', 'email') // Populate with only the email field
      .exec();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all projects by team lead
const getAllProjectsByTeamLead = async (req, res) => {
  const { workspaceId, teamLeadId } = req.body;
  try {
    // Find projects in the workspace where the teamLeadId matches the specified teamLeadId
    const projects = await Project.find({ workspaceId, teamLeadId });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// assigning user to a project
const assignUsersToProject = async (req, res) => {
  const { projectId, userIds } = req.body; // Expecting userIds to be an array of user IDs

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide an array of user IDs" });
  }

  try {
    // Create an array of project members to insert into the ProjectMember collection
    const projectMembers = userIds.map((userId) => ({
      projectId,
      userId,
    }));

    // Use insertMany to assign multiple users to the project
    await ProjectMember.insertMany(projectMembers);

    res.status(201).json({
      message: "Users successfully added in the project",
      projectMembers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectsByUser = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user after authentication

  try {
    // Get project IDs where the user is assigned
    const projectMemberships = await ProjectMember.find({ userId }).select("projectId");
    const projectIds = projectMemberships.map((membership) => membership.projectId); // Correcting the reference here

    // Find the projects by the project IDs
    const projects = await Project.find({ _id: { $in: projectIds } }).populate('teamLeadId', 'name email');


    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get all projectMembers
const getProjectMembers = async (req, res) => {
  const { projectId } = req.body;

  try {
    const projectMembers = await ProjectMember.find({
      projectId,
    })
      .populate("userId", "email")
      .exec();
    res.status(200).json(projectMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createProject,
  deleteProject,
  getAllProjectsByAdmin,
  getAllProjectsByTeamLead,
  assignUsersToProject,
  getProjectsByUser,
  getProjectMembers,
};
