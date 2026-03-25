/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import AppError from '../errorHelpers/AppError';
import { JwtUtils } from '../utils.ts/jwt';
import status from 'http-status';
import { cookieUtils } from '../utils.ts/cookie';
import { prisma } from '../lib/prisma';
import { EnvVars } from '../../config/env';
import { Role, UserStatus } from '../../generated/prisma';
export const checkAuthMiddleware = (...authRoles:Role[])=> async (req: Request, res: Response, next: NextFunction)=>{
  try{
    const sessionToken = cookieUtils.getCookie(req, 'better-auth.session_token');
    if(!sessionToken){
      throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No session token provided.');
    }

    if(sessionToken){
      const sessionExists = await prisma.session.findUnique({
        where:{
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          }
        },
        include:{
          user: true,
        }
      })
      if(sessionExists && sessionExists.user){
        const user = sessionExists.user;
        const now = new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeLeft = expiresAt.getTime() - now.getTime();
        const percentRemaining = (timeLeft / sessionLifeTime * 100);
        if(percentRemaining < 25){
          res.setHeader('X-Session-Refresh', 'true');
          res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
          res.setHeader('X-Session-Time-Left', timeLeft);
        }
        if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
          throw new AppError(status.UNAUTHORIZED, 'Forbidden access! Your account is blocked or deleted. Please contact support for assistance.');
        }
        if(user.isDeleted){
          throw new AppError(status.UNAUTHORIZED, 'Forbidden access! Your account is deleted. Please contact support for assistance.');
        }
        if(authRoles.length > 0 && !authRoles.includes(user.role)){
          throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        }
      } else {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid session token.');
      }
      const accessToken = cookieUtils.getCookie(req, 'accessToken');
      if(!accessToken){
        throw new AppError(status.BAD_REQUEST, 'Bad request! Access token should not be provided when session token is used for authentication.');
      }
      const verifyToken = JwtUtils.verifyToken(accessToken, EnvVars.ACCESS_TOKEN_SECRET);
      if(!verifyToken.success){
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
      }
      if(authRoles.length > 0 && !authRoles.includes(verifyToken.data!.role as Role)){
        throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
      }
      next();
    }
  }catch(error:any){
    next(error);
  }
}