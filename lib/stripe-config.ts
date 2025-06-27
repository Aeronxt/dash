export const getStripeConfig = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    return {
      isConfigured: false,
      error: 'Stripe publishable key is not configured in environment variables.',
      publishableKey: null
    };
  }
  
  if (publishableKey === 'pk_test_placeholder_key') {
    return {
      isConfigured: false,
      error: 'Stripe is using placeholder keys. Please configure with real Stripe keys.',
      publishableKey: null
    };
  }
  
  // Validate key format
  if (!publishableKey.startsWith('pk_')) {
    return {
      isConfigured: false,
      error: 'Invalid Stripe publishable key format.',
      publishableKey: null
    };
  }
  
  return {
    isConfigured: true,
    error: null,
    publishableKey
  };
};

export const isStripeConfigured = () => {
  const config = getStripeConfig();
  return config.isConfigured;
}; 