const getRequirementById = `
    SELECT * FROM requirements
    WHERE id = $1
`;

const getRequirementsByProject = `
    SELECT * FROM requirements
    WHERE project_id = $1
    ORDER BY id;
`;

const addRequirement = `
    INSERT INTO requirements (
        project_id, requirement_id, title, description, type, priority, 
        status, verification_method, source, stakeholder
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
`;

const updateRequirement = `
    UPDATE requirements
    SET project_id = $2,
        requirement_id = $3,
        title = $4,
        description = $5,
        type = $6,
        priority = $7,
        status = $8,
        verification_method = $9,
        source = $10,
        stakeholder = $11
    WHERE id = $1
    RETURNING *;
`;

const deleteRequirement = `
    DELETE FROM requirements
    WHERE id = $1;
`;

const linkSubsystem = `
    INSERT INTO requirement_subsystems (requirement_id, subsystem_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
`;

const unlinkSubsystem = `
    DELETE FROM requirement_subsystems
    WHERE requirement_id = $1 AND subsystem_id = $2;
`;

const linkTestCase = `
    INSERT INTO requirement_test_cases (requirement_id, test_case_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
`;

const unlinkTestCase = `
    DELETE FROM requirement_test_cases
    WHERE requirement_id = $1 AND test_case_id = $2;
`;

const getLinkedSubsystems = `
    SELECT s.id, s.name
    FROM subsystems s
    JOIN requirement_subsystems rs ON s.id = rs.subsystem_id
    WHERE rs.requirement_id = $1;
`;

const getLinkedTestCases = `
    SELECT tc.id, tc.test_case_id
    FROM test_cases tc
    JOIN requirement_test_cases rtc ON tc.id = rtc.test_case_id
    WHERE rtc.requirement_id = $1;
`;

module.exports = {
    getRequirementById,
    getRequirementsByProject,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    linkSubsystem,
    unlinkSubsystem,
    linkTestCase,
    unlinkTestCase,
    getLinkedSubsystems,
    getLinkedTestCases
};