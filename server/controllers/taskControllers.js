import Task from "../models/task.js";

const assignTask = async (req, res) => {
  const { taskName, description, projectId, assignedTo } =
    req.body;

  try {
    // Create a new task and assign it to a project member
    const task = new Task({
      taskName,
      description,
      projectId,
      assignedTo,
    });

    await task.save();
    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all tasks in a project by team lead
const getAllTasksInProject = async (req, res) => {
  const { projectId } = req.body;

  try {
    const tasks = await Task.find({ projectId }).populate(
      "assignedTo",
      "name email"
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all tasks assigned to a user forspecific project
const getTasksByUser = async (req, res) => {
  const { projectId, userId } = req.body;

  try {
    const tasks = await Task.find({ projectId, assignedTo: userId }).populate(
      "assignedTo",
      "username email"
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get task by id
const getTaskById = async (req, res) => {
  const { taskId } = req.body;

  try {
    const task = await Task.findById(taskId)
    .populate(
      "assignedTo",
      "username email"
    )
    .exec();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update task status
const updateTaskStatus = async (req, res) => {
  const { taskId, taskStatus } = req.body;
  console.log(req.body);
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { taskStatus },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update task estimated time
const updateTaskEstimatedTime = async (req, res) => {
  const { taskId, estimatedTime } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { estimatedTime },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCompletedTasksInProject = async (req, res) => {
  const { projectId } = req.body;  // Get projectId from URL params

  try {
      // Find tasks with the same projectId and taskStatus as 'Completed'
      const tasks = await Task.find({
          projectId: projectId,
          taskStatus: 'Completed'
      });

      // If no tasks found, return a 404 response
      if (tasks.length === 0) {
          return res.status(404).json({ message: 'No completed tasks found for this project' });
      }

      // Return the list of completed tasks
      res.status(200).json(tasks);
  } catch (error) {
      console.error('Error fetching completed tasks:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

export {
  assignTask,
  getAllTasksInProject,
  getTasksByUser,
  getTaskById,
  updateTaskStatus,
  updateTaskEstimatedTime,
  getCompletedTasksInProject,
};