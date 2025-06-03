import { useEffect } from 'react';

export default function DashboardHomeOverview() {
  useEffect(() => {
    window.location.href = 'https://dashboard-gules-theta.vercel.app';
  }, []);

  return null; // or a loading spinner if you want
}
