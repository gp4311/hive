export interface Project {
    id?: number;
    name: string;
    description?: string;
    status: 'active' | 'archived';
    start_date?: string;
    end_date?: string;
}

export interface SubsystemRequirementCount {
    subsystem_name: string;
    requirement_count: number;
}

export interface RequirementStatusCount {
    status: string;
    count: number;
}

export interface RequirementPriorityCount {
    priority: string;
    count: number;
}

export interface TestCaseStatusCount {
    status: string;
    count: number;
}