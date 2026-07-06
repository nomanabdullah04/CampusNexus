import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { ITransaction, TransactionType, TransactionStatus } from "./transaction.interface";

interface TransactionCreationAttributes extends Optional<ITransaction, "id"> {}

export class Transaction extends Model<ITransaction, TransactionCreationAttributes> implements ITransaction {
  public id!: number;
  public userId!: number;
  public rentalId!: number;
  public type!: TransactionType;
  public amount!: number;
  public status!: TransactionStatus;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    rentalId: { type: DataTypes.INTEGER, field: "rental_id" },
    type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(TransactionStatus)),
      defaultValue: TransactionStatus.PENDING,
    },
    description: { type: DataTypes.STRING(255) },
  },
  {
    sequelize,
    tableName: "transaction",
    timestamps: true,
  }
);
