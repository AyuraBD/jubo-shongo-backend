import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils.ts/token";

const registerDonor = catchAsync(
  async(req: Request, res: Response) =>{
    const payload = req.body;
    const result = await AuthService.registerDonor(payload);
    const {accessToken, refreshToken, token, ...rest} = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Donor registered successfully.",
      data:{
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
)

const loginUser = catchAsync(
  async(req: Request, res: Response) =>{
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    const {accessToken, refreshToken, token, ...rest} = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Logged in successfully.",
      data:{
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
)

export const AuthController = {
  registerDonor,
  loginUser
}