import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

// Check if Stripe is properly configured
function checkStripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  if (secretKey.includes('sk_test_') || secretKey.includes('sk_live_')) {
    return true;
  }
  throw new Error('STRIPE_SECRET_KEY appears to be invalid (should start with sk_test_ or sk_live_)');
}

export async function POST(request: NextRequest) {
  console.log('🚀 Stripe checkout session request started at:', new Date().toISOString());
  
  try {
    const requestBody = await request.json();
    const { priceId, country, planName, amount } = requestBody;
    
    console.log('📋 Request details:', {
      priceId,
      country,
      planName,
      amount,
      fullBody: requestBody
    });

    // Check Stripe configuration first
    try {
      checkStripeConfig();
      console.log('✅ Stripe configuration is valid');
    } catch (configError) {
      console.error('❌ Stripe configuration error:', configError);
      return NextResponse.json({ 
        error: 'Stripe configuration error',
        details: configError instanceof Error ? configError.message : 'Unknown configuration error'
      }, { status: 500 });
    }

    // Handle all supported plans (exclude Bangladesh)
    if (country === 'BD') {
      return NextResponse.json({ 
        error: 'Bangladesh payments are not supported through this checkout. Please contact support.' 
      }, { status: 400 });
    }

    // Define plan pricing and descriptions
    const planConfig: { [key: string]: { au: number, ww: number, description: string } } = {
      'Lite': { 
        au: 9, 
        ww: 6, 
        description: 'Perfect for getting started - Interactive Blog + 1 Page' 
      },
      'Plus': { 
        au: 15, 
        ww: 10, 
        description: 'Best for small businesses - Everything in Lite + Enhanced Features' 
      },
      'Pro': { 
        au: 35, 
        ww: 23, 
        description: 'For growing businesses - Everything in Plus + Premium Support' 
      },
      'Startup': { 
        au: 45, 
        ww: 30, 
        description: 'Perfect for startups - 4 Pages + Ecommerce' 
      },
      'Rising Star': { 
        au: 75, 
        ww: 50, 
        description: 'Best for growing businesses - 10 Pages + 1 Bonus + Ecommerce' 
      }
    };

    if (!planConfig[planName]) {
      return NextResponse.json({ 
        error: `Plan "${planName}" is not supported` 
      }, { status: 400 });
    }

    // Determine currency and amount based on country
    const isAustralia = country === 'AU';
    const currency = isAustralia ? 'aud' : 'usd';
    const finalAmount = amount || (isAustralia ? planConfig[planName].au : planConfig[planName].ww);
    const planDescription = planConfig[planName].description;

    console.log('🎯 Creating subscription for plan:', {
      planName,
      country,
      currency,
      amount: finalAmount,
      description: planDescription
    });
    
    console.log('📤 Creating Stripe session with config...');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `${planName} Plan`,
              description: planDescription,
            },
            unit_amount: finalAmount * 100,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${planName.toLowerCase()}&amount=${finalAmount}`,
      cancel_url: `${request.headers.get('origin')}/dashboard?cancelled=true`,
      allow_promotion_codes: true, // Allow users to enter coupon codes directly in Stripe checkout
      metadata: {
        plan_name: planName,
        plan_type: planName.toLowerCase(),
        amount: finalAmount.toString(),
        currency,
        country: country || (isAustralia ? 'AU' : 'WW'),
        billing_cycle: 'monthly'
      },
    });
    
    console.log('✅ Stripe session created successfully:', {
      id: session.id,
      mode: session.mode,
      url: session.url,
      payment_status: session.payment_status,
      currency,
      amount: finalAmount
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      type: typeof error
    });
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 