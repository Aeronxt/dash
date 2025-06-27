import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { priceId, country } = await request.json();

    // Define price mapping based on country
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