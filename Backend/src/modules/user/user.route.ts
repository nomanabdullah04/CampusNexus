import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { UserControllers } from "./user.controller";


const router = Router();

router.get("/me", checkAuth(Role.BUYER, Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getMe)

export const UserRoutes = router;