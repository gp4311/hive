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

const getSubsystemCountByProject = `
  SELECT COUNT(*) AS total_subsystems
  FROM subsystems
  WHERE project_id = $1;
`;

const getRequirementCountPerSubsystem = `
  SELECT s.name AS subsystem_name, COUNT(rs.requirement_id) AS requirement_count
  FROM subsystems s
  LEFT JOIN requirement_subsystems rs ON s.id = rs.subsystem_id
  WHERE s.project_id = $1
  GROUP BY s.name
  ORDER BY requirement_count DESC;
`;

module.exports = {
  getSubsystemsByProject,
  addSubsystem,
  updateSubsystem,
  deleteSubsystem,
  getSubsystemCountByProject,
  getRequirementCountPerSubsystem
};