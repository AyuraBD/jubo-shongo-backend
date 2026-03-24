/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { IRegisterDonorPayload } from "./auth.interface"
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils.ts/token";

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
      const patient = await prisma.$transaction(async(tx)=>{
      const patientTx = await tx.donor.create({
        data:{
          userId: data.user.id,
          name: payload.name,
          email: payload.email
        }
      })
      return patientTx
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
      patient
    }
  }catch(error:any){
    await prisma.user.delete({
      where:{
        id: data.user.id
      }
    })
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create patient profile. Please try again.", error.message);  
  }
}

export const AuthService = {
  registerDonor,
}