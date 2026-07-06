import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Item } from "../item/item.model";
import { Cart } from "./cart.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { TransactionType, TransactionStatus } from "../transaction/transaction.interface";
import { Rental } from "../rental/rental.model";
import { RentalStatus } from "../rental/rental.interface";
import { sequelize } from "../../config/database";

const addToCart = async (userId: number, payload: { itemId: number; startDate?: string; endDate?: string }) => {
  const { itemId, startDate, endDate } = payload;
  const item = await Item.findByPk(itemId);
  if (!item) throw new AppError(httpStatus.NOT_FOUND, "Item not found");

  const existing = await Cart.findOne({ where: { userId, itemId } });
  if (existing) {
    await existing.update({ startDate: startDate ? new Date(startDate) : existing.startDate, endDate: endDate ? new Date(endDate) : existing.endDate });
    return existing;
  }

  return Cart.create({
    userId,
    itemId,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    quantity: 1,
  });
};

const getCart = async (userId: number) => {
  return Cart.findAll({
    where: { userId },
    include: [{ model: Item, as: "item", attributes: ["id", "title", "price", "deposit", "picture", "availability", "ownerId", "sellingCategory"] }],
  });
};

const removeFromCart = async (userId: number, cartId: number) => {
  const entry = await Cart.findByPk(cartId);
  if (!entry) throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  if (entry.userId !== userId) throw new AppError(httpStatus.FORBIDDEN, "Not authorized");
  await entry.destroy();
};

const clearCart = async (userId: number) => {
  await Cart.destroy({ where: { userId } });
};

const checkoutCart = async (userId: number) => {
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [{ model: Item, as: "item" }],
  });

  if (cartItems.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  const t = await sequelize.transaction();

  try {
    for (const entry of cartItems) {
      const item = entry.item;
      if (!item) continue;

      if (item.sellingCategory === "SELL" || item.sellingCategory === "FREE") {
        const price = item.sellingCategory === "FREE" ? 0 : Number(item.price);

        if (price > 0) {
          // Deduct from buyer
          const buyerWallet = await Wallet.findOne({ where: { ownerId: userId }, transaction: t });
          if (!buyerWallet || Number(buyerWallet.balance) < price) {
            throw new AppError(httpStatus.BAD_REQUEST, `Insufficient balance to buy "${item.title}"`);
          }
          await buyerWallet.update({ balance: Number(buyerWallet.balance) - price }, { transaction: t });

          // Add to seller
          const sellerWallet = await Wallet.findOne({ where: { ownerId: item.ownerId }, transaction: t });
          if (sellerWallet) {
            await sellerWallet.update({ balance: Number(sellerWallet.balance) + price }, { transaction: t });
          }

          // Log transaction for buyer
          await Transaction.create({
            userId,
            amount: -price,
            type: TransactionType.PAYMENT,
            status: TransactionStatus.COMPLETED,
            description: `Purchased item: ${item.title}`,
          } as any, { transaction: t });

          // Log transaction for seller
          await Transaction.create({
            userId: item.ownerId,
            amount: price,
            type: TransactionType.EARNING,
            status: TransactionStatus.COMPLETED,
            description: `Sold item: ${item.title}`,
          } as any, { transaction: t });
        }

        // Update item status to SOLD
        await item.update({ availability: "SOLD" as any }, { transaction: t });

      } else if (item.sellingCategory === "RENT") {
        if (!entry.startDate || !entry.endDate) {
          throw new AppError(httpStatus.BAD_REQUEST, `Rent dates are required for "${item.title}"`);
        }

        const start = new Date(entry.startDate);
        const end = new Date(entry.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = days * Number(item.price);

        const buyerWallet = await Wallet.findOne({ where: { ownerId: userId }, transaction: t });
        if (!buyerWallet || Number(buyerWallet.balance) < totalPrice) {
          throw new AppError(httpStatus.BAD_REQUEST, `Insufficient balance for rental of "${item.title}"`);
        }

        await Rental.create({
          itemId: item.id,
          renterId: userId,
          ownerId: item.ownerId,
          startDate: start,
          endDate: end,
          totalPrice,
          status: RentalStatus.REQUESTED,
        }, { transaction: t });
      }
    }

    // Clear the cart
    await Cart.destroy({ where: { userId }, transaction: t });

    await t.commit();
    return { success: true };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const CartService = { addToCart, getCart, removeFromCart, clearCart, checkoutCart };
