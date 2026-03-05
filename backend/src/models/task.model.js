const pool = require('../config/db');

const createTask = async (projectId, title, description, priority, assignedTo, dueDate, createdBy) => {
  const result = await pool.query(
    `INSERT INTO tasks (project_id, title, description, priority, assigned_to, due_date, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [projectId, title, description, priority, assignedTo, dueDate, createdBy]
  );
  return result.rows[0];
};

const getTasksByProject = async (projectId) => {
  const result = await pool.query(
    `SELECT t.*, u.name as assigned_to_name 
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.project_id = $1
     ORDER BY t.created_at DESC`,
    [projectId]
  );
  return result.rows;
};

const getTaskById = async (taskId) => {
  const result = await pool.query(
    `SELECT t.*, u.name as assigned_to_name 
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.id = $1`,
    [taskId]
  );
  return result.rows[0];
};

const updateTask = async (taskId, fields) => {
  const { title, description, status, priority, assignedTo, dueDate } = fields;
  const result = await pool.query(
    `UPDATE tasks SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      priority = COALESCE($4, priority),
      assigned_to = COALESCE($5, assigned_to),
      due_date = COALESCE($6, due_date)
     WHERE id = $7 RETURNING *`,
    [title, description, status, priority, assignedTo, dueDate, taskId]
  );
  return result.rows[0];
};

const updateTaskAttachment = async (taskId, attachmentUrl) => {
  const result = await pool.query(
    'UPDATE tasks SET attachment_url = $1 WHERE id = $2 RETURNING *',
    [attachmentUrl, taskId]
  );
  return result.rows[0];
};

const deleteTask = async (taskId) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskAttachment,
  deleteTask,
};