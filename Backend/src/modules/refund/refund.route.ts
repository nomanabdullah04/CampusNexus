import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { RefundController } from "./refund.controller";

const router = Router();
const auth = checkAuth("BUYER", "SELLER", "ADMIN");
const adminAuth = checkAuth("ADMIN");

router.post("/", auth, RefundController.createRefund);
router.get("/my", auth, RefundController.getMyRefunds);
router.get("/", adminAuth, RefundController.getAllRefunds);
router.patch("/:id/resolve", adminAuth, RefundController.resolveRefund);

export const RefundRoutes = router;
