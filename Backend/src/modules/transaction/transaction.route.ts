import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TransactionController } from "./transaction.controller";

const router = Router();
router.get("/my", checkAuth("BUYER", "SELLER", "ADMIN"), TransactionController.getMyTransactions);

export const TransactionRoutes = router;
