import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IWallet, WalletStatus } from "./wallet.interface";

interface WalletCreationAttributes extends Optional<IWallet, "id"> {}

export class Wallet extends Model<IWallet, WalletCreationAttributes> implements IWallet {
  public id!: number;
  public ownerId!: number;
  public balance!: number;
  public status!: WalletStatus;
}

Wallet.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "owner_id",
    },
    balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 100 },
    status: {
      type: DataTypes.ENUM(...Object.values(WalletStatus)),
      defaultValue: WalletStatus.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: "wallet",
    timestamps: true,
  }
);