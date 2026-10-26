import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PageBackground from '../styles/Pagebackground';
import Terminal from '../styles/Terminal';
import LoginContainer from '../components/login/LoginContainer';
import VerifyOtp from '../components/forgot_password/VerifyOtp';
import { toastSuccess } from '../util/toat';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  /**
   * RESPONSIVE MODAL PAGE TIP:
   * Do NOT use `overflow-hidden` on full-page wrappers.
   * On mobile devices with smaller vertical heights or when the virtual keyboard pops up,
   * `overflow-hidden` traps the user and makes form inputs inaccessible.
   * Instead, allow vertical scroll and use responsive widths like `w-[96vw] sm:w-[94vw]`.
   */
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-x-hidden">
      <PageBackground>
        <Terminal className="min-h-[550px] h-[92vh] max-h-[880px] w-[96vw] sm:w-[94vw] max-w-6xl items-center justify-center p-1 sm:p-4 z-10 relative">
          {step === 1 && (
            <LoginContainer
              desc="Select your workspace type to personalize your experience"
              setStep={setStep}
              setEmail={setEmail}
            />
          )}

          {step === 2 && (
            <VerifyOtp
              email={email}
              stepInfo="STEP 2 OF 2"
              title="Two-Factor Authentication"
              subtitle="Enter the 6-digit verification code sent to your email to complete login."
              onBack={() => setStep(1)}
              onSuccess={() => {
                toastSuccess("Logged in successfully!");
                navigate("/");
              }}
            />
          )}
        </Terminal>
      </PageBackground>
    </div>
  );
};

export default Login;

