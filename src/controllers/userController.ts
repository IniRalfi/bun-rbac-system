import type { Request, Response } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../models/userModel";
import { getAllRoles } from "../models/roleModel";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.render("layouts/main", {
      title: "User Management",
      body: "../users/list",
      users,
      user: req.user,
    });
  } catch (error) {
    console.error("listUsers error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showCreateUser = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.render("layouts/main", {
      title: "Tambah User",
      body: "../users/create",
      roles,
      user: req.user,
    });
  } catch (error) {
    console.error("showCreateUser error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const storeUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role_id } = req.body;
    if (!username || !password || !role_id) return res.redirect("/users/create");
    await createUser({
      username: String(username),
      password: String(password),
      role_id: parseInt(String(role_id)),
    });
    res.redirect("/users");
  } catch (error) {
    console.error("storeUser error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showEditUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id)); // FIX: String()
    const targetUser = await getUserById(id);
    if (!targetUser) return res.status(404).send("User tidak ditemukan");

    const roles = await getAllRoles();
    res.render("layouts/main", {
      title: "Edit User",
      body: "../users/edit",
      targetUser,
      roles,
      user: req.user,
    });
  } catch (error) {
    console.error("showEditUser error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id)); // FIX: String()
    const { role_id } = req.body;
    if (!isNaN(id) && role_id) await updateUser(id, { role_id: parseInt(String(role_id)) });
    res.redirect("/users");
  } catch (error) {
    console.error("editUser error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id)); // FIX: String()
    if (!isNaN(id)) await deleteUser(id);
    res.redirect("/users");
  } catch (error) {
    console.error("removeUser error:", error);
    res.status(500).send("Internal Server Error");
  }
};
