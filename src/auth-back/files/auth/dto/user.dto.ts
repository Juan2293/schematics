export interface User {
    id: string;
    email: string;
    password: string;
    isActive: boolean;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
    permissions: Permissions[];
}

export interface Permissions {
    id: number;
    name: string;
}

export const FAKE_USERS: User[] = [
    {
        id: "bedab0d3-1b5f-4160-928d-d9705c526257",
        email: "test@test.com",
        password: "$2b$10$ZaqeXzPxmTspJN5.nNA/BOs1m5WK/3pKt4TJ6dZi2KP09VdJNkpd.", //Abc123
        isActive: true,
        roles: [{
            id: 1,
            name: "ROLE",
            permissions: [
                {
                    id: 1,
                    name: "view_users"
                }
            ]
        }]
    }]