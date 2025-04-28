const pool = require('../../db/pool');
const queries = require('./queries');

const getRequirementById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the main requirement
        const requirementResult = await pool.query(queries.getRequirementById, [id]);
        if (requirementResult.rows.length === 0) {
            return res.status(404).json({ error: 'Requirement not found' });
        }
        const requirement = requirementResult.rows[0];

        // Fetch linked subsystems
        const subsystemsResult = await pool.query(queries.getLinkedSubsystems, [id]);
        requirement.linkedSubsystems = subsystemsResult.rows;

        // Fetch linked test cases
        const testCasesResult = await pool.query(queries.getLinkedTestCases, [id]);
        requirement.linkedTestCases = testCasesResult.rows;

        // Return everything combined
        res.json(requirement);

    } catch (err) {
        console.error('Error fetching requirement with links:', err);
        res.status(500).json({ error: 'Error fetching requirement' });
    }
};

const getRequirementsByProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(queries.getRequirementsByProject, [projectId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error getting requirements:', err);
        res.status(500).json({ error: 'Failed to get requirements' });
    }
}

const addRequirement = async (req, res) => {
    const { project_id, requirement_id, title, description, type, priority, status, verification_method, source, stakeholder } = req.body;

    try {
        const result = await pool.query(queries.addRequirement, [project_id, requirement_id, title, description, type, priority, status, verification_method, source, stakeholder]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding requirement:', err);
        res.status(500).json({ error: 'Failed to add requirement' });
    }
};

const updateRequirement = async (req, res) => {
    const { id, project_id, requirement_id, title, description, type, priority, status, verification_method, source, stakeholder } = req.body;

    try {
        const result = await pool.query(queries.updateRequirement, [id, project_id, requirement_id, title, description, type, priority, status, verification_method, source, stakeholder]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating requirement:', err);
        res.status(500).json({ error: 'Failed to update requirement' });
    }
};

const deleteRequirement = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(queries.deleteRequirement, [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting requirement:', err);
        res.status(500).json({ error: 'Failed to delete requirement' });
    }
};

const linkSubsystem = async (req, res) => {
    const { requirementId, subsystemId } = req.body;
    try {
        await pool.query(queries.linkSubsystem, [requirementId, subsystemId]);
        res.status(200).json({ message: 'Subsystem linked successfully' });
    } catch (err) {
        console.error('Error linking subsystem:', err);
        res.status(500).json({ error: 'Failed to link subsystem' });
    }
};

const unlinkSubsystem = async (req, res) => {
    const { requirementId, subsystemId } = req.body;
    try {
        await pool.query(queries.unlinkSubsystem, [requirementId, subsystemId]);
        res.status(200).json({ message: 'Subsystem unlinked successfully' });
    } catch (err) {
        console.error('Error unlinking subsystem:', err);
        res.status(500).json({ error: 'Failed to unlink subsystem' });
    }
};

const linkTestCase = async (req, res) => {
    const { requirementId, testCaseId } = req.body;
    try {
        await pool.query(queries.linkTestCase, [requirementId, testCaseId]);
        res.status(200).json({ message: 'Test case linked successfully' });
    } catch (err) {
        console.error('Error linking test case:', err);
        res.status(500).json({ error: 'Failed to link test case' });
    }
};

const unlinkTestCase = async (req, res) => {
    const { requirementId, testCaseId } = req.body;
    try {
        await pool.query(queries.unlinkTestCase, [requirementId, testCaseId]);
        res.status(200).json({ message: 'Test case unlinked successfully' });
    } catch (err) {
        console.error('Error unlinking test case:', err);
        res.status(500).json({ error: 'Failed to unlink test case' });
    }
};

module.exports = {
    getRequirementById,
    getRequirementsByProject,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    linkSubsystem,
    unlinkSubsystem,
    linkTestCase,
    unlinkTestCase
};
