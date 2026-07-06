import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ReportController } from "./report.controller";

const router = Router();
const auth = checkAuth("BUYER", "SELLER", "ADMIN");
const adminAuth = checkAuth("ADMIN");

router.post("/", auth, ReportController.createReport);
router.get("/my", auth, ReportController.getMyReports);
router.get("/", adminAuth, ReportController.getAllReports);
router.patch("/:id/resolve", adminAuth, ReportController.resolveReport);

export const ReportRoutes = router;
