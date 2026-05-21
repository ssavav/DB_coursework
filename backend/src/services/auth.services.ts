import { JWT_SECRET } from "../config/config";
import { createUser, getUserByEmail, createManagerProfile } from "../repositories/auth.repository";
import { getTeamIDByName } from "../repositories/team.repository"
import { createOrganizerProfile } from "../repositories/organizer.repository";
import { RegisterUserInput, UserDB, UserInput, ManagerRegisterUserInput, OrganizerRegisterUserInput } from "../types/auth.types";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function loginUser(data: UserInput) {
    const userData: UserDB | null = await getUserByEmail(data.email);

    if (!userData) throw new Error("Incorrect email or password");
    const isValidPassword = await bcrypt.compare(data.passwordRaw, userData.passwordHash);
    if (!isValidPassword) throw new Error("Incorrect email or password");

    const token = jwt.sign(
        { id: userData.id, role: userData.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token: token,
        user: { 
            id: userData.id, 
            email: userData.email, 
            role: userData.role 
        }
    };
}

async function registerUser(data: ManagerRegisterUserInput | OrganizerRegisterUserInput) {
    const userExists = await getUserByEmail(data.email);

    if (userExists) throw new Error("User already exists");

    const salt = 10;
    const passwordHash = await bcrypt.hash(data.passwordRaw, salt);

    const registerData: Omit<UserDB, 'id'> = {
        email: data.email, 
        passwordHash, 
        role: data.role
    } 

    const newUser = await createUser(registerData);

    if (data.role === 'organizer') {
        const orgData = data as OrganizerRegisterUserInput;
        await createOrganizerProfile(newUser.id, orgData.name, orgData.email, orgData.phone);
    } else if (data.role === 'manager') {
        const manData = data as ManagerRegisterUserInput;
        const teamId = await getTeamIDByName(manData.team_name);
        await createManagerProfile(newUser.id, teamId);
    }

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token: token,
        user: { 
            id: newUser.id,
            email: newUser.email,
            role: newUser.role 
        }
    };
}

export { loginUser, registerUser };