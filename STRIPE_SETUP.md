# Stripe Integration Setup

## 🚨 IMPORTANT: Fix Runtime Error

To resolve the "Cannot read properties of undefined (reading 'match')" error, you need to create a `.env.local` file in your project root with your Stripe keys.

## Environment Variables Required

**Create a `.env.local` file** in your project root and add:

```env
# Stripe Configuration (Get these from your Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Supabase Configuration (if needed)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Quick Start (For Testing)
If you don't have Stripe keys yet, use these placeholder values temporarily:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key
STRIPE_SECRET_KEY=sk_test_placeholder_key
```

**Note**: With placeholders, the Lite plan button will show an error message instead of crashing.

## How It Works

### Lite Plan Custom Checkout
- The **Lite plan** now uses a custom Stripe checkout flow instead of direct payment links
- When users click "Get Started" on the Lite plan, it creates a checkout session via `/api/stripe/create-checkout-session`
- Users are redirected to Stripe's hosted checkout page
- After successful payment, they're redirected to `/payment/success`

### Other Plans
- **Plus**, **Pro**, **Startup**, and **Rising Star** plans continue to use direct Stripe payment links
- These open in new tabs for immediate checkout

### Country-Specific Behavior
- **Australia (AU)** and **Worldwide (WW)**: Use Stripe checkout (custom for Lite, direct links for others)
- **Bangladesh (BD)**: Uses the `onSelectPlan` callback for local payment processing

## API Endpoints

### `/api/stripe/create-checkout-session`
- Creates Stripe checkout sessions for custom payment flows
- Handles currency conversion (A$, $, ৳)
- Sets up subscription billing

### `/api/stripe/verify-payment`
- Verifies completed payments
- Returns payment details for the success page

## Testing

1. Set up Stripe test keys in your environment
2. Use Stripe test card numbers (e.g., `4242 4242 4242 4242`)
3. Test the Lite plan checkout flow
4. Verify other plans still use direct links

## Production Setup

1. Replace test keys with live Stripe keys
2. Update webhook endpoints if needed
3. Test with real payment methods

## Security Notes

- Never commit `.env` or `.env.local` files to git
- The `.gitignore` file has been updated to exclude all environment files
- Replace placeholder keys with your actual Stripe keys from the dashboard 