const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskAttachment,
  deleteTask,
} = require('../models/task.model');
const { isProjectMember } = require('../models/project.model');

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });

    const isMember = await isProjectMember(projectId, req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const tasks = await getTasksByProject(projectId);
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNewTask = async (req, res) => {
  try {
    const { projectId, title, description, priority, assignedTo, dueDate } = req.body;
    if (!projectId || !title) {
      return res.status(400).json({ message: 'projectId and title are required' });
    }

    const isMember = await isProjectMember(projectId, req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const task = await createTask(
      projectId, title, description,
      priority || 'medium', assignedTo, dueDate, req.user.userId
    );
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateExistingTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isMember = await isProjectMember(task.project_id, req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const updated = await updateTask(req.params.id, req.body);
    res.json({ message: 'Task updated', task: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadAttachment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const attachmentUrl = `local://${req.file.originalname}`;
    const updated = await updateTaskAttachment(req.params.id, attachmentUrl);
    res.json({ message: 'File uploaded', task: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isMember = await isProjectMember(task.project_id, req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    await deleteTask(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  createNewTask,
  updateExistingTask,
  uploadAttachment,
  removeTask,
};