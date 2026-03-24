/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, {expiresIn}: SignOptions)=>{
  const token = jwt.sign(payload, secret, {expiresIn});
  return token;
}

const verifyToken = (token: string, secret: string) =>{
  try{
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: decoded
    }
  }catch(err:any){
    return {
      success: false,
      message: "Invalid token, Please login again",
      error: err.message
    }
  }
}

const decodeToken = (token: string) =>{
  return jwt.decode(token) as JwtPayload | null;
}

export const JwtUtils = {
  createToken,
  verifyToken,
  decodeToken
}