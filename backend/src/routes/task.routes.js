const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getTasks,
  createNewTask,
  updateExistingTask,
  uploadAttachment,
  removeTask,
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createNewTask);
router.patch('/:id', updateExistingTask);
router.post('/:id/attachment', upload.single('file'), uploadAttachment);
router.delete('/:id', removeTask);

module.exports = router;