import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET!;