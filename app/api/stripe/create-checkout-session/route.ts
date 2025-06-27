import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { priceId, country, planName, amount } = await request.json();

    // If amount is provided (for custom pricing), create a one-time payment
    if (amount && planName === 'Lite') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${planName} Plan`,
                description: 'Perfect for getting started - Interactive Blog + 1 Page',
                images: [], // Add product images if available
              },
              unit_amount: amount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment', // One-time payment
        success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=lite&amount=${amount}`,
        cancel_url: `${request.headers.get('origin')}/experiences?cancelled=true`,
        customer_creation: 'always',
        metadata: {
          plan_name: planName,
          plan_type: 'lite',
          amount: amount.toString(),
          country: country || 'US'
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

    // Define price mapping based on country for subscription plans
    const priceMapping: { [key: string]: { [key: string]: string } } = {
      'AU': {
        'lite': 'price_1QMtQOBkdmq9zTCaB2x8AAAA', // A$15/month
      },
      'WW': {
        'lite': 'price_1QMtQPBkdmq9zTCaC3y9BBBB', // $12/month
      },
      'BD': {
        'lite': 'price_1QMtQQBkdmq9zTCaD4z0CCCC', // ৳1200/month
      }
    };

    const stripePriceId = priceMapping[country]?.[priceId];
    
    if (!stripePriceId) {
      return NextResponse.json({ error: 'Invalid price or country' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/experiences`,
      customer_creation: 'always',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 