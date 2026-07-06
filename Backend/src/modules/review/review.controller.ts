import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewerId = Number(req.user.userId);
  const review = await ReviewService.createReview(req.body, reviewerId);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Review submitted successfully", data: review });
});

const getItemReviews = catchAsync(async (req: Request, res: Response) => {
  const itemId = Number(req.params.itemId);
  const reviews = await ReviewService.getItemReviews(itemId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Reviews retrieved", data: reviews });
});

export const ReviewController = { createReview, getItemReviews };
