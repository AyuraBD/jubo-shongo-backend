/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { ILoginPayload, IRegisterDonorPayload } from "./auth.interface"
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils.ts/token";
import { UserStatus } from "../../../generated/prisma";

const registerDonor = async(payload:IRegisterDonorPayload)=>{
  const {name, email, password} = payload;

  const data = await auth.api.signUpEmail({
    body:{
      name,
      email,
      password
    }
  });
  if(!data.user){
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create user. Please try again");
  }
  try{
      const donor = await prisma.$transaction(async(tx)=>{
      const donorTx = await tx.donor.create({
        data:{
          userId: data.user.id,
          name: payload.name,
          email: payload.email
        }
      })
      return donorTx
    });

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
    return{
      ...data,
      accessToken,
      refreshToken,
      donor
    }
  }catch(error:any){
    await prisma.user.delete({
      where:{
        id: data.user.id
      }
    })
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create donor profile. Please try again.", error.message);  
  }
}

const loginUser = async(payload: ILoginPayload)=>{
  const {email, password} = payload;
  const data = await auth.api.signInEmail({
    body:{
      email,
      password
    }
  });
  if(!data.user){
    throw new AppError(status.UNAUTHORIZED, "Invalid login credentials");
  }
  if(data.user.isDeleted || data.user.status === UserStatus.DELETED){
    throw new AppError(status.FORBIDDEN, "Your account been deleted. Please contact support center.")
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  
  return {
    ...data,
    accessToken,
    refreshToken
  }
}

const googleLoginSuccess = async(session: Record<string, any>) =>{
  const isPatientExists = await prisma.donor.findUnique({
    where:{
      userId: session.user.id
    }
  });
  if(!isPatientExists){
    await prisma.donor.create({
      data:{
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {accessToken, refreshToken}
}

export const AuthService = {
  registerDonor,
  loginUser,
  googleLoginSuccess
}