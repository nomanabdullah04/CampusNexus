import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RefundService } from "./refund.service";
import { RefundStatus } from "./refund.interface";

const createRefund = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await RefundService.createRefund(userId, req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Refund request submitted", data });
});

const getMyRefunds = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await RefundService.getMyRefunds(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Refunds retrieved", data });
});

const getAllRefunds = catchAsync(async (req: Request, res: Response) => {
  const data = await RefundService.getAllRefunds();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "All refunds retrieved", data });
});

const resolveRefund = catchAsync(async (req: Request, res: Response) => {
  const { status, adminNote } = req.body as { status: RefundStatus; adminNote?: string };
  const data = await RefundService.resolveRefund(Number(req.params.id), status, adminNote);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Refund resolved", data });
});

export const RefundController = { createRefund, getMyRefunds, getAllRefunds, resolveRefund };
