import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IRental, RentalStatus } from "./rental.interface";

interface RentalCreationAttributes extends Optional<IRental, "id"> {}

export class Rental extends Model<IRental, RentalCreationAttributes> implements IRental {
  public id!: number;
  public _id!: number;
  public itemId!: number;
  public renterId!: number;
  public ownerId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public totalPrice!: number;
  public status!: RentalStatus;
  public depositPaid!: number;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rental.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("id");
      },
    },
    itemId: { type: DataTypes.INTEGER, allowNull: false, field: "item_id" },
    renterId: { type: DataTypes.INTEGER, allowNull: false, field: "renter_id" },
    ownerId: { type: DataTypes.INTEGER, allowNull: false, field: "owner_id" },
    startDate: { type: DataTypes.DATE, allowNull: false, field: "start_date" },
    endDate: { type: DataTypes.DATE, allowNull: false, field: "end_date" },
    totalPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: "total_price" },
    depositPaid: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, field: "deposit_paid" },
    status: {
      type: DataTypes.ENUM(...Object.values(RentalStatus)),
      defaultValue: RentalStatus.REQUESTED,
    },
    message: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "rental",
    timestamps: true,
  }
);
