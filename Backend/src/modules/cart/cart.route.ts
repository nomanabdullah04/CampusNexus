import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { CartController } from "./cart.controller";

const router = Router();
const auth = checkAuth("BUYER", "SELLER", "ADMIN");

router.get("/", auth, CartController.getCart);
router.post("/add", auth, CartController.addToCart);
router.post("/checkout", auth, CartController.checkoutCart);
router.delete("/clear", auth, CartController.clearCart);
router.delete("/:id", auth, CartController.removeFromCart);

export const CartRoutes = router;
