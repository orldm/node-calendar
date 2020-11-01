import { Router } from "express";
import UserController from "../controllers/userController.js";

const router = Router();

router.get("/", UserController.getUsers);
router.post("/", UserController.addUser);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
