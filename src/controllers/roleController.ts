import type { Request, Response } from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  deleteRole,
  getRolePermissions,
} from "../models/roleModel";
import {
  getAllPermissions,
  assignPermissionToRole,
  revokePermissionFromRole,
} from "../models/permissionModel";

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.render("layouts/main", {
      title: "Role Management",
      body: "../roles/list",
      roles,
      user: req.user,
    });
  } catch (error) {
    console.error("listRoles error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showCreateRole = async (req: Request, res: Response) => {
  try {
    res.render("layouts/main", { title: "Tambah Role", body: "../roles/create", user: req.user });
  } catch (error) {
    console.error("showCreateRole error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const storeRole = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || String(name).trim() === "") return res.redirect("/roles/create");
    await createRole(String(name).trim().toLowerCase());
    res.redirect("/roles");
  } catch (error) {
    console.error("storeRole error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const removeRole = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id)); // FIX: String()
    if (!isNaN(id)) await deleteRole(id);
    res.redirect("/roles");
  } catch (error) {
    console.error("removeRole error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const showRolePermissions = async (req: Request, res: Response) => {
  try {
    const roleId = parseInt(String(req.params.id)); // FIX: String()
    const role = await getRoleById(roleId);
    if (!role) return res.status(404).send("Role tidak ditemukan");

    const allPermissions = await getAllPermissions();
    const assignedPermissions = await getRolePermissions(roleId);
    const assignedIds = assignedPermissions.map((p) => p.id);

    res.render("layouts/main", {
      title: `Permissions — ${role.name}`,
      body: "../roles/permissions",
      role,
      allPermissions,
      assignedIds,
      user: req.user,
    });
  } catch (error) {
    console.error("showRolePermissions error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const assignPermission = async (req: Request, res: Response) => {
  try {
    const roleId = parseInt(String(req.params.id)); // FIX: String()
    const permissionId = parseInt(String(req.body.permission_id)); // FIX: String()
    await assignPermissionToRole(roleId, permissionId);
    res.redirect(`/roles/${roleId}/permissions`);
  } catch (error) {
    console.error("assignPermission error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const revokePermission = async (req: Request, res: Response) => {
  try {
    const roleId = parseInt(String(req.params.id)); // FIX: String()
    const permId = parseInt(String(req.params.permId)); // FIX: String()
    await revokePermissionFromRole(roleId, permId);
    res.redirect(`/roles/${roleId}/permissions`);
  } catch (error) {
    console.error("revokePermission error:", error);
    res.status(500).send("Internal Server Error");
  }
};
