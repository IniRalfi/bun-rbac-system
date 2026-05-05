// src/models/userModel.ts
import pool from "../config/database";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password?: string;
  role_id: number;
  role_name?: string; // Optional: untuk join nama role
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(`
    SELECT u.*, r.name as role_name 
    FROM users u 
    LEFT JOIN roles r ON u.role_id = r.id
  `);
  return rows;
};

export const findByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0] || null;
};

export const createUser = async (userData: any) => {
  const { username, password, role_id } = userData;
  // Hash password pake fitur bawaan Bun (lebih kenceng & aman)
  const hashedPassword = await Bun.password.hash(password);

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
    [username, hashedPassword, role_id],
  );
  return result;
};

export const deleteUser = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [id]);
  return result;
};
