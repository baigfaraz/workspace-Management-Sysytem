import express from "express";
import {
  assignTask,
  getAllTasksInProject,
  getTasksByUser,
  getTaskById,
  updateTaskStatus,
  updateTaskEstimatedTime,
  getCompletedTasksInProject,
} from "../controllers/taskControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// assign task
router.post("/assigntask", protect, assignTask);
// get all tasks in project
router.post("/getalltasksinproject", protect, getAllTasksInProject);
// get tasks by user
router.post("/gettasksbyuser", protect, getTasksByUser);
// get task by id
router.post("/gettaskbyid", protect, getTaskById);
// update task status
router.put("/updatetaskstatus", protect, updateTaskStatus);
// update task estimated time
router.put("/updatetaskestimatedtime", protect, updateTaskEstimatedTime);
// get completed tasks by project
router.post("/getcompletedtasksinproject", protect, getCompletedTasksInProject);

export default router;
