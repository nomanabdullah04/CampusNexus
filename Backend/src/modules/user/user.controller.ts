import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"
import { UserServices } from "./user.service"


const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile retrieved successfully",
        data: result
    })
})



export const UserControllers = {
    getMe
}


