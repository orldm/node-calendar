import { Router } from "express";
import UserController from "../controllers/userController.js";
import verify from "../middleware";

const router = Router().use(verify);

router.get("/", UserController.getUsers);
router.post("/", UserController.addUser);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
