export enum ItemCategory {
  RENT = "RENT",
  SELL = "SELL",
  SKILL = "SKILL",
}

export enum Availability {
  IN_STOCK = "IN_STOCK",
  RENTED = "RENTED",
  SOLD = "SOLD",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum ItemCondition {
  NEW = "NEW",
  USED = "USED",
  FAIR = "FAIR",
}

export enum ObjectCategory {
  TRANSPORTATION = "TRANSPORTATION",
  ELECTRONICS = "ELECTRONICS",
  LAPTOP = "LAPTOP",
  PHONES = "PHONES",
  TV = "TV",
  GAMING = "GAMING",
  CAMERA = "CAMERA",
  PROJECTOR = "PROJECTOR",
  LIGHTS = "LIGHTS",
  CLOTHING = "CLOTHING",
  SPORTS = "SPORTS",
  BOOKS = "BOOKS",
  FURNITURE = "FURNITURE",
  EVENTS = "EVENTS",
  WEDDING = "WEDDING",
  SKILL = "SKILL",
  OTHERS = "OTHERS",
}

export interface IItem {
  id?: number;
  ownerId: number;
  title: string;
  description?: string;
  price: number;
  deposit?: number;           // Refundable security deposit (proposal requirement)
  condition?: ItemCondition;  // new / used / fair (proposal requirement)
  sellingCategory: ItemCategory;
  availability: Availability;
  objectCategory: ObjectCategory;
  tags?: string;      // stored as JSON string in MySQL
  picture?: string;
  pictures?: string;  // stored as JSON string in MySQL
  avgRating?: number;
  reviewCount?: number;
}

export interface QueryParams {
  search?: string;
  category?: string;
  sellingCategory?: string;
  availability?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}
