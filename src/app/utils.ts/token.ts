import { JwtPayload, SignOptions } from "jsonwebtoken";
import { JwtUtils } from "./jwt";
import { EnvVars } from "../../config/env";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) =>{
  const token = JwtUtils.createToken(payload, EnvVars.ACCESS_TOKEN_SECRET, {expiresIn: EnvVars.ACCESS_TOKEN_EXPIRES_IN} as SignOptions);
  return token;
}

const getRefreshToken = (payload: JwtPayload) =>{
  const token = JwtUtils.createToken(payload, EnvVars.REFRESH_TOKEN_SECRET, {expiresIn: EnvVars.REFRESH_TOKEN_EXPIRES_IN} as SignOptions);
  return token;
}

const setAccessTokenCookie = (res: Response, token: string) =>{
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  })
}

const setRefreshTokenCookie = (res: Response, token: string) =>{
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  })
}

const setBetterAuthSessionCookie = (res: Response, token: string) =>{
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  })
}

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
}