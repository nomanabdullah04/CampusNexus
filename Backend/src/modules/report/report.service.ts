import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IReport, ReportStatus } from "./report.interface";
import { Report } from "./report.model";

const createReport = async (reporterId: number, payload: Partial<IReport>) => {
  const { targetType, targetId, reason, details } = payload;
  if (!targetType || !targetId || !reason) {
    throw new AppError(httpStatus.BAD_REQUEST, "targetType, targetId and reason are required");
  }
  const existing = await Report.findOne({ where: { reporterId, targetType, targetId } });
  if (existing) throw new AppError(httpStatus.CONFLICT, "You have already reported this");

  return Report.create({ reporterId, targetType, targetId, reason, details, status: ReportStatus.PENDING } as IReport);
};

const getMyReports = async (reporterId: number) => {
  return Report.findAll({ where: { reporterId }, order: [["createdAt", "DESC"]] });
};

const getAllReports = async () => {
  return Report.findAll({ order: [["createdAt", "DESC"]] });
};

const resolveReport = async (reportId: number, status: ReportStatus, adminNote?: string) => {
  const report = await Report.findByPk(reportId);
  if (!report) throw new AppError(httpStatus.NOT_FOUND, "Report not found");
  await report.update({ status, adminNote });
  return report;
};

export const ReportService = { createReport, getMyReports, getAllReports, resolveReport };
