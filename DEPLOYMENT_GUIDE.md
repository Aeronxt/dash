# Deployment Guide

## Environment Variables Required

Your deployment platform needs these environment variables configured:

### Stripe Configuration (Required for Payments)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_real_key_here
STRIPE_SECRET_KEY=sk_live_your_real_key_here
```

### Supabase Configuration (Required for Authentication)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Platform-Specific Instructions

### Vercel
1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its value
5. Redeploy your application

### Netlify
1. Go to your site dashboard on Netlify
2. Click on "Site settings"
3. Click on "Environment variables"
4. Add each variable with its value
5. Redeploy your application

### Other Platforms
Check your platform's documentation for setting environment variables.

## Testing
After setting environment variables:
1. Redeploy your application
2. Test the Lite plan checkout ($9 payment)
3. Verify no "Stripe configuration missing" errors appear

## Troubleshooting
- Make sure environment variable names are exactly as shown (case-sensitive)
- Ensure no extra spaces in variable names or values
- Use your real Stripe live keys (starting with `pk_live_` and `sk_live_`)
- Redeploy after making changes 