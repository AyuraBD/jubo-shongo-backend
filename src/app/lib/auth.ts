import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { EnvVars } from "../../config/env";
import { Role, UserStatus } from "../../generated/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils.ts/email";

export const auth = betterAuth({
    baseURL: EnvVars.BETTER_AUTH_URL,
    secret: EnvVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [EnvVars.BETTER_AUTH_URL || "http://localhost:5000", EnvVars.FRONTEND_URL],
    emailAndPassword:{
      enabled: true,
      requireEmailVerification: true,
    },
    socialProviders: {
        google: { 
            clientId: EnvVars.GOOGLE_CLIENT_ID as string, 
            clientSecret: EnvVars.GOOGLE_CLIENT_SECRET as string, 
            mapProfileToUser: () =>{
                return {
                    role: Role.DONOR,
                    status: UserStatus.ACTIVE,
                    needPasswordChange: false,
                    emailVerified: true,
                    isDeleted: false,
                    deletedAt: null
                }
            }
        }, 
    },
    emailVerification:{
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    user:{
        additionalFields:{
            role: {
                type: "string",
                required: true,
                defaultValue: Role.DONOR
            },
            status:{
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },
            needPasswordChange:{
                type: "boolean",
                required: true,
                defaultValue: false
            },
            isDeleted:{
                type: "boolean",
                required: true,
                defaultValue: false
            },
            deletedAt:{
                type: "date",
                required: false,
                defaultValue: null
            }
        }
    },
    plugins:[
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({email, otp, type}) {
                if(type === "email-verification"){
                    const user = await prisma.user.findUnique({
                        where:{
                            email
                        }
                    });

                    if(!user){
                        console.error(`User with email ${email} not found. Cannot send verification OTP.`);
                        return;
                    }

                    if(user && user.role === Role.SUPER_ADMIN){
                        console.log(`User with email ${email} is a super admin. Skipping sending verification OTP.`);
                        return;
                    }

                    if(user && !user.emailVerified){
                        sendEmail({
                            to: email,
                            subject: "Verify your email",
                            templateName: "otp",
                            templateData:{
                                name: user.name,
                                otp,
                            }
                        })
                    }
                }else if(type === "forget-password"){
                    const user = await prisma.user.findUnique({
                        where:{
                            email
                        }
                    })
                    if(user){
                        sendEmail({
                        to: email,
                        subject: "Password reset OTP",
                        templateName: "otp",
                        templateData:{
                            name: user.name,
                            otp,
                            }
                        })
                    }
                }
            },
            expiresIn: 2 * 60,
            otpLength: 6,
        })
    ],
    session:{
        expiresIn: 60 * 60 * 60 * 24,
        updateAge: 60 * 60 * 60 * 24,
        cookieCache:{
            enabled: true,
            maxAge: 60 * 60 * 60 * 24,
        }
    },
    redirectURLs:{
        signIn: `${EnvVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },
    advanced:{
        disableCSRFCheck: true,
        useSecureCookies: false,
        cookies:{
            state:{
                attributes:{
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path:'/'
                }
            },
            sessionToken:{
                attributes:{
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path:'/'
                }
            }
        }
    }
});