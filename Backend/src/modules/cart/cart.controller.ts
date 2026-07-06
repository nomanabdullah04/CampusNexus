import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CartService } from "./cart.service";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await CartService.addToCart(userId, req.body);
  sendResponse(res, { success: true, statusCode: httpStatus.CREATED, message: "Item added to cart", data });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await CartService.getCart(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Cart retrieved", data });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const cartId = Number(req.params.id);
  await CartService.removeFromCart(userId, cartId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Item removed from cart", data: null });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  await CartService.clearCart(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Cart cleared", data: null });
});

const checkoutCart = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.user.userId);
  const data = await CartService.checkoutCart(userId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Checkout completed successfully", data });
});

export const CartController = { addToCart, getCart, removeFromCart, clearCart, checkoutCart };
