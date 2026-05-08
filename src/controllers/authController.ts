import type { Request, Response } from "express";
import { findByUsername } from "../models/userModel";

export const loginPage = (req: Request, res: Response) => {
  // Jika sudah login, langsung ke dashboard
  if (req.user?.id) return res.redirect("/users");

  const error = req.query.error as string | undefined;
  let errorMessage = "";
  if (error === "invalid_credentials") errorMessage = "Username atau password salah.";
  if (error === "unauthenticated") errorMessage = "Silakan login terlebih dahulu.";

  res.render("auth/login", { title: "Login — RBAC System", errorMessage });
};

export const loginProcess = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await findByUsername(String(username));

    if (user && (await Bun.password.verify(String(password), user.password!))) {
      (req as any).session.user = {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
      };
      return res.redirect("/users");
    }

    return res.redirect("/login?error=invalid_credentials");
  } catch (error) {
    console.error("loginProcess error:", error);
    return res.redirect("/login?error=invalid_credentials");
  }
};

export const logout = (req: Request, res: Response) => {
  (req as any).session.destroy(() => {
    res.redirect("/login");
  });
};
