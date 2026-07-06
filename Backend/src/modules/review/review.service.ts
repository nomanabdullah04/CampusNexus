import httpStatus from "http-status-codes";
import { fn, col, literal } from "sequelize";
import AppError from "../../errorHelpers/AppError";
import { Item } from "../item/item.model";
import { Rental } from "../rental/rental.model";
import { RentalStatus } from "../rental/rental.interface";
import { NotificationService } from "../notification/notification.service";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import { User } from "../user/user.model";

const createReview = async (payload: Partial<IReview>, reviewerId: number) => {
  const { itemId, rentalId, rating, comment } = payload;

  if (!itemId || !rentalId || !rating) {
    throw new AppError(httpStatus.BAD_REQUEST, "itemId, rentalId and rating are required");
  }

  const rental = await Rental.findByPk(rentalId);
  if (!rental) throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
  if (rental.status !== RentalStatus.COMPLETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "You can only review after the rental is completed");
  }
  if (rental.renterId !== reviewerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the renter can submit a review");
  }

  const existing = await Review.findOne({ where: { rentalId } });
  if (existing) throw new AppError(httpStatus.CONFLICT, "You have already reviewed this rental");

  const review = await Review.create({ itemId, rentalId, reviewerId, rating, comment } as IReview);

  // Recalculate item avgRating using SQL AVG
  const agg: any = await Review.findOne({
    where: { itemId },
    attributes: [
      [fn("AVG", col("rating")), "avg"],
      [fn("COUNT", col("id")), "count"],
    ],
    raw: true,
  });

  if (agg) {
    await Item.update(
      {
        avgRating: Math.round(Number(agg.avg) * 10) / 10,
        reviewCount: Number(agg.count),
      },
      { where: { id: itemId } }
    );
  }

  const item = await Item.findByPk(itemId);
  if (item) {
    await NotificationService.createNotification({
      userId: item.ownerId,
      type: "REVIEW_RECEIVED",
      message: `Your item "${item.title}" received a ${rating}-star review`,
      refId: String(review.id),
    });
  }

  return review;
};

const getItemReviews = async (itemId: number) => {
  return Review.findAll({
    where: { itemId },
    include: [{ model: User, as: "reviewer", attributes: ["id", "name", "picture", "universityId"] }],
    order: [["createdAt", "DESC"]],
  });
};

export const ReviewService = { createReview, getItemReviews };
