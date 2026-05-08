import { Router } from "express";
import {
  listPermissions,
  showCreatePermission,
  storePermission,
  removePermission,
} from "../controllers/permissionController";
import { checkPermission, isAuthenticated } from "../middleware/rbacMiddleware";

const router = Router();

router.use(isAuthenticated); // Proteksi semua route di bawah ini

router.get("/", checkPermission("permission:view"), listPermissions);
router.get("/create", checkPermission("permission:create"), showCreatePermission);
router.post("/", checkPermission("permission:create"), storePermission);
router.delete("/:id", checkPermission("permission:delete"), removePermission);

export default router;
