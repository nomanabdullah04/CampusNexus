/**
 * Define all Sequelize model associations here.
 * Using constraints: false to avoid FK constraint conflicts with existing tables.
 */
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";
import { Item } from "../modules/item/item.model";
import { Rental } from "../modules/rental/rental.model";
import { Review } from "../modules/review/review.model";
import { Notification } from "../modules/notification/notification.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { Refund } from "../modules/refund/refund.model";
import { Report } from "../modules/report/report.model";
import { Event, EventRegistration } from "../modules/event/event.model";
import { Cart } from "../modules/cart/cart.model";
import { Message } from "../modules/message/message.model";

const opts = { constraints: false };

// User ↔ Wallet
User.hasOne(Wallet, { foreignKey: "owner_id", as: "wallet", ...opts });
Wallet.belongsTo(User, { foreignKey: "owner_id", as: "user", ...opts });

// User ↔ Item
User.hasMany(Item, { foreignKey: "owner_id", as: "items", ...opts });
Item.belongsTo(User, { foreignKey: "owner_id", as: "owner", ...opts });

// Item ↔ Rental
Item.hasMany(Rental, { foreignKey: "item_id", as: "rentals", ...opts });
Rental.belongsTo(Item, { foreignKey: "item_id", as: "item", ...opts });

// User ↔ Rental (as renter)
User.hasMany(Rental, { foreignKey: "renter_id", as: "rentalsAsRenter", ...opts });
Rental.belongsTo(User, { foreignKey: "renter_id", as: "renter", ...opts });

// User ↔ Rental (as owner)
User.hasMany(Rental, { foreignKey: "owner_id", as: "rentalsAsOwner", ...opts });
Rental.belongsTo(User, { foreignKey: "owner_id", as: "owner", ...opts });

// Item ↔ Review
Item.hasMany(Review, { foreignKey: "item_id", as: "reviews", ...opts });
Review.belongsTo(Item, { foreignKey: "item_id", as: "item", ...opts });

// Rental ↔ Review
Rental.hasOne(Review, { foreignKey: "rental_id", as: "review", ...opts });
Review.belongsTo(Rental, { foreignKey: "rental_id", as: "rental", ...opts });

// User ↔ Review
User.hasMany(Review, { foreignKey: "reviewer_id", as: "reviews", ...opts });
Review.belongsTo(User, { foreignKey: "reviewer_id", as: "reviewer", ...opts });

// User ↔ Notification
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications", ...opts });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user", ...opts });

// User ↔ Cart
User.hasMany(Cart, { foreignKey: "user_id", as: "cartItems", ...opts });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user", ...opts });

// Item ↔ Cart
Item.hasMany(Cart, { foreignKey: "item_id", as: "cartItems", ...opts });
Cart.belongsTo(Item, { foreignKey: "item_id", as: "item", ...opts });

// User ↔ Message (Sender)
User.hasMany(Message, { foreignKey: "sender_id", as: "sentMessages", ...opts });
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender", ...opts });

// User ↔ Message (Receiver)
User.hasMany(Message, { foreignKey: "receiver_id", as: "receivedMessages", ...opts });
Message.belongsTo(User, { foreignKey: "receiver_id", as: "receiver", ...opts });

export { User, Wallet, Item, Rental, Review, Notification, Transaction, Refund, Report, Event, EventRegistration, Cart, Message };
