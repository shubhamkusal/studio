
// src/components/layout/api-key-warning-banner.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ApiKeyWarningBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<string | null>(null);

  useEffect(() => {
    // Note: process.env.NEXT_PUBLIC_FIREBASE_API_KEY is resolved at build time.
    // This client-side check is mostly for runtime display logic based on that build-time value.
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    let problematic = false;
    let statusMessage = "";

    if (!apiKey) {
      problematic = true;
      statusMessage = "NEXT_PUBLIC_FIREBASE_API_KEY is missing.";
    } else if (apiKey.includes("YOUR_") || apiKey.includes("PASTE_") || apiKey.includes("XXXXX") || apiKey.length < 20) {
      problematic = true;
      statusMessage = "NEXT_PUBLIC_FIREBASE_API_KEY appears to be a placeholder or invalid.";
    }

    if (problematic) {
      setApiKeyStatus(statusMessage);
      setIsVisible(true);
      // console.error(`🔴🔴🔴 CONFIGURATION ERROR: ${statusMessage} Please check your .env file or hosting provider's environment variable settings. Firebase services will not work correctly. 🔴🔴🔴`);
      // The console.error above was removed as it was being picked up by Next.js error overlay.
      // The visual banner itself serves as the primary warning.
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ff4b4b', // Bright red
        color: 'white',
        padding: '10px 20px',
        textAlign: 'center',
        zIndex: 9999,
        fontSize: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <strong>Configuration Alert:</strong> {apiKeyStatus} TRACKERLY may not function correctly.
      Please verify your Firebase API Key in your environment settings.
    </div>
  );
}
