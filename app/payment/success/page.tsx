'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      // Update user profile with Lite plan
      const updateResult = await updateProfile({
        subscription_plan: 'lite'
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
          <p className="text-white">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-red-400">Payment Verification Failed</CardTitle>
            <CardDescription className="text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/experiences">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">Return to Experiences</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-green-400 text-2xl">Subscription Activated!</CardTitle>
          <CardDescription className="text-gray-400">
            {planType === 'lite' 
              ? `Thank you for subscribing to the Lite plan${amount ? ` for $${amount} AUD/month` : ' for $9 AUD/month'}!`
              : 'Thank you for your subscription to the Lite plan.'
            }
          </CardDescription>
                     {planUpdated && (
             <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
               <p className="text-green-400 text-sm">
                 ✓ Your subscription to the Lite plan is now active
               </p>
             </div>
           )}
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentDetails && (
            <div className="space-y-2 text-sm bg-gray-800/50 p-4 rounded-lg">
              <div className="flex justify-between text-gray-300">
                <span>Status:</span>
                <span className="font-medium text-green-400">{paymentDetails.status}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Email:</span>
                <span className="font-medium">{paymentDetails.customer_email}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Type:</span>
                <span className="font-medium text-blue-400">
                  {paymentDetails.mode === 'subscription' ? 'Monthly Subscription' : 'One-time Payment'}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Amount:</span>
                <span className="font-medium">
                  ${(paymentDetails.amount_total / 100).toFixed(2)} {paymentDetails.currency?.toUpperCase()}
                  {paymentDetails.mode === 'subscription' ? '/month' : ''}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Plan:</span>
                <span className="font-medium text-blue-400">Lite Plan</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/experiences">
              <Button variant="outline" className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800">
                Explore Experiences
              </Button>
            </Link>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-gray-500 text-sm">
              Need help? <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 