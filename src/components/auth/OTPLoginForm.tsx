
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMobileOTP, verifyMobileOTP } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SendHorizontal, KeyRound, ArrowRight } from "lucide-react";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";

const OTPLoginForm = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format number to E.164 format if not already done
      const formattedNumber = mobileNumber.startsWith('+') 
        ? mobileNumber 
        : `+${mobileNumber}`;
        
      await sendMobileOTP(formattedNumber);
      setOtpSent(true);
      
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your mobile number",
      });
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please check your mobile number and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast({
        title: "Error",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format number to E.164 format if not already done
      const formattedNumber = mobileNumber.startsWith('+') 
        ? mobileNumber 
        : `+${mobileNumber}`;
        
      await verifyMobileOTP(formattedNumber, otp);
      
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to verify OTP:", error);
      toast({
        title: "Failed to verify OTP",
        description: error.message || "Invalid OTP, please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <div className="relative">
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter your mobile number with country code (e.g. +919876543210)"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="pl-10 py-6 bg-gray-50 border-gray-200"
                required
              />
              <SendHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Include your country code, e.g., +91 for India
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !mobileNumber}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the 6-digit code sent to {mobileNumber}
            </p>
            
            <div className="flex justify-center">
              <InputOTP 
                value={otp} 
                onChange={setOtp} 
                maxLength={6}
                containerClassName="gap-3"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={1} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={2} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={3} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={4} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={5} className="border-gray-300 h-12 w-12 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOtpSent(false)}
              disabled={isLoading}
            >
              Change Number
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleSendOTP}
              disabled={isLoading}
            >
              Resend OTP
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || otp.length < 6}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 transition-opacity py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Verifying...
              </>
            ) : (
              <>
                Verify & Login <KeyRound className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default OTPLoginForm;
