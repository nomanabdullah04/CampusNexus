import { fn, col, literal } from "sequelize";
import { Rental } from "../rental/rental.model";
import { RentalStatus } from "../rental/rental.interface";
import { Review } from "../review/review.model";
import { Item } from "../item/item.model";

const getOwnerStats = async (ownerId: number) => {
  // Total earnings from completed rentals
  const earningResult: any = await Rental.findOne({
    where: { ownerId, status: RentalStatus.COMPLETED },
    attributes: [[fn("SUM", col("total_price")), "total"]],
    raw: true,
  });
  const totalEarnings = Number(earningResult?.total || 0);

  // Count per status
  const statusRows: any[] = await Rental.findAll({
    where: { ownerId },
    attributes: ["status", [fn("COUNT", col("id")), "count"]],
    group: ["status"],
    raw: true,
  });
  const rentalCounts: Record<string, number> = {};
  statusRows.forEach((r: any) => { rentalCounts[r.status] = Number(r.count); });
  const totalRentals = Object.values(rentalCounts).reduce((a, b) => a + b, 0);

  // Category breakdown: join rentals → items
  const categoryRows: any[] = await Rental.findAll({
    where: { ownerId },
    include: [{ model: Item, as: "item", attributes: [] }],
    attributes: [
      [col("item.object_category"), "name"],
      [fn("COUNT", col("Rental.id")), "value"],
    ],
    group: [col("item.object_category")],
    order: [[literal("value"), "DESC"]],
    limit: 10,
    raw: true,
  });

  // Recent 5 rentals
  const recentRentals = await Rental.findAll({
    where: { ownerId },
    include: [
      { model: Item, as: "item", attributes: ["id", "title", "picture"] },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  // Average rating on owner's items
  const ratingResult: any = await Review.findOne({
    include: [{ model: Item, as: "item", attributes: [], where: { ownerId } }],
    attributes: [
      [fn("AVG", col("Review.rating")), "avg"],
      [fn("COUNT", col("Review.id")), "count"],
    ],
    raw: true,
  });

  return {
    totalEarnings,
    rentalCounts,
    totalRentals,
    categoryBreakdown: categoryRows.map((c: any) => ({ name: c.name, value: Number(c.value) })),
    recentRentals,
    averageRating: ratingResult?.avg ? Math.round(Number(ratingResult.avg) * 10) / 10 : 0,
    totalReviews: Number(ratingResult?.count || 0),
  };
};

export const DashboardService = { getOwnerStats };
