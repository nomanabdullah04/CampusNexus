import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get("/stats", checkAuth(Role.BUYER, Role.SELLER, Role.ADMIN), DashboardController.getStats);

export const DashboardRoutes = router;
