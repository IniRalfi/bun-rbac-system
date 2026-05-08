import { Router } from "express";
import {
  listUsers,
  showCreateUser,
  storeUser,
  showEditUser,
  editUser,
  removeUser,
} from "../controllers/userController";
import { checkPermission, isAuthenticated } from "../middleware/rbacMiddleware";

const router = Router();

router.use(isAuthenticated); // Proteksi semua route di bawah ini

router.get("/", checkPermission("user:view"), listUsers);
router.get("/create", checkPermission("user:create"), showCreateUser);
router.post("/", checkPermission("user:create"), storeUser);
router.get("/:id/edit", checkPermission("user:edit"), showEditUser);
router.put("/:id", checkPermission("user:edit"), editUser);
router.delete("/:id", checkPermission("user:delete"), removeUser);

export default router;
