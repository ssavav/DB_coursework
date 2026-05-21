export interface UserDB {
    id: number;
    email: string;
    passwordHash: string;
    role: string;
}

export interface UserInput{
    email: string;
    passwordRaw: string;
}

export interface RegisterUserInput extends UserInput{
    role: 'manager' | 'organizer';
}

export interface ManagerRegisterUserInput extends RegisterUserInput{
    team_name: string;
}

export interface OrganizerRegisterUserInput extends RegisterUserInput{
    name: string;
    phone: string;
}

export interface UserResponse {
    id: number;
    email: string;
    role: string;
}
