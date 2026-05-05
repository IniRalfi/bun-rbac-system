import type { Request, Response } from "express";
import { getAllUsers, createUser, deleteUser } from "../models/userModel";

export const listUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.render("layouts/main", {
    title: "User Management",
    body: "../users/list",
    users,
    userRole: req.user?.role_id, // Sekarang req.user udah dikenali
  });
};

export const storeUser = async (req: Request, res: Response) => {
  await createUser(req.body);
  res.redirect("/users");
};

export const removeUser = async (req: Request, res: Response) => {
  const id = req.params.id as string; // Paksa jadi string
  if (id) {
    await deleteUser(parseInt(id));
  }
  res.redirect("/users");
};
