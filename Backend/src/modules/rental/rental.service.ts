import httpStatus from "http-status-codes";
import { Op } from "sequelize";
import AppError from "../../errorHelpers/AppError";
import { Item } from "../item/item.model";
import { Availability } from "../item/Item.interface";
import { NotificationService } from "../notification/notification.service";
import { IRental, RentalStatus } from "./rental.interface";
import { Rental } from "./rental.model";
import { User } from "../user/user.model";

const ALLOWED_TRANSITIONS: Record<RentalStatus, RentalStatus[]> = {
  [RentalStatus.REQUESTED]: [RentalStatus.APPROVED, RentalStatus.REJECTED, RentalStatus.CANCELLED],
  [RentalStatus.APPROVED]: [RentalStatus.ACTIVE, RentalStatus.CANCELLED],
  [RentalStatus.ACTIVE]: [RentalStatus.RETURNED, RentalStatus.OVERDUE],
  [RentalStatus.RETURNED]: [RentalStatus.COMPLETED],
  [RentalStatus.COMPLETED]: [],
  [RentalStatus.REJECTED]: [],
  [RentalStatus.CANCELLED]: [],
  [RentalStatus.OVERDUE]: [],   // Terminal: item not returned on time
};

const createRental = async (payload: Partial<IRental>, renterId: number) => {
  const { itemId, startDate, endDate, message } = payload;

  if (!itemId || !startDate || !endDate) {
    throw new AppError(httpStatus.BAD_REQUEST, "itemId, startDate and endDate are required");
  }

  const item = await Item.findByPk(itemId);
  if (!item) throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  if (item.availability !== Availability.IN_STOCK) {
    throw new AppError(httpStatus.BAD_REQUEST, "Item is not available for rent");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) throw new AppError(httpStatus.BAD_REQUEST, "endDate must be after startDate");

  // Check date conflict
  const conflict = await Rental.findOne({
    where: {
      itemId,
      status: { [Op.in]: [RentalStatus.APPROVED, RentalStatus.ACTIVE] },
      startDate: { [Op.lt]: end },
      endDate: { [Op.gt]: start },
    },
  });
  if (conflict) throw new AppError(httpStatus.CONFLICT, "Item is already booked for those dates");

  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = days * Number(item.price);

  const rental = await Rental.create({
    itemId,
    renterId,
    ownerId: item.ownerId,
    startDate: start,
    endDate: end,
    totalPrice,
    status: RentalStatus.REQUESTED,
    message,
  });

  await NotificationService.createNotification({
    userId: item.ownerId,
    type: "RENTAL_REQUEST",
    message: `New rental request for "${item.title}"`,
    refId: String(rental.id),
  });

  return rental;
};

const updateStatus = async (rentalId: number, newStatus: RentalStatus, userId: number) => {
  const rental = await Rental.findByPk(rentalId, {
    include: [{ model: Item, as: "item", attributes: ["id", "title"] }],
  });
  if (!rental) throw new AppError(httpStatus.NOT_FOUND, "Rental not found");

  const allowed = ALLOWED_TRANSITIONS[rental.status];
  if (!allowed.includes(newStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot transition from ${rental.status} to ${newStatus}`);
  }

  const isOwner = rental.ownerId === userId;
  const isRenter = rental.renterId === userId;

  if ([RentalStatus.APPROVED, RentalStatus.REJECTED, RentalStatus.ACTIVE, RentalStatus.COMPLETED].includes(newStatus) && !isOwner) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the owner can perform this action");
  }
  if (newStatus === RentalStatus.RETURNED && !isRenter) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the renter can mark as returned");
  }

  await rental.update({ status: newStatus });

  const item = await Item.findByPk(rental.itemId);
  if (item) {
    if (newStatus === RentalStatus.ACTIVE) {
      await item.update({ availability: Availability.RENTED });
    } else if ([RentalStatus.COMPLETED, RentalStatus.CANCELLED, RentalStatus.REJECTED].includes(newStatus)) {
      await item.update({ availability: Availability.IN_STOCK });
    }
  }

  const notifyUserId = isOwner ? rental.renterId : rental.ownerId;
  const itemTitle = (rental as any).item?.title || "item";
  await NotificationService.createNotification({
    userId: notifyUserId,
    type: "RENTAL_UPDATE",
    message: `Your rental for "${itemTitle}" is now ${newStatus}`,
    refId: String(rentalId),
  });

  return rental;
};

const myRentals = async (renterId: number) => {
  return Rental.findAll({
    where: { renterId },
    include: [
      { model: Item, as: "item", attributes: ["id", "title", "picture", "price", "sellingCategory"] },
      { model: User, as: "owner", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const myListings = async (ownerId: number) => {
  return Rental.findAll({
    where: { ownerId },
    include: [
      { model: Item, as: "item", attributes: ["id", "title", "picture", "price", "sellingCategory"] },
      { model: User, as: "renter", attributes: ["id", "name", "email", "universityId"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getAvailability = async (itemId: number) => {
  const rentals = await Rental.findAll({
    where: {
      itemId,
      status: { [Op.in]: [RentalStatus.REQUESTED, RentalStatus.APPROVED, RentalStatus.ACTIVE] },
    },
    attributes: ["startDate", "endDate", "status"],
  });
  return rentals.map(r => ({ startDate: r.startDate, endDate: r.endDate, status: r.status }));
};

export const RentalService = {
  createRental,
  updateStatus,
  myRentals,
  myListings,
  getAvailability,
};
