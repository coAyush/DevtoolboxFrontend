import { useState } from "react";
import PageBackground from "../styles/Pagebackground";
import EmailEnter from "../components/forgot_password/EmailEnter";
import VerifyOtp from "../components/forgot_password/VerifyOtp";
import ResetPassword from "../components/forgot_password/ResetPassword";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <PageBackground>
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        {step === 1 && (
          <EmailEnter
            step={step}
            setStep={setStep}
            email={email}
            setEmail={setEmail}
            onEmailSubmit={(enteredEmail) => {
              setEmail(enteredEmail);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <VerifyOtp
            email={email}
            stepInfo="STEP 2 OF 3"
            title="Verify reset code"
            subtitle="Enter the 6-digit verification code sent to reset your password."
            onBack={() => setStep(1)}
            onSuccess={() => setStep(3)}
            setStep={setStep}
          />
        )}

        {step === 3 && (
          <ResetPassword
            step={step}
            setStep={setStep}
            email={email}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </PageBackground>
  );
};

export default ForgotPassword;