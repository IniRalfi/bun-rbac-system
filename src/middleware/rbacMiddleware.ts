import type { Request, Response, NextFunction } from "express";
import pool from "../config/database";

interface AuthRequest extends Request {
  user?: { id: number; username: string; role_id: number };
}

export const checkPermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      // 1. Cek apakah user sudah terautentikasi (Auth middleware harus jalan duluan)
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 2. Ambil permissions dari DB
      // Note: Di produksi, pertimbangkan caching atau masukkan ke JWT payload
      const [rows] = await pool.query(
        `
        SELECT p.name 
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
      `,
        [userId],
      );

      const permissions = (rows as any[]).map((row) => row.name);

      // 3. Validasi permission
      if (permissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({
        message: `Forbidden: You need '${requiredPermission}' permission`,
      });
    } catch (error) {
      console.error("RBAC Middleware Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
