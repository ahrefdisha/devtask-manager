const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getComments);
router.post('/', addComment);

module.exports = router;