import httpStatus from "http-status-codes";
import { Op } from "sequelize";
import { IItem, QueryParams, Availability } from "./Item.interface";
import { Item } from "./item.model";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { Rental } from "../rental/rental.model";

const createItem = async (payload: Partial<IItem>, userId: number) => {
  if (
    !payload.ownerId ||
    !payload.title ||
    !payload.price ||
    !payload.sellingCategory ||
    !payload.objectCategory
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Missing required fields for item creation"
    );
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (payload.ownerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to post from this account"
    );
  }

  // Convert tags array to JSON string for MySQL storage
  const itemData: any = {
    ...payload,
    availability: payload.availability || Availability.IN_STOCK,
    tags: Array.isArray(payload.tags) ? JSON.stringify(payload.tags) : payload.tags,
    pictures: Array.isArray(payload.pictures) ? JSON.stringify(payload.pictures) : payload.pictures,
  };

  const item = await Item.create(itemData);

  // Return with owner info
  const populated = await Item.findByPk(item.id, {
    include: [{ model: User, as: "owner", attributes: ["id", "name", "email", "universityId", "picture"] }],
  });
  return parseItemArrays(populated?.toJSON());
};

const allItem = async (query: QueryParams) => {
  const {
    search,
    category,
    sellingCategory,
    availability,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "10",
  } = query;

  const where: any = {};

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }
  if (category) where.objectCategory = category;
  if (sellingCategory) where.sellingCategory = sellingCategory;
  if (availability) where.availability = availability;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows } = await Item.findAndCountAll({
    where,
    include: [{ model: User, as: "owner", attributes: ["id", "name", "email", "universityId", "picture"] }],
    order: [[sortBy === "createdAt" ? "createdAt" : sortBy, sortOrder.toUpperCase()]],
    limit: limitNum,
    offset,
  });

  return {
    data: rows.map(r => parseItemArrays(r.toJSON())),
    meta: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  };
};

const itemById = async (id: number) => {
  const item = await Item.findByPk(id, {
    include: [{ model: User, as: "owner", attributes: ["id", "name", "email", "universityId", "picture"] }],
  });
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  }
  return parseItemArrays(item.toJSON());
};

const updateItem = async (id: number, userId: number, payload: Partial<IItem>) => {
  const item = await Item.findByPk(id);
  if (!item) throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  if (item.ownerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update this item");
  }
  const updateData: any = { ...payload };
  if (Array.isArray(payload.tags)) updateData.tags = JSON.stringify(payload.tags);
  if (Array.isArray(payload.pictures)) updateData.pictures = JSON.stringify(payload.pictures);
  await item.update(updateData);
  return parseItemArrays(item.toJSON());
};

const deleteItem = async (userId: number, id: number) => {
  const item = await Item.findByPk(id);
  if (!item) throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  if (item.ownerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to delete this item");
  }
  await item.destroy();
  return { id };
};

// Helper: parse JSON strings back to arrays
const parseItemArrays = (item: any) => {
  if (!item) return item;
  try { item.tags = JSON.parse(item.tags || "[]"); } catch { item.tags = []; }
  try { item.pictures = JSON.parse(item.pictures || "[]"); } catch { item.pictures = []; }
  
  // Set _id for frontend compatibility (with templates using _id)
  item._id = item.id;

  // Keep ownerId as the numeric ID from owner_id column
  // Also expose owner object separately for frontend use
  if (item.owner) {
    item.ownerInfo = item.owner;   // expose owner details as ownerInfo
    // ownerId stays as the integer (from owner_id field)
  }
  return item;
};

const getMyItems = async (userId: number) => {
  const items = await Item.findAll({
    where: { ownerId: userId },
    include: [{ model: User, as: "owner", attributes: ["id", "name", "email", "universityId", "picture"] }],
  });
  return items.map(item => parseItemArrays(item.toJSON()));
};

const getMyRentals = async (userId: number) => {
  const rentals = await Rental.findAll({
    where: { renterId: userId },
    include: [{
      model: Item,
      as: "item",
      include: [{ model: User, as: "owner", attributes: ["id", "name", "email", "universityId", "picture"] }],
    }],
  });
  
  const items = rentals
    .map(r => (r as any).item)
    .filter(Boolean)
    .map(item => parseItemArrays(item.toJSON()));
  
  return items;
};

export const ItemServices = {
  createItem,
  allItem,
  itemById,
  updateItem,
  deleteItem,
  getMyItems,
  getMyRentals,
};
