import { Router } from "express";
import AuthController from "../controllers/authController.js";
import verify from "../middleware";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh_tokens", verify, AuthController.refreshTokens);
router.get("/check_access", verify, AuthController.checkAccess);

export default router;
