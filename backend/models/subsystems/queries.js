const getSubsystemsByProject = `
  SELECT * FROM subsystems
  WHERE project_id = $1
  ORDER BY id;
`;

const addSubsystem = `
  INSERT INTO subsystems (project_id, name, description)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

const updateSubsystem = `
  UPDATE subsystems
  SET name = $2, description = $3
  WHERE id = $1
  RETURNING *;
`;

const deleteSubsystem = `
  DELETE FROM subsystems
  WHERE id = $1;
`;

module.exports = {
  getSubsystemsByProject,
  addSubsystem,
  updateSubsystem,
  deleteSubsystem,
};