import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { NotificationController } from "./notification.controller";

const router = Router();

// Poll for notifications (frontend polls every 30s)
router.get("/", checkAuth(Role.BUYER, Role.SELLER), NotificationController.getNotifications);

// Mark single notification as read
router.patch("/:id/read", checkAuth(Role.BUYER, Role.SELLER), NotificationController.markAsRead);

// Mark all as read
router.patch("/mark-all-read", checkAuth(Role.BUYER, Role.SELLER), NotificationController.markAllRead);

export const NotificationRoutes = router;
