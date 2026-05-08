import type { Request, Response, NextFunction } from "express";
import pool from "../config/database";

// ─── Middleware: Cek apakah user sudah login ───────────────────────────────
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.id) return next();
  return res.redirect("/login?error=unauthenticated");
};

// ─── Middleware: Cek permission berdasarkan role ───────────────────────────
export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.redirect("/login?error=unauthenticated");

      const [rows] = await pool.query(
        `SELECT p.name 
         FROM users u
         JOIN roles r ON u.role_id = r.id
         JOIN role_permissions rp ON r.id = rp.role_id
         JOIN permissions p ON rp.permission_id = p.id
         WHERE u.id = ?`,
        [userId],
      );

      const permissions = (rows as any[]).map((row) => row.name);

      if (permissions.includes(requiredPermission)) return next();

      // Render halaman 403 HTML (bukan JSON lagi)
      return res.status(403).render("errors/403", {
        title: "403 — Akses Ditolak",
        requiredPermission,
        user: req.user,
      });
    } catch (error) {
      console.error("RBAC Middleware Error:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
};
