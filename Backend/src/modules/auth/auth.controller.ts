import { sendResponse } from "../../utils/sendResponse"
import { setAuthCookie } from "../../utils/setCookie"
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service"
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"


const createUser = catchAsync(async( req:Request, res:Response)=>{
    const user= await AuthServices.createUser(req.body);

    sendResponse(res,{
        success:true,
        statusCode: httpStatus.CREATED,
        message:"User Created Successfully",
        data: user
    })
})


const credentialLogin = catchAsync( async (req:Request, res:Response)=>{

    const user = await AuthServices.credentialLogin(req.body)

    setAuthCookie(res, user)

    sendResponse(res,{
        success:true,
        statusCode: httpStatus.OK,
        message:"Login Success",
        data:user
    })
})


const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.resetPassword(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password reset successfully",
        data: result,
    });
});

const checkEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.checkEmail(req.body.email);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email found",
        data: result,
    });
});

export const AuthControllers = {
    credentialLogin,
    createUser,
    resetPassword,
    checkEmail,
}

