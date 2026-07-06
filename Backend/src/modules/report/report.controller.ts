import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReportService } from "./report.service";
import { ReportStatus } from "./report.interface";

const createReport = catchAsync(async (req: Request, res: Response) => {
  const reporterId = Number(req.user.userId);
  const report = await ReportService.createReport(reporterId, req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Report submitted successfully", data: report });
});

const getMyReports = catchAsync(async (req: Request, res: Response) => {
  const reporterId = Number(req.user.userId);
  const data = await ReportService.getMyReports(reporterId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Your reports retrieved", data });
});

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const data = await ReportService.getAllReports();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "All reports retrieved", data });
});

const resolveReport = catchAsync(async (req: Request, res: Response) => {
  const reportId = Number(req.params.id);
  const { status, adminNote } = req.body as { status: ReportStatus; adminNote?: string };
  const data = await ReportService.resolveReport(reportId, status, adminNote);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Report resolved", data });
});

export const ReportController = { createReport, getMyReports, getAllReports, resolveReport };
