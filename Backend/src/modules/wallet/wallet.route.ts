import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletController } from "./wallet.controller";

const router = Router();
const auth = checkAuth("BUYER", "SELLER", "ADMIN");

router.post("/deposit", auth, WalletController.deposit);

export const WalletRoutes = router;
