
// src/components/onboarding/onboarding-modal.tsx
'use client';

import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building, UserPlus, Users, BadgeHelp } from 'lucide-react';
import { firestore, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, getDocs, query, where, updateDoc, arrayUnion, serverTimestamp, Timestamp, collection, writeBatch } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { industries, type Industry, type Organization, type UserProfile } from '@/types/firestore';
import { useRouter } from 'next/navigation'; // For potential redirect after onboarding
import { useAuth } from '@/context/auth-provider';


interface OnboardingModalProps {
  user: FirebaseUser;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const createOrgSchema = z.object({
  orgName: z.string().min(3, { message: "Organization name must be at least 3 characters." }).max(100),
  orgDescription: z.string().max(500).optional(),
  orgIndustry: z.enum(industries, { errorMap: () => ({ message: "Please select a valid industry." }) }),
});
type CreateOrgInputs = z.infer<typeof createOrgSchema>;

const joinOrgSchema = z.object({
  orgCode: z.string().length(10, { message: "Organization code must be TRK- followed by 6 characters." })
    .regex(/^TRK-[A-Z0-9]{6}$/, { message: "Invalid organization code format (e.g., TRK-A1B2C3)." }),
});
type JoinOrgInputs = z.infer<typeof joinOrgSchema>;

function generateOrgCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TRK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function OnboardingModal({ user, isOpen, setIsOpen }: OnboardingModalProps) {
  const [step, setStep] = useState<'welcome' | 'createOrg' | 'joinOrg'>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { reloadUserProfile } = useAuth();


  const createOrgForm = useForm<CreateOrgInputs>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { orgIndustry: industries[0] }
  });

  const joinOrgForm = useForm<JoinOrgInputs>({
    resolver: zodResolver(joinOrgSchema),
  });

  const handleCreateOrganization: SubmitHandler<CreateOrgInputs> = async (data) => {
    setIsSubmitting(true);
    const newOrgCode = generateOrgCode();
    // TODO: Add check for orgCode uniqueness, though highly unlikely to collide initially.
    // For a production app, this check would involve querying Firestore before writing.

    const newOrganization: Omit<Organization, 'id'> = {
      name: data.orgName,
      description: data.orgDescription || '',
      industry: data.orgIndustry,
      ownerUid: user.uid,
      orgCode: newOrgCode,
      members: [user.uid],
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    try {
      const batch = writeBatch(firestore);
      const orgRef = doc(collection(firestore, 'organizations')); // Auto-generate ID
      batch.set(orgRef, newOrganization);

      const userProfileRef = doc(firestore, 'users', user.uid);
      batch.update(userProfileRef, {
        organizationId: orgRef.id,
        role: 'owner',
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();

      toast({ title: "Organization Created!", description: `${data.orgName} has been successfully created.` });
      await reloadUserProfile(); // Reload profile to reflect changes
      setIsOpen(false);
      router.push('/dashboard'); // Or to a specific org dashboard
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({ title: "Error", description: "Failed to create organization. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinOrganization: SubmitHandler<JoinOrgInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const orgsRef = collection(firestore, 'organizations');
      const q = query(orgsRef, where("orgCode", "==", data.orgCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        joinOrgForm.setError("orgCode", { type: "manual", message: "Organization code not found." });
        setIsSubmitting(false);
        return;
      }

      const orgDoc = querySnapshot.docs[0];
      const orgData = orgDoc.data() as Organization;

      if (orgData.members.includes(user.uid)) {
         toast({ title: "Already a Member", description: "You are already a member of this organization."});
      } else {
        const batch = writeBatch(firestore);
        batch.update(orgDoc.ref, {
          members: arrayUnion(user.uid),
          updatedAt: serverTimestamp(),
        });

        const userProfileRef = doc(firestore, 'users', user.uid);
        batch.update(userProfileRef, {
          organizationId: orgDoc.id,
          role: 'member',
          onboardingComplete: true,
          updatedAt: serverTimestamp(),
        });
        
        await batch.commit();
        toast({ title: "Joined Organization!", description: `Successfully joined ${orgData.name}.` });
      }
      
      await reloadUserProfile();
      setIsOpen(false);
      router.push('/dashboard');

    } catch (error) {
      console.error("Error joining organization:", error);
      toast({ title: "Error", description: "Failed to join organization. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetToWelcome = () => {
    setStep('welcome');
    createOrgForm.reset();
    joinOrgForm.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setIsOpen(false); /* Allow closing by escape/overlay */ }}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">
            {step === 'welcome' && <>Welcome to Trackerly <span role="img" aria-label="wave">👋</span></>}
            {step === 'createOrg' && "Create Your Organization"}
            {step === 'joinOrg' && "Join an Existing Organization"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'welcome' && "Let’s get you started. What would you like to do?"}
            {step === 'createOrg' && "Setup your new workspace in just a few steps."}
            {step === 'joinOrg' && "Enter the organization code provided to you."}
          </DialogDescription>
        </DialogHeader>

        {step === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2" onClick={() => setStep('createOrg')}>
              <Building className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold">Create an Organization</span>
              <span className="text-xs text-muted-foreground">Start fresh and invite your team.</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2" onClick={() => setStep('joinOrg')}>
              <Users className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold">Join an Organization</span>
              <span className="text-xs text-muted-foreground">Use an invite code to join.</span>
            </Button>
          </div>
        )}

        {step === 'createOrg' && (
          <form onSubmit={createOrgForm.handleSubmit(handleCreateOrganization)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" {...createOrgForm.register('orgName')} placeholder="Your Company Inc." className="bg-secondary/30 border-border/70" />
              {createOrgForm.formState.errors.orgName && <p className="text-sm text-destructive mt-1">{createOrgForm.formState.errors.orgName.message}</p>}
            </div>
            <div>
              <Label htmlFor="orgDescription">Organization Description (Optional)</Label>
              <Textarea id="orgDescription" {...createOrgForm.register('orgDescription')} placeholder="What does your organization do?" rows={3} className="bg-secondary/30 border-border/70" />
            </div>
            <div>
              <Label htmlFor="orgIndustry">Industry / Type</Label>
              <Select onValueChange={(value) => createOrgForm.setValue('orgIndustry', value as Industry, { shouldValidate: true })} defaultValue={industries[0]}>
                <SelectTrigger id="orgIndustry" className="bg-secondary/30 border-border/70">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {createOrgForm.formState.errors.orgIndustry && <p className="text-sm text-destructive mt-1">{createOrgForm.formState.errors.orgIndustry.message}</p>}
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={resetToWelcome} disabled={isSubmitting}>Back</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'joinOrg' && (
          <form onSubmit={joinOrgForm.handleSubmit(handleJoinOrganization)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="orgCode">Organization Code</Label>
              <Input id="orgCode" {...joinOrgForm.register('orgCode')} placeholder="TRK-XXXXXX" className="bg-secondary/30 border-border/70" />
              {joinOrgForm.formState.errors.orgCode && <p className="text-sm text-destructive mt-1">{joinOrgForm.formState.errors.orgCode.message}</p>}
            </div>
             <p className="text-xs text-muted-foreground flex items-center">
                <BadgeHelp className="h-4 w-4 mr-1.5 text-primary" />
                The organization code is case-sensitive and should look like TRK-A1B2C3.
            </p>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={resetToWelcome} disabled={isSubmitting}>Back</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join Organization
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
