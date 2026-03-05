const pool = require('../config/db');

const createProject = async (name, description, ownerId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const project = await client.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, ownerId]
    );

    await client.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [project.rows[0].id, ownerId, 'owner']
    );

    await client.query('COMMIT');
    return project.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getUserProjects = async (userId) => {
  const result = await pool.query(
    `SELECT p.* FROM projects p
     JOIN project_members pm ON p.id = pm.project_id
     WHERE pm.user_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getProjectById = async (projectId) => {
  const result = await pool.query(
    'SELECT * FROM projects WHERE id = $1',
    [projectId]
  );
  return result.rows[0];
};

const isProjectMember = async (projectId, userId) => {
  const result = await pool.query(
    'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectId, userId]
  );
  return result.rows.length > 0;
};

const inviteMember = async (projectId, userId) => {
  const result = await pool.query(
    'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
    [projectId, userId, 'member']
  );
  return result.rows[0];
};

const deleteProject = async (projectId) => {
  await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  isProjectMember,
  inviteMember,
  deleteProject,
};