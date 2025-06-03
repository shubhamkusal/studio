import { useEffect } from 'react';

export default function DashboardHomeOverview() {
  useEffect(() => {
    window.location.href = 'https://trackerly-dashboard.vercel.app/';
  }, []);

  return null; // or a loading spinner if you want
}
