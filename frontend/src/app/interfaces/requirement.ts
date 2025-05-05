export interface Requirement {
    id?: number;
    project_id: number;
    requirement_id: string;
    title: string;
    description?: string;
    type: 'functional' | 'non-functional';
    priority: 'low' | 'medium' | 'high';
    status: 'draft' | 'reviewed' | 'approved' | 'verified';
    verification_method: 'test' | 'inspection' | 'analysis' | 'demo';
    source?: string;
    stakeholder?: string;
    created_at?: string;

    linkedSubsystems?: LinkedSubsystem[];
    linkedTestCases?: LinkedTestCase[];
}

export interface LinkedSubsystem {
    id: number;
    name: string;
}

export interface LinkedTestCase {
    id: number;
    test_case_id: string;
}

export interface LinkSubsystemRequest {
    requirementId: number;
    subsystemId: number;
}

export interface LinkTestCaseRequest {
    requirementId: number;
    testCaseId: number;
}

export interface RequirementSubsystemMapping {
    requirement_id: number;
    subsystem_name: string;
}

export interface RequirementTestCaseMapping {
    requirement_id: number;
    test_case_id: string;
    test_case_status: 'planned' | 'in_progress' | 'passed' | 'failed';
}

export interface TraceabilityRow {
    requirement_id: string;
    title: string;
    priority: string;
    status: string;
    verification_method: string;
    subsystems: string;
    test_case_ids: string;
    test_case_statuses: string;
}