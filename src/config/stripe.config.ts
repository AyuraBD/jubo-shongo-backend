import Stripe from "stripe";
import { EnvVars } from "./env";

export const stripe = new Stripe(EnvVars.STRIPE_SECRET_KEY);