const pool = require('../../db/pool');
const queries = require('./queries');

const getTestCaseById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(queries.getTestCaseById, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Test case not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching test case' });
    }
};

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

const getTestCaseCountByProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(queries.getTestCaseCountByProject, [projectId]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error getting test case count:', err);
        res.status(500).json({ error: 'Failed to get test case count' });
    }
};

const getTestCaseCountByStatus = async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(queries.getTestCaseCountByStatus, [projectId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error getting test case count by status:', err);
        res.status(500).json({ error: 'Failed to get test case counts by status' });
    }
};

const getTestCasePassPercentage = async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(queries.getTestCasePassPercentage, [projectId]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error calculating test case pass percentage:', err);
        res.status(500).json({ error: 'Failed to calculate pass percentage' });
    }
};

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
