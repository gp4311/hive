export interface User {
    id: number;
    name: string;
    email: string;
}

export interface UserWithRole extends User {
    role: 'admin' | 'manager' | 'engineer' | 'reviewer' | 'viewer';
}

export interface ProjectUserRole {
    project_id: number;
    project_name: string;
    role: 'admin' | 'manager' | 'engineer' | 'reviewer' | 'viewer';
}
