import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ReviewController } from "./review.controller";

const router = Router();

// Submit a review (must be logged in, rental must be COMPLETED)
router.post("/", checkAuth(Role.BUYER, Role.SELLER), ReviewController.createReview);

// Get all reviews for an item (public)
router.get("/:itemId", ReviewController.getItemReviews);

export const ReviewRoutes = router;
