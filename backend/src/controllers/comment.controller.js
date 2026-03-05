const pool = require('../config/db');

const getComments = async (req, res) => {
  try {
    const { taskId } = req.query;
    if (!taskId) return res.status(400).json({ message: 'taskId is required' });

    const result = await pool.query(
      `SELECT c.*, u.name as user_name 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.created_at ASC`,
      [taskId]
    );
    res.json({ comments: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    if (!taskId || !content) {
      return res.status(400).json({ message: 'taskId and content are required' });
    }

    const result = await pool.query(
      'INSERT INTO comments (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [taskId, req.user.userId, content]
    );
    res.status(201).json({ message: 'Comment added', comment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getComments, addComment };