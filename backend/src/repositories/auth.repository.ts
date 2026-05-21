import pool from "../config/db";
import { UserDB } from "../types/auth.types";

async function getUserByEmail(email:string) {
    const query = `select id, email, password_hash as "passwordHash", role from sport.users 
    where email = $1;`
    const result = await pool.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

async function createUser(data: Omit<UserDB, 'id'>) {
    const query = `insert into sport.users (email, password_hash, role) 
    values ($1, $2, $3)
    returning *;`;
    const result = await pool.query(query, [data.email, data.passwordHash, data.role])
    return result.rows[0];
}


async function createManagerProfile(userId: number, teamId: number) {
    const query = `insert into sport.manager (user_id, team_id) 
    values ($1, $2)`;
    await pool.query(query, [userId, teamId]);
}



export { getUserByEmail, createUser, createManagerProfile };