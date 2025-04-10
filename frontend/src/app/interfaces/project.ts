export interface Project {
    id?: number;
    name: string;
    description?: string;
    status: 'active' | 'archived';
    start_date?: string;
    end_date?: string;
}