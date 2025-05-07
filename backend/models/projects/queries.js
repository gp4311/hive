const createProject = `
  INSERT INTO projects (name, description, status, start_date, end_date)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

const getAllProjects = `
  SELECT * FROM projects;
`;

const getProjectById = `
  SELECT * FROM projects WHERE id = $1;
`;

const getProjectsForUser = `
  SELECT p.*
  FROM projects p
  JOIN project_users pu ON pu.project_id = p.id
  WHERE pu.user_id = $1;
`;

const updateProject = `
  UPDATE projects
  SET name = $1,
      description = $2,
      status = $3,
      start_date = $4,
      end_date = $5
  WHERE id = $6
  RETURNING *;
`;

const deleteProject = `
  DELETE FROM projects WHERE id = $1;
`;

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsForUser,
  updateProject,
  deleteProject,
};