import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RentalController } from "./rental.controller";

const router = Router();

// Renter creates a rental request
router.post("/", checkAuth(Role.BUYER, Role.SELLER), RentalController.createRental);

// Owner/Renter updates rental status
router.patch("/:id/status", checkAuth(Role.BUYER, Role.SELLER), RentalController.updateStatus);

// Renter view: my rentals (items I'm renting)
router.get("/my-rentals", checkAuth(Role.BUYER, Role.SELLER), RentalController.myRentals);

// Owner view: incoming requests on my listed items
router.get("/my-listings", checkAuth(Role.BUYER, Role.SELLER), RentalController.myListings);

// Public: get booked date ranges for calendar
router.get("/availability/:itemId", RentalController.getAvailability);

export const RentalRoutes = router;
