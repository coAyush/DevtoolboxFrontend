import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PageBackground from '../styles/Pagebackground';
import Terminal from '../styles/Terminal';
import SignupContainer from '../components/signup/SignupContainer';
import VerifyOtp from '../components/forgot_password/VerifyOtp';
import { toastSuccess } from '../util/toat';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden min-h-screen w-full flex items-center justify-center">
      <PageBackground>
        <Terminal className="h-[92vh] max-h-[880px] w-[94vw] max-w-6xl items-center justify-center p-2 sm:p-4 z-10 relative">
          {step === 1 && (
            <SignupContainer
              setStep={setStep}
              onSuccess={(userEmail) => {
                setEmail(userEmail);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <VerifyOtp
              email={email}
              stepInfo="STEP 2 OF 2"
              title="Verify your email"
              subtitle="Enter the 6-digit verification code to complete your registration."
              onBack={() => setStep(1)}
              onSuccess={() => {
                toastSuccess("Account verified successfully! Please log in.");
                navigate("/login");
              }}
            />
          )}
        </Terminal>
      </PageBackground>
    </div>
  );
};

export default Signup;
