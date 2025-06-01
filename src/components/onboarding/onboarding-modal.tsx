
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
import { Loader2, Building, Users, BadgeHelp, ArrowLeft } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { doc, collection, writeBatch, query, where, getDocs, arrayUnion, serverTimestamp, type Timestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { industries, type Industry, type Organization, type OrganizationOwner, type UserProfile } from '@/types/firestore';
import { useRouter } from 'next/navigation';
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
  orgCode: z.string().length(10, { message: "Organization code must be 10 characters (e.g., TRK-A1B2C3)." })
    .regex(/^TRK-[A-Z0-9]{6}$/, { message: "Invalid format. Use TRK- followed by 6 uppercase letters/numbers." }),
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
    
    const ownerInfo: OrganizationOwner = {
        uid: user.uid,
        email: user.email || null, // Ensure email can be null
    };

    const newOrganizationData: Omit<Organization, 'id'> = {
      name: data.orgName,
      description: data.orgDescription || '',
      industry: data.orgIndustry,
      owner: ownerInfo,
      orgCode: newOrgCode,
      members: [user.uid],
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    try {
      const batch = writeBatch(firestore);
      const orgRef = doc(collection(firestore, 'organizations')); // Auto-generate ID
      batch.set(orgRef, newOrganizationData);

      const userProfileRef = doc(firestore, 'users', user.uid);
      batch.update(userProfileRef, {
        organizationId: orgRef.id,
        role: 'owner',
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      } as Partial<UserProfile>);

      await batch.commit();

      toast({ title: "Organization Created!", description: `${data.orgName} has been successfully created. Your org code: ${newOrgCode}` });
      await reloadUserProfile(); // Reload profile to get new org details
      setIsOpen(false); // Close modal
      router.push('/dashboard'); // Navigate to dashboard
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
        joinOrgForm.setError("orgCode", { type: "manual", message: "Organization code not found or invalid." });
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
        } as Partial<UserProfile>);
        
        await batch.commit();
        toast({ title: "Joined Organization!", description: `Successfully joined ${orgData.name}.` });
      }
      
      await reloadUserProfile(); // Reload profile
      setIsOpen(false); // Close modal
      router.push('/dashboard'); // Navigate
    } catch (error) {
      console.error("Error joining organization:", error);
      toast({ title: "Error", description: "Failed to join organization. Please ensure the code is correct and try again.", variant: "destructive" });
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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setIsOpen(false); }}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center text-card-foreground">
            {step === 'welcome' && <>Welcome to Trackerly <span role="img" aria-label="wave">👋</span></>}
            {step === 'createOrg' && "Create Your Organization"}
            {step === 'joinOrg' && "Join an Existing Organization"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {step === 'welcome' && "Let’s get you set up with an organization."}
            {step === 'createOrg' && "Fill in the details to create your new workspace."}
            {step === 'joinOrg' && "Enter the organization code given to you by an admin."}
          </DialogDescription>
        </DialogHeader>

        {step === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center space-y-2 border-primary/30 hover:border-primary hover:bg-primary/5" onClick={() => setStep('createOrg')}>
              <Building className="h-10 w-10 text-primary mb-2" />
              <span className="font-semibold text-lg text-card-foreground">Create Organization</span>
              <span className="text-xs text-muted-foreground text-center">Start fresh and invite your team members.</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center space-y-2 border-primary/30 hover:border-primary hover:bg-primary/5" onClick={() => setStep('joinOrg')}>
              <Users className="h-10 w-10 text-primary mb-2" />
              <span className="font-semibold text-lg text-card-foreground">Join Organization</span>
              <span className="text-xs text-muted-foreground text-center">Use an invite code to join an existing workspace.</span>
            </Button>
          </div>
        )}

        {step === 'createOrg' && (
          <form onSubmit={createOrgForm.handleSubmit(handleCreateOrganization)} className="space-y-6 py-4">
            <div>
              <Label htmlFor="orgName" className="text-card-foreground">Organization Name <span className="text-destructive">*</span></Label>
              <Input id="orgName" {...createOrgForm.register('orgName')} placeholder="e.g., Innovatech Solutions" className="bg-secondary/30 border-border/70" />
              {createOrgForm.formState.errors.orgName && <p className="text-sm text-destructive mt-1">{createOrgForm.formState.errors.orgName.message}</p>}
            </div>
            <div>
              <Label htmlFor="orgDescription" className="text-card-foreground">Organization Description (Optional)</Label>
              <Textarea id="orgDescription" {...createOrgForm.register('orgDescription')} placeholder="What does your organization focus on?" rows={3} className="bg-secondary/30 border-border/70" />
            </div>
            <div>
              <Label htmlFor="orgIndustry" className="text-card-foreground">Industry / Type <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => createOrgForm.setValue('orgIndustry', value as Industry, { shouldValidate: true })} defaultValue={createOrgForm.getValues('orgIndustry')}>
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
            <DialogFooter className="gap-2 sm:gap-0 pt-2 flex-col-reverse sm:flex-row sm:justify-between w-full">
              <Button type="button" variant="outline" onClick={resetToWelcome} disabled={isSubmitting} className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building className="mr-2 h-4 w-4" />}
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'joinOrg' && (
          <form onSubmit={joinOrgForm.handleSubmit(handleJoinOrganization)} className="space-y-6 py-4">
            <div>
              <Label htmlFor="orgCode" className="text-card-foreground">Organization Code <span className="text-destructive">*</span></Label>
              <Input id="orgCode" {...joinOrgForm.register('orgCode')} placeholder="TRK-XXXXXX" className="bg-secondary/30 border-border/70 tracking-wider" />
              {joinOrgForm.formState.errors.orgCode && <p className="text-sm text-destructive mt-1">{joinOrgForm.formState.errors.orgCode.message}</p>}
            </div>
             <p className="text-xs text-muted-foreground flex items-center">
                <BadgeHelp className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                This code is provided by your organization's administrator. It's case-sensitive and typically looks like TRK-A1B2C3.
            </p>
            <DialogFooter className="gap-2 sm:gap-0 pt-2 flex-col-reverse sm:flex-row sm:justify-between w-full">
              <Button type="button" variant="outline" onClick={resetToWelcome} disabled={isSubmitting} className="w-full sm:w-auto">
                 <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                Join Organization
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
