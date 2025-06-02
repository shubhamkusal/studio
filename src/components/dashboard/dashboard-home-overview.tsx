// src/components/dashboard/dashboard-home-overview.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlarmClock, Activity, Puzzle, LineChart, Bell, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Organization } from '@/types/firestore';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  cta?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, description, cta }) => (
  <Card className="flex flex-col bg-card/80 hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-card-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
    </CardContent>
    {cta && <CardFooter>{cta}</CardFooter>}
  </Card>
);

export default function DashboardHomeOverview() {
  const { user, userProfile, profileLoading: authProfileLoading } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (userProfile?.organizationId) {
        setOrgLoading(true);
        try {
          const orgDocRef = doc(firestore, 'organizations', userProfile.organizationId);
          const orgDocSnap = await getDoc(orgDocRef);
          if (orgDocSnap.exists()) {
            setOrganization({ id: orgDocSnap.id, ...orgDocSnap.data() } as Organization);
          } else {
            console.warn('Organization document not found for ID:', userProfile.organizationId);
            setOrganization(null);
          }
        } catch (error) {
          console.error("Error fetching organization:", error);
          setOrganization(null);
        } finally {
          setOrgLoading(false);
        }
      } else {
        setOrganization(null); // No org ID in profile
        setOrgLoading(false); // Not loading if no org ID
      }
    };

    if (!authProfileLoading && userProfile) {
      fetchOrganization();
    } else if (!authProfileLoading && !userProfile) {
      // If profile loading is done and there's no profile (e.g. error during auth/profile fetch)
      setOrgLoading(false);
    }
  }, [userProfile, authProfileLoading]);

  const isLoading = authProfileLoading || orgLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  const greetingName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const organizationName = organization?.name || 'your organization';
  const userRole = userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 'N/A';

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {greetingName}!
          </h1>
          <p className="text-sm text-muted-foreground">
            You are currently in <span className="font-semibold text-primary">{organizationName}</span>.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <AlarmClock className="mr-2 h-4 w-4" /> Clock In/Out
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-6">
        Role: <span className="font-medium text-foreground">{userRole}</span> | Active Shift: <span className="font-medium text-foreground">9 AM - 5 PM (Placeholder)</span>
      </div>

      {/* Core Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Hours This Week"
          value="0h 0m"
          icon={AlarmClock}
          description="Tracked work duration for the current week."
        />
        <MetricCard
          title="Active Tasks Today"
          value="0"
          icon={Activity}
          description="Tasks currently in progress."
        />
        <MetricCard
          title="Puzzle Verification Score"
          value="N/A"
          icon={Puzzle}
          description="Your gamified activity score."
        />
        <MetricCard
          title="Productivity Trend"
          value="Stable"
          icon={LineChart}
          description="Based on the last 7 days."
        />
      </div>

      {/* Notifications Panel & Other Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 bg-card/80">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity & Tasks</CardTitle>
            <CardDescription className="text-muted-foreground">Overview of your latest work items.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4 p-4 min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Task list and recent activity will appear here.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 bg-card/80">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notifications & Alerts
            </CardTitle>
            <CardDescription className="text-muted-foreground">Important updates and system messages.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px]">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1">•</span>
                <span className="text-muted-foreground">Placeholder: Role change approval pending.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2 mt-1">•</span>
                <span className="text-muted-foreground">Placeholder: Shift for tomorrow adjusted.</span>
              </li>
              <li className="flex items-start">
                <span className="text-destructive mr-2 mt-1">•</span>
                <span className="text-muted-foreground">Placeholder: AI Alert - Unusual login detected.</span>
              </li>
               <li className="flex items-start">
                <span className="text-muted-foreground/50 mr-2 mt-1">•</span>
                <span className="text-muted-foreground/70">No new critical alerts.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
