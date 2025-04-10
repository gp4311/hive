export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ProjectUser extends User {
    role: 'admin' | 'manager' | 'engineer' | 'reviewer' | 'viewer';
}