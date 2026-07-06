import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IUser, Role, Status } from "./user.interface";

interface UserCreationAttributes extends Optional<IUser, "id"> {}

export class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public universityId!: string;
  public phone!: string;
  public presentAddress!: string;
  public picture!: string;
  public activeRole!: Role;
  public isVerified!: boolean;
  public isStatus!: Status;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    universityId: { type: DataTypes.STRING(50), field: "university_id" },
    phone: { type: DataTypes.STRING(20) },
    presentAddress: { type: DataTypes.STRING(255), field: "present_address" },
    picture: { type: DataTypes.TEXT },
    activeRole: {
      type: DataTypes.ENUM(...Object.values(Role)),
      defaultValue: Role.BUYER,
      field: "active_role",
    },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_verified" },
    isStatus: {
      type: DataTypes.ENUM(...Object.values(Status)),
      defaultValue: Status.PENDING,
      field: "is_status",
    },
  },
  {
    sequelize,
    tableName: "user",
    underscored: false,
    timestamps: true,
  }
);