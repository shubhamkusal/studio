// src/components/onboarding/onboarding-modal.tsx
'use client';

import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Make sure Input is imported if not already
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building, Users, BadgeHelp, ArrowLeft, CheckCircle, Copy as CopyIcon, SkipForward, X } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { doc, collection, writeBatch, query, where, getDocs, arrayUnion, serverTimestamp, type Timestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { industries, type Industry, type Organization, type UserProfile } from '@/types/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';

interface OnboardingModalProps {
  user: FirebaseUser;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface OrganizationOwner {  uid: string;
  email: string | null;
}

const createOrgSchema = z.object({
  orgName: z.string().min(3, { message: "Organization name must be at least 3 characters." }).max(100),
  orgDescription: z.string().max(500).optional(),
  orgIndustry: z.enum(industries, { errorMap: () => ({ message: "Please select a valid industry." }) }),
});
type CreateOrgInputs = z.infer<typeof createOrgSchema>;

const joinOrgSchema = z.object({
  orgCode: z.string().min(1, { message: "Organization code is required." })
    .refine((code) => {
      // More flexible validation - accept various formats
      const trimmed = code.trim().toUpperCase();
      return trimmed.length >= 6; // Minimum 6 characters
    }, { message: "Please enter a valid organization code." }),
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
  const [step, setStep] = useState<'welcome' | 'createOrg' | 'joinOrg' | 'creationSuccess'>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrgDetails, setCreatedOrgDetails] = useState<{ name: string; code: string } | null>(null);
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
        email: user.email || null,
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
      const orgRef = doc(collection(firestore, 'organizations'));
      batch.set(orgRef, newOrganizationData);

      const userProfileRef = doc(firestore, 'users', user.uid);
      batch.update(userProfileRef, {
        organizationId: orgRef.id,
        role: 'owner',
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      } as Partial<UserProfile>);

      await batch.commit();

      setCreatedOrgDetails({ name: data.orgName, code: newOrgCode });
      setStep('creationSuccess');
      toast({ title: "Organization Created!", description: `${data.orgName} has been successfully created.` });
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
      // Fix: Normalize the organization code input
      const normalizedCode = data.orgCode.trim().toUpperCase();
      console.log("Searching for organization code:", normalizedCode);

      const orgsRef = collection(firestore, 'organizations');
      const q = query(orgsRef, where("orgCode", "==", normalizedCode));
      const querySnapshot = await getDocs(q);

      console.log("Query results:", querySnapshot.docs.length);

      if (querySnapshot.empty) {
        // Try alternative search without normalization in case stored codes have different casing
        const q2 = query(orgsRef, where("orgCode", "==", data.orgCode.trim()));
        const querySnapshot2 = await getDocs(q2);
        
        if (querySnapshot2.empty) {
          joinOrgForm.setError("orgCode", { 
            type: "manual", 
            message: "Organization not found. Please check the code and try again." 
          });
          setIsSubmitting(false);
          return;
        }
        
        // Use the second query result if found
        const orgDoc = querySnapshot2.docs[0];
        await processJoinOrganization(orgDoc);
      } else {
        const orgDoc = querySnapshot.docs[0];
        await processJoinOrganization(orgDoc);
      }
    } catch (error) {
      console.error("Error joining organization:", error);
      toast({ 
        title: "Error", 
        description: "Failed to join organization. Please ensure the code is correct and try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to process joining organization
  const processJoinOrganization = async (orgDoc: any) => {
    const orgData = orgDoc.data() as Organization;

    if (orgData.members.includes(user.uid)) {
      toast({ 
        title: "Already a Member", 
        description: "You are already a member of this organization.",
        variant: "default"
      });
      await reloadUserProfile();
      setIsOpen(false);
      router.push('/dashboard');
      return;
    }

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
    toast({ 
      title: "Joined Organization!", 
      description: `Successfully joined ${orgData.name}.` 
    });

    await reloadUserProfile();
    setIsOpen(false);
    router.push('/dashboard');
  };

  // Fix: New skip function
  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await writeBatch(firestore).update(userProfileRef, {
        onboardingComplete: true,
        organizationId: null, // No organization
        role: null, // No role
        updatedAt: serverTimestamp(),
      }).commit();

      toast({ 
        title: "Onboarding Skipped", 
        description: "You can join or create an organization later from your profile." 
      });

      await reloadUserProfile();
      setIsOpen(false);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      toast({ 
        title: "Error", 
        description: "Failed to skip onboarding. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToWelcome = () => {
    setStep('welcome');
    createOrgForm.reset();
    joinOrgForm.reset();
    setCreatedOrgDetails(null);
  }

  const handleCopyToClipboard = async () => {
    if (createdOrgDetails?.code) {
      try {
        await navigator.clipboard.writeText(createdOrgDetails.code);
        toast({ title: "Copied!", description: "Invite code copied to clipboard." });
      } catch (err) {
        toast({ title: "Error", description: "Failed to copy code.", variant: "destructive" });
      }
    }
  };

  const proceedToDashboard = async () => {
    await reloadUserProfile();
    setIsOpen(false);
    router.push('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { 
      if (!open && step !== 'creationSuccess') {
        setIsOpen(false);
      }
    }}>
      <DialogContent className="sm:max-w-[480px] md:max-w-[520px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl relative mx-auto my-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl">
        <DialogHeader className="space-y-4 pb-6 px-6 pt-6">
          <DialogTitle className="font-bold text-3xl text-center text-slate-800">
            {step === 'welcome' && <>Welcome to Trackerly <span role="img" aria-label="wave">👋</span></>}
            {step === 'createOrg' && "Create Your Organization"}
            {step === 'joinOrg' && "Join an Existing Organization"}
            {step === 'creationSuccess' && "Organization Created Successfully!"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
            {step === 'welcome' && "Let's get you set up with an organization to start collaborating."}
            {step === 'createOrg' && "Fill in the details to create your new workspace."}
            {step === 'joinOrg' && "Enter the organization code given to you by an admin."}
            {step === 'creationSuccess' && `Your organization "${createdOrgDetails?.name}" is ready.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'welcome' && (
          <div className="space-y-8 px-6 pb-6">
            <div className="grid grid-cols-1 gap-6">
              <Button 
                variant="outline" 
                className="h-auto py-8 px-8 flex flex-col items-center justify-center space-y-4 border-2 border-slate-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm hover:shadow-md" 
                onClick={() => setStep('createOrg')}
              >
                <Building className="h-14 w-14 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all duration-300" />
                <div className="text-center space-y-2">
                  <span className="font-bold text-xl text-slate-800 block">Create Organization</span>
                  <span className="text-sm text-slate-600 leading-relaxed block">Start fresh and invite your team members</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-8 px-8 flex flex-col items-center justify-center space-y-4 border-2 border-slate-200 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm hover:shadow-md" 
                onClick={() => setStep('joinOrg')}
              >
                <Users className="h-14 w-14 text-emerald-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all duration-300" />
                <div className="text-center space-y-2">
                  <span className="font-bold text-xl text-slate-800 block">Join Organization</span>
                  <span className="text-sm text-slate-600 leading-relaxed block">Use an invite code to join an existing workspace</span>
                </div>
              </Button>
            </div>
            
            {/* Skip Option */}
            <div className="pt-6 border-t border-slate-100">
              <Button 
                variant="ghost" 
                className="w-full py-4 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 rounded-xl font-medium"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <SkipForward className="mr-3 h-5 w-5" />
                )}
                <span>Skip for now</span>
              </Button>
              <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
                You can join or create an organization later from your profile
              </p>
            </div>
          </div>
        )}

        {step === 'createOrg' && (
          <form onSubmit={createOrgForm.handleSubmit(handleCreateOrganization)} className="space-y-6 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="orgName" className="text-slate-800 font-semibold text-base">
                Organization Name <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="orgName" 
                {...createOrgForm.register('orgName')} 
                placeholder="e.g., Innovatech Solutions" 
                className="h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl text-slate-800 placeholder:text-slate-400" 
              />
              {createOrgForm.formState.errors.orgName && (
                <p className="text-sm text-rose-500 mt-2 flex items-center">
                  <X className="h-4 w-4 mr-2" />
                  {createOrgForm.formState.errors.orgName.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orgDescription" className="text-slate-800 font-semibold text-base">
                Organization Description <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Textarea 
                id="orgDescription" 
                {...createOrgForm.register('orgDescription')} 
                placeholder="What does your organization focus on?" 
                rows={4} 
                className="bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none rounded-xl text-slate-800 placeholder:text-slate-400" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orgIndustry" className="text-slate-800 font-semibold text-base">
                Industry / Type <span className="text-rose-500">*</span>
              </Label>
              <Select 
                onValueChange={(value) => createOrgForm.setValue('orgIndustry', value as Industry, { shouldValidate: true })} 
                defaultValue={createOrgForm.getValues('orgIndustry')}
              >
                <SelectTrigger id="orgIndustry" className="h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-slate-800">
                  <SelectValue placeholder="Select an industry" className="text-slate-400" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-lg">
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry} className="hover:bg-slate-50 text-slate-800 rounded-lg mx-1">
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {createOrgForm.formState.errors.orgIndustry && (
                <p className="text-sm text-rose-500 mt-2 flex items-center">
                  <X className="h-4 w-4 mr-2" />
                  {createOrgForm.formState.errors.orgIndustry.message}
                </p>
              )}
            </div>
            
            <DialogFooter className="gap-4 pt-8 flex-col-reverse sm:flex-row sm:justify-between w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetToWelcome} 
                disabled={isSubmitting} 
                className="w-full sm:w-auto h-12 border-2 border-slate-200 hover:bg-slate-50 rounded-xl bg-white text-slate-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full sm:w-auto h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Building className="mr-2 h-5 w-5" />
                )}
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'joinOrg' && (
          <form onSubmit={joinOrgForm.handleSubmit(handleJoinOrganization)} className="space-y-6 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="orgCode" className="text-slate-800 font-semibold text-base">
                Organization Code <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="orgCode" 
                {...joinOrgForm.register('orgCode')} 
                placeholder="Enter organization code (e.g., TRK-XXXXXX)" 
                className="h-12 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white transition-all duration-200 font-mono tracking-wider text-center rounded-xl text-slate-800 placeholder:text-slate-400" 
              />
              {joinOrgForm.formState.errors.orgCode && (
                <p className="text-sm text-rose-500 mt-2 flex items-center">
                  <X className="h-4 w-4 mr-2" />
                  {joinOrgForm.formState.errors.orgCode.message}
                </p>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-sm text-amber-800 flex items-start leading-relaxed">
                <BadgeHelp className="h-5 w-5 mr-3 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  This code is provided by your organization's administrator. 
                  It typically looks like <code className="bg-amber-100 px-2 py-1 rounded-lg font-mono text-xs font-semibold text-amber-900">TRK-A1B2C3</code> 
                  but may vary in format.
                </span>
              </p>
            </div>
            
            <DialogFooter className="gap-4 pt-8 flex-col-reverse sm:flex-row sm:justify-between w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetToWelcome} 
                disabled={isSubmitting} 
                className="w-full sm:w-auto h-12 border-2 border-slate-200 hover:bg-slate-50 rounded-xl bg-white text-slate-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full sm:w-auto h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Users className="mr-2 h-5 w-5" />
                )}
                Join Organization
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'creationSuccess' && createdOrgDetails && (
          <div className="px-6 pb-6 space-y-8 text-center">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full w-20 h-20 mx-auto animate-pulse"></div>
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto relative z-10 drop-shadow-sm" />
              </div>
              <div className="space-y-3">
                <p className="text-2xl text-slate-800 font-bold leading-tight">
                  Your organization <span className="text-blue-600">{createdOrgDetails.name}</span> has been created successfully!
                </p> {/* Changed to h2 for semantic correctness */}
                <p className="text-slate-600 text-lg">
                  Share this invite code with your team members:
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border-2 border-slate-200 shadow-inner">
              <div className="flex items-center justify-center space-x-4">
                <Input
                  readOnly
                  value={createdOrgDetails.code}
                  className="text-2xl font-mono tracking-widest text-center bg-white border-2 border-slate-300 w-auto text-slate-800 font-bold py-4 px-6 rounded-xl shadow-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyToClipboard}
                  className="h-14 w-14 border-2 border-slate-300 hover:bg-slate-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CopyIcon className="h-6 w-6 text-slate-700" /> {/* Icon adjusted for consistency */}
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-4 font-medium">
                Keep this code safe - you'll need it to invite team members
              </p>
            </div>
            
            <Button 
              onClick={proceedToDashboard} 
              className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}