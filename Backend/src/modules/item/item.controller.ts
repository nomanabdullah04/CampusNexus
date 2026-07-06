import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { ItemServices } from "./item.service"


const createItem = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.user.userId)
    const item = await ItemServices.createItem(req.body, userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Item Created Successfully",
        data: item
    })
})

const allItem = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const items = await ItemServices.allItem(query as any);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Items retrieved successfully",
        data: items.data,
        meta: items.meta
    })
})

const itemById = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const item = await ItemServices.itemById(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Item retrieved successfully",
        data: item,
    })
})

const updateItem = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const userId = Number(req.user.userId);
    const payload = req.body;
    const updatedItem = await ItemServices.updateItem(id, userId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Item updated successfully",
        data: updatedItem,
    });
});

const deleteItem = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const userId = Number(req.user.userId)
    await ItemServices.deleteItem(userId, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Item deleted successfully",
        data: { id },
    })
})

const getMyItems = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.user.userId)
    const items = await ItemServices.getMyItems(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User items retrieved successfully",
        data: items,
    })
})

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.user.userId)
    const items = await ItemServices.getMyRentals(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User rented items retrieved successfully",
        data: items,
    })
})

export const ItemControllers = {
    createItem,
    allItem,
    itemById,
    deleteItem,
    updateItem,
    getMyItems,
    getMyRentals
}
