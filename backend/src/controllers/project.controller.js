const {
  createProject,
  getUserProjects,
  getProjectById,
  isProjectMember,
  inviteMember,
  deleteProject,
} = require('../models/project.model');
const { findUserByEmail } = require('../models/user.model');

const getProjects = async (req, res) => {
  try {
    const projects = await getUserProjects(req.user.userId);
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNewProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await createProject(name, description, req.user.userId);
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = await isProjectMember(req.params.id, req.user.userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMember = await isProjectMember(req.params.id, user.id);
    if (isMember) return res.status(400).json({ message: 'User already a member' });

    await inviteMember(req.params.id, user.id);
    res.json({ message: 'User invited successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeProject = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner_id !== req.user.userId) {
      return res.status(403).json({ message: 'Only owner can delete project' });
    }

    await deleteProject(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  createNewProject,
  getProject,
  inviteUser,
  removeProject,
};