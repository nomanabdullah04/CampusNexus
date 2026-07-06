import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { ICart } from "./cart.interface";

interface CartCreationAttributes extends Optional<ICart, "id"> {}

export class Cart extends Model<ICart, CartCreationAttributes> implements ICart {
  public id!: number;
  public userId!: number;
  public itemId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public quantity!: number;
  public item?: any; // populated by association
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    itemId: { type: DataTypes.INTEGER, allowNull: false, field: "item_id" },
    startDate: { type: DataTypes.DATEONLY, field: "start_date" },
    endDate: { type: DataTypes.DATEONLY, field: "end_date" },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { sequelize, tableName: "cart", timestamps: true }
);
