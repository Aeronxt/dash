'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

interface PaymentDetails {
  status: string;
  customer_email: string;
  amount_total: number;
  currency: string;
  metadata?: any;
  mode?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const sessionId = searchParams.get('session_id');
  const planType = searchParams.get('plan');
  const amount = searchParams.get('amount');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planUpdated, setPlanUpdated] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Verify payment and update user plan
      handlePaymentSuccess();
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId, user]);

  const handlePaymentSuccess = async () => {
    try {
      // First, verify the payment with Stripe
      const response = await fetch(`/api/stripe/verify-payment?session_id=${sessionId}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setPaymentDetails(data);
      
      // If payment is successful and user is logged in, update their plan
      if (data.status === 'paid' && user) {
        await updateUserPlan();
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async () => {
    try {
      // Extract plan name from payment details or URL params
      let planName = planType || 'lite'; // Default to lite if not specified
      
      // Map plan names to subscription_plan values
      const planMapping: { [key: string]: string } = {
        'lite': 'lite',
        'plus': 'plus',
        'pro': 'pro',
        'startup': 'startup',
        'rising star': 'rising_star',
        'rising_star': 'rising_star'
      };
      
      // Get the mapped plan name or use the original if not found
      const mappedPlan = planMapping[planName.toLowerCase()] || planName.toLowerCase();
      
      // Update user profile with the new plan
      const updateResult = await updateProfile({
        subscription_plan: mappedPlan
      });
      
      if (updateResult) {
        setPlanUpdated(true);
      }
    } catch (err) {
      console.error('Error updating user plan:', err);
      // Don't show error to user as payment was successful
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white/80">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Verification Failed</h1>
            <p className="text-white/60">{error}</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full font-medium">
              Return to Dashboard
            </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Animated Check Mark */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-white/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white animate-bounce" style={{
                animationDelay: '0.5s',
                animationDuration: '1s',
                animationIterationCount: '3'
              }} />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3">
            Payment Successful!
          </h1>
          <p className="text-xl text-white/70 mb-2">
            Welcome to the {planType ? planType.charAt(0).toUpperCase() + planType.slice(1) : 'new'} plan
          </p>
          {amount && (
            <p className="text-white/50">
              ${amount} AUD/month
               </p>
          )}
             </div>

        {/* Plan Details */}
          {paymentDetails && (
          <div className="mb-8 space-y-4">
            <div className="grid gap-3 text-left max-w-sm mx-auto">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Status</span>
                <span className="text-white font-medium capitalize">{paymentDetails.status}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Plan</span>
                <span className="text-white font-medium">
                  {planType ? planType.charAt(0).toUpperCase() + planType.slice(1) : 'New'} Plan
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Type</span>
                <span className="text-white font-medium">
                  {paymentDetails.mode === 'subscription' ? 'Monthly Subscription' : 'One-time Payment'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Amount</span>
                <span className="text-white font-medium">
                  ${(paymentDetails.amount_total / 100).toFixed(2)} {paymentDetails.currency?.toUpperCase()}
                  {paymentDetails.mode === 'subscription' ? '/month' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Email</span>
                <span className="text-white font-medium text-sm">{paymentDetails.customer_email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation */}
        {planUpdated && (
          <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/80">
              ✓ Your subscription is now active and ready to use
            </p>
          </div>
        )}
        
        {/* Action Button */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-white/90 px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105">
              Continue to Dashboard
            </Button>
          </Link>
          
                     <p className="text-white/40 text-sm mt-6">
             Need help? <a href="mailto:support@flowscape.xyz" className="text-white/60 hover:text-white underline">Contact support</a>
           </p>
        </div>
      </div>
    </div>
  );
} 