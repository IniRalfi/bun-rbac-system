import { Router } from "express";
import {
  listRoles,
  showCreateRole,
  storeRole,
  removeRole,
  showRolePermissions,
  assignPermission,
  revokePermission,
} from "../controllers/roleController";
import { checkPermission, isAuthenticated } from "../middleware/rbacMiddleware";

const router = Router();

router.use(isAuthenticated); // Proteksi semua route di bawah ini

router.get("/", checkPermission("role:view"), listRoles);
router.get("/create", checkPermission("role:create"), showCreateRole);
router.post("/", checkPermission("role:create"), storeRole);
router.delete("/:id", checkPermission("role:delete"), removeRole);
router.get("/:id/permissions", checkPermission("role:edit"), showRolePermissions);
router.post("/:id/permissions", checkPermission("role:edit"), assignPermission);
router.delete("/:id/permissions/:permId", checkPermission("role:edit"), revokePermission);

export default router;
