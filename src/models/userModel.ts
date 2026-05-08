import pool from "../config/database";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password?: string;
  role_id: number;
  role_name?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(`
    SELECT u.id, u.username, u.role_id, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    ORDER BY u.id
  `);
  return rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.query<User[]>(
    `
    SELECT u.id, u.username, u.role_id, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `,
    [id],
  );
  return rows[0] || null;
};

export const findByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await pool.query<User[]>("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0] || null;
};

export const createUser = async (userData: {
  username: string;
  password: string;
  role_id: number;
}) => {
  const { username, password, role_id } = userData;
  const hashedPassword = await Bun.password.hash(password);
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
    [username, hashedPassword, role_id],
  );
  return result;
};

export const updateUser = async (id: number, data: { role_id: number }) => {
  const [result] = await pool.query<ResultSetHeader>("UPDATE users SET role_id = ? WHERE id = ?", [
    data.role_id,
    id,
  ]);
  return result;
};

export const deleteUser = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [id]);
  return result;
};
