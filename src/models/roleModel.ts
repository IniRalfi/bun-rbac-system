import pool from "../config/database";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Role extends RowDataPacket {
  id: number;
  name: string;
  created_at?: Date;
  permission_count?: number; // optional, dari query JOIN
}

export interface RoleWithPermissions extends Role {
  permissions: { id: number; name: string; resource: string; action: string }[];
}

export const getAllRoles = async (): Promise<Role[]> => {
  const [rows] = await pool.query<Role[]>(`
    SELECT r.*, COUNT(rp.permission_id) as permission_count
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    GROUP BY r.id
    ORDER BY r.id
  `);
  return rows;
};

export const getRoleById = async (id: number): Promise<Role | null> => {
  const [rows] = await pool.query<Role[]>("SELECT * FROM roles WHERE id = ?", [id]);
  return rows[0] || null;
};

export const createRole = async (name: string) => {
  const [result] = await pool.query<ResultSetHeader>("INSERT INTO roles (name) VALUES (?)", [name]);
  return result;
};

export const deleteRole = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM roles WHERE id = ?", [id]);
  return result;
};

export const getRolePermissions = async (roleId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT p.id, p.name, p.resource, p.action
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = ?
    ORDER BY p.resource, p.action
  `,
    [roleId],
  );
  return rows;
};
