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
  SET test_case_id = $2,
      description = $3,
      test_steps = $4,
      prerequisites = $5,
      test_data = $6,
      expected_result = $7,
      actual_result = $8,
      status = $9,
      evidence_link = $10
  WHERE id = $1
  RETURNING *;
`;

const deleteTestCase = `
    DELETE FROM test_cases
    WHERE id = $1;
`;

module.exports = {
    getTestCasesByProject,
    addTestCase,
    updateTestCase,
    deleteTestCase
};