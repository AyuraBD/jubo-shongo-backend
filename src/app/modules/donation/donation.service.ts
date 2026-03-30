/* eslint-disable @typescript-eslint/no-explicit-any */

import { stripe } from "../../../config/stripe.config";
import { prisma } from "../../lib/prisma";

const createDonationIntent = async (payload: any) =>{
  const {amount, campaignId,userId,donorName,donorEmail,donorPhone,message} = payload;
  const donation = await prisma.donation.create({
    data: {
      amount,
      campaignId,
      userId,
      donorName,
      donorEmail,
      donorPhone,
      message,
      method: "CARD",
      status: "PENDING"
    }
  });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "usd",
    payment_method_types:["card"],
    metadata: {
      donationId: donation.id,
      campaignId: campaignId || ""
    }
  });
  return {
    clientSecret: paymentIntent.client_secret,
    donationId: donation.id
  }
}

const handleStripeWebhook = async (event: any) =>{
  if(event.type === "payment_intent.succeed"){
    const paymentIntent = event.data.object;

    const donationId = paymentIntent.metadata.donationId;

    const existing = await prisma.donation.findUnique({
      where: { id: donationId }
    });

    if (!existing) return;

    if (existing.status === "COMPLETED") return;

    await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "COMPLETED",
        transactionId: paymentIntent.id,
        stripeEventId: event.id,
        paymentGatewayData: paymentIntent
      }
    });
    if (existing.campaignId) {
      await prisma.campaign.update({
        where: { id: existing.campaignId },
        data: {
          raisedAmount: {
            increment: Number(paymentIntent.amount) / 100
          },
          donorCount: {
            increment: 1
          }
        }
      });
    }
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const donationId = paymentIntent.metadata.donationId;

      await prisma.donation.update({
        where: { id: donationId },
        data: {
          status: "FAILED"
        }
      });
    }
  }
}

export const DonationService = {
  createDonationIntent,
  handleStripeWebhook
}