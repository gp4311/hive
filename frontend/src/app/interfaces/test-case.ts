export interface TestCase {
    id?: number;
    project_id: number;
    test_case_id: string;
    description: string;
    test_steps: string;
    prerequisites: string;
    test_data: string;
    expected_result: string;
    actual_result: string;
    status: 'planned' | 'in_progress' | 'passed' | 'failed';
    evidence_link: string;
    created_at?: string;
}  