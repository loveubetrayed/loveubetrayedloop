import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key && process.env.NODE_ENV !== "development") {
  console.warn("STRIPE_SECRET_KEY is not set — checkout will fail until it is.");
}

export const stripe = new Stripe(key || "sk_test_placeholder", {
  apiVersion: "2024-06-20"
});
