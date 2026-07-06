import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IItem, ItemCategory, Availability, ItemCondition, ObjectCategory } from "./Item.interface";

interface ItemCreationAttributes extends Optional<IItem, "id"> {}

export class Item extends Model<IItem, ItemCreationAttributes> implements IItem {
  public id!: number;
  public ownerId!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public deposit!: number;
  public condition!: ItemCondition;
  public sellingCategory!: ItemCategory;
  public availability!: Availability;
  public objectCategory!: ObjectCategory;
  public tags!: string;
  public picture!: string;
  public pictures!: string;
  public avgRating!: number;
  public reviewCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "owner_id",
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    deposit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },   // Proposal: refundable security deposit
    condition: {
      type: DataTypes.ENUM("NEW", "USED", "FAIR"),                   // Proposal: new/used/fair
      defaultValue: ItemCondition.USED,
    },
    sellingCategory: {
      type: DataTypes.ENUM(...Object.values(ItemCategory)),
      allowNull: false,
      field: "selling_category",
    },
    availability: {
      type: DataTypes.ENUM(...Object.values(Availability)),
      defaultValue: Availability.IN_STOCK,
    },
    objectCategory: {
      type: DataTypes.ENUM(...Object.values(ObjectCategory)),
      allowNull: false,
      field: "object_category",
    },
    tags: { type: DataTypes.TEXT },
    picture: { type: DataTypes.TEXT },
    pictures: { type: DataTypes.TEXT },
    avgRating: { type: DataTypes.FLOAT, defaultValue: 0, field: "avg_rating" },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0, field: "review_count" },
  },
  {
    sequelize,
    tableName: "item",
    timestamps: true,
  }
);
