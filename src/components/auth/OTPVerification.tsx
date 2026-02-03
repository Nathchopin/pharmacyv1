import { useState, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";

interface OTPVerificationProps {
  phone: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

export function OTPVerification({
  phone,
  onVerify,
  onResend,
  onBack,
  loading,
}: OTPVerificationProps) {
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleComplete = async (value: string) => {
    setCode(value);
    if (value.length === 6) {
      await onVerify(value);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResending(true);
    try {
      await onResend();
      setResendTimer(60);
      setCode("");
    } finally {
      setResending(false);
    }
  };

  const formatPhone = (phone: string) => {
    // Format as +44 7XXX XXX XXX
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length >= 10) {
      return `+44 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return `+44 ${phone}`;
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="text-center space-y-2">
        <h3 className="font-serif text-2xl font-medium">Verify your phone</h3>
        <p className="text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{formatPhone(phone)}</span>
        </p>
      </div>

      <div className="flex justify-center py-4">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={handleComplete}
          disabled={loading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-lg rounded-lg border-2" />
            <InputOTPSlot index={1} className="w-12 h-14 text-lg rounded-lg border-2" />
            <InputOTPSlot index={2} className="w-12 h-14 text-lg rounded-lg border-2" />
            <InputOTPSlot index={3} className="w-12 h-14 text-lg rounded-lg border-2" />
            <InputOTPSlot index={4} className="w-12 h-14 text-lg rounded-lg border-2" />
            <InputOTPSlot index={5} className="w-12 h-14 text-lg rounded-lg border-2" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-eucalyptus">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Verifying...</span>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0 || resending}
          className={`
            inline-flex items-center gap-2 text-sm transition-colors
            ${
              resendTimer > 0
                ? "text-muted-foreground cursor-not-allowed"
                : "text-eucalyptus hover:text-eucalyptus-light"
            }
          `}
        >
          {resending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {resendTimer > 0 ? (
            <span>Resend code in {resendTimer}s</span>
          ) : (
            <span>Resend code</span>
          )}
        </button>
      </div>

      <Button
        type="button"
        onClick={() => onVerify(code)}
        disabled={code.length !== 6 || loading}
        className="w-full h-12 rounded-xl bg-eucalyptus hover:bg-eucalyptus-light text-white font-medium transition-all"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Verify & Create Account"
        )}
      </Button>
    </div>
  );
}
