import dotenv from "dotenv";
import status from "http-status";
import AppError from "../app/errorHelpers/AppError";

dotenv.config();

interface EnvConfig {
  PORT:string;
  NODE_ENV:string;
  DATABASE_URL: string;
  BETTER_AUTH_URL:string;
  BETTER_AUTH_SECRET:string;
  FRONTEND_URL:string;
  GOOGLE_CLIENT_ID:string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL:string;
  EMAIL_SENDER_SMTP_USER:string;
  EMAIL_SENDER_SMTP_PASS:string;
  EMAIL_SENDER_SMTP_HOST:string;
  EMAIL_SENDER_SMTP_PORT: string;
  EMAIL_SENDER_SMTP_FROM:string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
  SUPER_ADMIN_EMAIL:string;
  SUPER_ADMIN_PASSWORD:string;
  CLOUDINARY_CLOUD_NAME:string;
  CLOUDINARY_API_KEY: string;
  COUDINARY_API_SECRET: string;
  STRIPE_SECRET_KEY:string;
  STRIPE_WEBHOOK_SECRET: string;
}

const loadEnvVariables = ():EnvConfig =>{
  const requiredEnv = [
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'BETTER_AUTH_URL',
    'BETTER_AUTH_SECRET',
    'FRONTEND_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'EMAIL_SENDER_SMTP_USER',
    'EMAIL_SENDER_SMTP_PASS',
    'EMAIL_SENDER_SMTP_HOST',
    'EMAIL_SENDER_SMTP_PORT',
    'EMAIL_SENDER_SMTP_FROM',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',
    'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
    'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'COUDINARY_API_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ]
  requiredEnv.forEach((variable)=>{
    if(!process.env[variable]){
      throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required`);
    }
  })
  return {
    PORT: process.env.PORT as string,
    NODE_ENV:process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
    EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
    EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
    EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
    EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    COUDINARY_API_SECRET: process.env.COUDINARY_API_SECRET as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
  }
}

export const EnvVars = loadEnvVariables();