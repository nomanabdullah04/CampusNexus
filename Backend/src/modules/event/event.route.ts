import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { EventController } from "./event.controller";

const router = Router();
const auth = checkAuth("BUYER", "SELLER", "ADMIN");
const adminAuth = checkAuth("ADMIN");

// Public
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);

// Authenticated users
router.post("/:id/register", auth, EventController.registerForEvent);
router.delete("/:id/unregister", auth, EventController.unregisterFromEvent);
router.get("/:id/registrations", adminAuth, EventController.getEventRegistrations);

// Admin only
router.post("/", adminAuth, EventController.createEvent);
router.patch("/:id/approve", adminAuth, EventController.approveEvent);
router.delete("/:id", adminAuth, EventController.deleteEvent);

export const EventRoutes = router;
