import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RentalStatus } from "./rental.interface";
import { RentalService } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const renterId = Number(req.user.userId);
  const rental = await RentalService.createRental(req.body, renterId);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Rental request created", data: rental });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status: RentalStatus };
  const userId = Number(req.user.userId);
  const rental = await RentalService.updateStatus(id, status, userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Rental status updated", data: rental });
});

const myRentals = catchAsync(async (req: Request, res: Response) => {
  const renterId = Number(req.user.userId);
  const rentals = await RentalService.myRentals(renterId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "My rentals retrieved", data: rentals });
});

const myListings = catchAsync(async (req: Request, res: Response) => {
  const ownerId = Number(req.user.userId);
  const rentals = await RentalService.myListings(ownerId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "My listings retrieved", data: rentals });
});

const getAvailability = catchAsync(async (req: Request, res: Response) => {
  const itemId = Number(req.params.itemId);
  if (!itemId || isNaN(itemId)) {
    return sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Availability retrieved", data: [] });
  }
  const availability = await RentalService.getAvailability(itemId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Availability retrieved", data: availability });
});

export const RentalController = { createRental, updateStatus, myRentals, myListings, getAvailability };
