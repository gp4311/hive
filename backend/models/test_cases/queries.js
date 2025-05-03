const getTestCaseById = `
  SELECT * FROM test_cases
  WHERE id = $1
`;

const getTestCasesByProject = `
    SELECT * FROM test_cases
    WHERE project_id = $1
    ORDER BY id;
`;

const addTestCase = `
  INSERT INTO test_cases (
    project_id, test_case_id, description, test_steps, prerequisites, test_data,
    expected_result, actual_result, status, evidence_link
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;
`;

const updateTestCase = `
  UPDATE test_cases
  SET project_id = $2,
      test_case_id = $3,
      description = $4,
      test_steps = $5,
      prerequisites = $6,
      test_data = $7,
      expected_result = $8,
      actual_result = $9,
      status = $10,
      evidence_link = $11
  WHERE id = $1
  RETURNING *;
`;

const deleteTestCase = `
    DELETE FROM test_cases
    WHERE id = $1;
`;

const getTestCaseCountByProject = `
  SELECT COUNT(*) AS total_test_cases
  FROM test_cases
  WHERE project_id = $1;
`;

const getTestCaseCountByStatus = `
  SELECT status, COUNT(*) AS count
  FROM test_cases
  WHERE project_id = $1
  GROUP BY status;
`;

const getTestCasePassPercentage = `
  SELECT 
    ROUND(100.0 * SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS percent_passed
  FROM test_cases
  WHERE project_id = $1;
`;

module.exports = {
  getTestCaseById,
  getTestCasesByProject,
  addTestCase,
  updateTestCase,
  deleteTestCase,
  getTestCaseCountByProject,
  getTestCaseCountByStatus,
  getTestCasePassPercentage
};