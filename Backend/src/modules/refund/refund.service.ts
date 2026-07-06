import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Rental } from "../rental/rental.model";
import { NotificationService } from "../notification/notification.service";
import { IRefund, RefundStatus } from "./refund.interface";
import { Refund } from "./refund.model";

const createRefund = async (requesterId: number, payload: Partial<IRefund>) => {
  const { rentalId, reason, proof } = payload;
  if (!rentalId || !reason) throw new AppError(httpStatus.BAD_REQUEST, "rentalId and reason are required");

  const rental = await Rental.findByPk(rentalId);
  if (!rental) throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
  if (rental.renterId !== requesterId) throw new AppError(httpStatus.FORBIDDEN, "Not your rental");

  const existing = await Refund.findOne({ where: { rentalId } });
  if (existing) throw new AppError(httpStatus.CONFLICT, "Refund already requested for this rental");

  const refund = await Refund.create({ rentalId, requesterId, reason, proof, status: RefundStatus.PENDING });

  await NotificationService.createNotification({
    userId: rental.ownerId,
    type: "GENERAL",
    message: `A refund request has been submitted for rental #${rentalId}`,
    refId: String(refund.id),
  });

  return refund;
};

const getMyRefunds = async (userId: number) => {
  return Refund.findAll({ where: { requesterId: userId }, order: [["createdAt", "DESC"]] });
};

const getAllRefunds = async () => {
  return Refund.findAll({ order: [["createdAt", "DESC"]] });
};

const resolveRefund = async (refundId: number, status: RefundStatus, adminNote?: string) => {
  const refund = await Refund.findByPk(refundId);
  if (!refund) throw new AppError(httpStatus.NOT_FOUND, "Refund not found");
  await refund.update({ status, adminNote });

  await NotificationService.createNotification({
    userId: refund.requesterId,
    type: "GENERAL",
    message: `Your refund request has been ${status.toLowerCase()}`,
    refId: String(refundId),
  });

  return refund;
};

export const RefundService = { createRefund, getMyRefunds, getAllRefunds, resolveRefund };
