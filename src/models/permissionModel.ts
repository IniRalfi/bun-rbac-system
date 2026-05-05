import pool from "../config/database";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Permission extends RowDataPacket {
  id: number;
  name: string;
  resource: string;
  source: string; // Sesuaikan dengan nama kolom di SQL tadi (source)
}

export const getAllPermissions = async (): Promise<Permission[]> => {
  // Pakai "=" bukan ":", dan SQL-nya dibungkus kutip
  const [rows] = await pool.query<Permission[]>("SELECT * FROM permissions");
  return rows;
};

export const assignPermissionToRole = async (roleId: number, permissionId: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
    [roleId, permissionId],
  );
  return result;
};
