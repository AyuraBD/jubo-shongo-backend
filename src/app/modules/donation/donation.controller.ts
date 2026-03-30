/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DonationService } from "./donation.service";
import { stripe } from "../../../config/stripe.config";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { EnvVars } from "../../../config/env";

const createDonationIntent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DonationService.createDonationIntent(req.body);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment intent created",
      data: result
    })
  }
)

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        EnvVars.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return res.status(status.BAD_REQUEST).json({message: `Webhook Error: ${err.message};`})
    }

    try{
      const result = await DonationService.handleStripeWebhook(event);
      sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Webhook event processed successfully",
        data: result
      });
    }catch(err){
      console.error("Error handling Stripe webhook event:", err);
        sendResponse(res, {
            httpStatusCode : status.INTERNAL_SERVER_ERROR,
            success : false,
            message : "Error handling Stripe webhook event"
        })
    }
  }
)

export const DonationController = {
  createDonationIntent,
  stripeWebhook
};