import express from "express";
import {
  createWorkspace,
  addUsersToWorkspace,
  getWorkspaces,
  removeUserFromWorkspace,
  deleteWorkspace,
  getWorkspacesOfUser,
  // getWorkspaceUsers,
  getWorkspaceById,
  getWorkspaceUsersOfSpecificWorkspace
} from "../controllers/workspaceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
// admin can make a workspace
router.post("/createworkspace", protect, admin, createWorkspace);
// admin can add user to workspace
router.post("/addUsersToWorkspace", protect, admin, addUsersToWorkspace);
// get all workspaces
router.get("/getworkspaces", protect, admin, getWorkspaces);
// admin can remove user from workspace
router.delete(
  "/removeuserfromworkspace",
  protect,
  admin,
  removeUserFromWorkspace
);
// get workspace by id
router.get("/getworkspacebyid", protect, getWorkspaceById);
// admin can delete workspace
router.delete("/deleteworkspace", protect, admin, deleteWorkspace);
// get all workspacesofuser
router.get("/getworkspacesofuser", protect, getWorkspacesOfUser);
// get all workspace users
// router.get("/getworkspaceusers", protect, getWorkspaceUsers);
// get all workspace users of specific workspace
router.get(
  "/getworkspaceusersofspecificworkspace",
  protect,
  getWorkspaceUsersOfSpecificWorkspace
);

export default router;
