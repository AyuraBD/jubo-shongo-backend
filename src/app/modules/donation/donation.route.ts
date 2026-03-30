import express from "express";
import { DonationController } from "./donation.controller";

const router = express.Router();

router.post("/create-intent", DonationController.createDonationIntent);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  DonationController.stripeWebhook
);

export const DonationRoutes = router;