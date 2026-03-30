export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    idUser: number;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: {
        idRole: number;
        name: string;
    };
    createdAt: string;
}