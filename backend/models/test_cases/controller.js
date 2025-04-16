const pool = require('../../db/pool');
const queries = require('./queries');

const getTestCasesByProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(queries.getTestCasesByProject, [projectId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error getting test cases:', err);
        res.status(500).json({ error: 'Failed to get test cases' });
    }
}

const addTestCase = async (req, res) => {
    const { project_id, test_case_id, description, test_steps, prerequisites, test_data, expected_result, actual_result, status, evidence_link } = req.body;

    try {
        const result = await pool.query(queries.addTestCase, [project_id, test_case_id, description, test_steps, prerequisites, test_data, expected_result, actual_result, status, evidence_link]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding test case:', err);
        res.status(500).json({ error: 'Failed to add test case' });
    }
};

const updateTestCase = async (req, res) => {
    const { id, project_id, test_case_id, description, test_steps, prerequisites, test_data, expected_result, actual_result, status, evidence_link } = req.body;

    try {
        const result = await pool.query(queries.updateTestCase, [id, project_id, test_case_id, description, test_steps, prerequisites, test_data, expected_result, actual_result, status, evidence_link]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating test case:', err);
        res.status(500).json({ error: 'Failed to update test case' });
    }
};

const deleteTestCase = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(queries.deleteTestCase, [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting test case:', err);
        res.status(500).json({ error: 'Failed to delete test case' });
    }
};

module.exports = {
    getTestCasesByProject,
    addTestCase,
    updateTestCase,
    deleteTestCase,
};
