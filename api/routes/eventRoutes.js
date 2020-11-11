import { Router } from "express";
import eventController from "../controllers/eventController.js";
import verify from "../middleware";

const router = Router().use(verify);

router.get("/", eventController.getEvents);
router.post("/", eventController.addEvent);
router.get("/:id", eventController.getEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;
