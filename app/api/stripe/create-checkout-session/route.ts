import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { priceId, country, planName, amount } = await request.json();

    // ALWAYS create subscription for Lite plan (whether amount is provided or not)
    if (planName === 'Lite') {
      const finalAmount = amount || 9; // Default to $9 AUD if no amount specified
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aud', // Australian Dollars
              product_data: {
                name: `${planName} Plan`,
                description: 'Perfect for getting started - Interactive Blog + 1 Page',
                images: [], // Add product images if available
              },
              unit_amount: finalAmount * 100, // Convert to cents (9 AUD = 900 cents)
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription', // Monthly recurring subscription
        success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=lite&amount=${finalAmount}`,
        cancel_url: `${request.headers.get('origin')}/experiences?cancelled=true`,
        customer_creation: 'always',
        metadata: {
          plan_name: planName,
          plan_type: 'lite',
          amount: finalAmount.toString(),
          country: country || 'AU',
          billing_cycle: 'monthly'
        },
        // Production-ready settings
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'AU', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'BD'], // Add more countries as needed
        },
      });
      
      return NextResponse.json({ sessionId: session.id });
    }

    // For any other plans or if not Lite plan, return error for now
    // This ensures we only handle Lite plan subscriptions through the custom price_data above
    return NextResponse.json({ 
      error: 'Only Lite plan subscriptions are currently supported. Please use planName: "Lite"' 
    }, { status: 400 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 