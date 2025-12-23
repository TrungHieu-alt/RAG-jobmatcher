import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import { RoleSelection } from './onboardingComponents/RoleSelection';
import { CandidateFlow } from './onboardingComponents/CandidateFlow';
import { RecruiterFlow } from './onboardingComponents/RecruiterFlow';
import { ProgressIndicator } from './onboardingComponents/ProgressIndicator';

import {
  updateUserRole,
  createCandidateProfile,
  createRecruiterProfile
} from "@/api/users";

type UserRole = 'candidate' | 'recruiter' | null;

interface OnboardingData {
  role: UserRole;
  // Candidate data
  full_name?: string;
  field?: string;
  desiredRole?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  bio?: string;
  // Recruiter data
  companyName?: string;
  title?: string;
  companyLogo?: string;
  companyDescription?: string;
  hiringIndustry?: string[];
}

export default function OnBoardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ role: null });

  // Called when user selects candidate / recruiter
  const handleRoleSelect = (role: UserRole) => {
    setData({ ...data, role });
  };

  // MAIN NEXT HANDLER — includes ALL LOGIC
  const handleNext = async (stepData?: Partial<OnboardingData>) => {
    const newData = stepData ? { ...data, ...stepData } : data;
    const userId = Number(localStorage.getItem("user_id"));

    // -----------------------------
    // STEP 0 → UPDATE USER ROLE
    // -----------------------------
    if (currentStep === 0 && newData.role && userId) {
      await updateUserRole(userId, newData.role);
      setData(newData);
      setCurrentStep(1);
      return;
    }

    // -----------------------------
    // LAST STEP → CREATE PROFILE
    // -----------------------------
    // const isCandidateLast = newData.role === "candidate" && currentStep === 8;
    // const isRecruiterLast = newData.role === "recruiter" && currentStep === 6;

    // if (userId && isCandidateLast) {
    //   console.log("2");

    //   await createCandidateProfile(userId, {
    //     full_name: newData.full_name ?? null,
    //     location: newData.location ?? null,
    //     experience: newData.experience ?? null,
    //     skills: newData.skills ?? null,
    //     bio: newData.bio ?? null,
    //   });
    //   console.log("Candidate profile created");
    //   // TODO: redirect dashboard
    //   return;
    // }

    // if (userId && isRecruiterLast) {
    //   console.log("2");
    //   await createRecruiterProfile(userId, {
    //     companyName: newData.companyName ?? null,
    //     title: newData.title ?? null,
    //     companyLogo: newData.companyLogo ?? null,
    //     companyDescription: newData.companyDescription ?? null,
    //     hiringIndustry: newData.hiringIndustry ?? null,
    //   });
    //   console.log("Recruiter profile created");
    //   // TODO: redirect dashboard
    //   return;
    // }

    // -----------------------------
    // NORMAL NEXT STEP
    // -----------------------------
    setData(newData);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTotalSteps = () => {
    if (data.role === 'candidate') return 9;   // step 0 + 7 candidate screens
    if (data.role === 'recruiter') return 7;   // step 0 + 6 recruiter screens
    return 1;
  };

  const renderStep = () => {
    // STEP 0 — Role selection
    if (currentStep === 0) {
      return (
        <RoleSelection
          selectedRole={data.role}
          onSelect={handleRoleSelect}
          onNext={() => handleNext()}
        />
      );
    }

    // Candidate onboarding
    if (data.role === 'candidate') {
      return (
        <CandidateFlow
          step={currentStep - 1}
          data={data}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    // Recruiter onboarding
    if (data.role === 'recruiter') {
      return (
        <RecruiterFlow
          step={currentStep - 1}
          data={data}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA] to-[#C7D2FE]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[100px]" />
      </div>

      {/* Progress bar */}
      {currentStep > 0 && (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={getTotalSteps()}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-screen"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
