import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IReview } from "./review.interface";

interface ReviewCreationAttributes extends Optional<IReview, "id"> {}

export class Review extends Model<IReview, ReviewCreationAttributes> implements IReview {
  public id!: number;
  public itemId!: number;
  public rentalId!: number;
  public reviewerId!: number;
  public rating!: 1 | 2 | 3 | 4 | 5;
  public comment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    itemId: { type: DataTypes.INTEGER, allowNull: false, field: "item_id" },
    rentalId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: "rental_id" },
    reviewerId: { type: DataTypes.INTEGER, allowNull: false, field: "reviewer_id" },
    rating: { type: DataTypes.TINYINT, allowNull: false },
    comment: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "review",
    timestamps: true,
  }
);
