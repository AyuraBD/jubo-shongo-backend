import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils.ts/token";
import { EnvVars } from "../../../config/env";
import { auth } from "../../lib/auth";

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

const googleLogin = catchAsync((req: Request, res: Response)=>{
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${EnvVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect",{
    callbackURL,
    betterAuthUrl : EnvVars.BETTER_AUTH_URL
  })
});

const googleLoginSuccess = catchAsync(async(req: Request, res: Response)=>{
  const redirectPath = req.query.redirect as string || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if(!sessionToken){
    return res.redirect(`${EnvVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers:{
      "Cookie" : `better-auth.session_token=${sessionToken}`
    }
  });
  if(!session || !session.user){
    return res.redirect(`${EnvVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const {accessToken, refreshToken} = result;

  tokenUtils.setAccessTokenCookie(res,accessToken);
  tokenUtils.setRefreshTokenCookie(res,refreshToken);

  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

  res.redirect(`${EnvVars.FRONTEND_URL}${finalRedirectPath}`);
});

const handleOAuthError = catchAsync((req: Request, res: Response)=>{
  const error = req.query.error as string || "oauth_failed";
  res.redirect(`${EnvVars.FRONTEND_URL}/login?error=${error}`);
});

export const AuthController = {
  registerDonor,
  loginUser,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError,
}