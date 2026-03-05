const express = require('express');
const router = express.Router();
const {
  getProjects,
  createNewProject,
  getProject,
  inviteUser,
  removeProject,
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createNewProject);
router.get('/:id', getProject);
router.post('/:id/invite', inviteUser);
router.delete('/:id', removeProject);

module.exports = router;