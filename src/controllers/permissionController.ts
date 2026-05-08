import type { Request, Response } from "express";
import { getAllPermissions, createPermission, deletePermission } from "../models/permissionModel";

export const listPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await getAllPermissions();
    res.render("layouts/main", {
      title: "Permission Management",
      body: "../permissions/list",
      permissions,
      user: req.user,
    });
  } catch (error) {
    console.error("listPermissions error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showCreatePermission = async (req: Request, res: Response) => {
  try {
    res.render("layouts/main", {
      title: "Tambah Permission",
      body: "../permissions/create",
      user: req.user,
    });
  } catch (error) {
    console.error("showCreatePermission error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const storePermission = async (req: Request, res: Response) => {
  try {
    const { resource, action } = req.body;
    if (!resource || !action) return res.redirect("/permissions/create");
    const name = `${String(resource).trim()}:${String(action).trim()}`;
    await createPermission({
      name,
      resource: String(resource).trim(),
      action: String(action).trim(),
    });
    res.redirect("/permissions");
  } catch (error) {
    console.error("storePermission error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const removePermission = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id)); // FIX: String()
    if (!isNaN(id)) await deletePermission(id);
    res.redirect("/permissions");
  } catch (error) {
    console.error("removePermission error:", error);
    res.status(500).send("Internal Server Error");
  }
};
