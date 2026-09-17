// Toggle the whole site between two modes:
//   "free" — every kit is unlocked with just an email (double opt-in, same
//            mechanism the /free page already used) — no Stripe involved.
//   "paid" — the normal cart + Stripe checkout flow.
//
// Set NEXT_PUBLIC_SITE_MODE=paid in .env.local / Vercel when you're ready to
// start charging — nothing else needs to change, the cart/checkout code is
// still there, it's just hidden while in free mode.
export const FREE_MODE = process.env.NEXT_PUBLIC_SITE_MODE !== "paid";
