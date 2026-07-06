import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user.userId;
  const stats = await DashboardService.getOwnerStats(ownerId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard stats retrieved",
    data: stats,
  });
});

export const DashboardController = { getStats };
