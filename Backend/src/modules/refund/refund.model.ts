import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IRefund, RefundStatus } from "./refund.interface";

interface RefundCreationAttributes extends Optional<IRefund, "id"> {}

export class Refund extends Model<IRefund, RefundCreationAttributes> implements IRefund {
  public id!: number;
  public rentalId!: number;
  public requesterId!: number;
  public reason!: string;
  public proof!: string;
  public status!: RefundStatus;
  public adminNote!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Refund.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    rentalId: { type: DataTypes.INTEGER, allowNull: false, field: "rental_id" },
    requesterId: { type: DataTypes.INTEGER, allowNull: false, field: "requester_id" },
    reason: { type: DataTypes.TEXT, allowNull: false },
    proof: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM(...Object.values(RefundStatus)),
      defaultValue: RefundStatus.PENDING,
    },
    adminNote: { type: DataTypes.TEXT, field: "admin_note" },
  },
  { sequelize, tableName: "refund", timestamps: true }
);
