import type { Request, Response } from "express";
import { findByUsername } from "../models/userModel";

export const loginPage = (req: Request, res: Response) => {
  res.render("auth/login", { title: "Login" });
};

export const loginProcess = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await findByUsername(username);

  if (user && (await Bun.password.verify(password, user.password!))) {
    // Simpan data user ke session (kita asumsikan pakai express-session nanti)
    // Untuk sekarang kita simulasi dulu
    (req as any).session.user = {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
    };
    return res.redirect("/users");
  }

  res.status(401).send("Invalid username or password");
};

export const logout = (req: Request, res: Response) => {
  (req as any).session.destroy();
  res.redirect("/login");
};
