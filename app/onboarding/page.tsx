"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard for now since onboarding is not implemented
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting up your account...</h1>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  );
} 