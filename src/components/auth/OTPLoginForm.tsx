
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMobileOTP, verifyMobileOTP } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SendHorizontal, KeyRound, ArrowRight, AlertTriangle } from "lucide-react";
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
    
    // Validation specifically for Indian numbers
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }

    // Enforce Indian number format
    const indianNumberRegex = /^\+91[6-9]\d{9}$/;
    const formattedNumber = mobileNumber.startsWith('+') 
      ? mobileNumber 
      : `+91${mobileNumber.replace(/^0/, '')}`;
    
    if (!indianNumberRegex.test(formattedNumber)) {
      toast({
        title: "Invalid Number Format",
        description: "Please enter a valid Indian mobile number starting with +91",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
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
    
    if (!otp || otp.length < 4) {
      toast({
        title: "Error",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Ensure Indian number format
      const formattedNumber = mobileNumber.startsWith('+91') 
        ? mobileNumber 
        : `+91${mobileNumber.replace(/^0/, '')}`;
        
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
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm text-blue-700">
                This OTP login is only for Indian mobile numbers (+91)
              </p>
            </div>
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number (India)</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                +91
              </div>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="9XXXXXXXXX"
                value={mobileNumber.replace(/^\+91/, '')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setMobileNumber(value);
                }}
                className="pl-12 py-6 bg-gray-50 border-gray-200"
                maxLength={10}
                required
              />
              <SendHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter 10 digits (e.g., 9876543210)
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || mobileNumber.length < 10}
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
              Enter the 4-digit code sent to +91 {mobileNumber.replace(/^\+91/, '')}
            </p>
            
            <div className="flex justify-center">
              <InputOTP 
                value={otp} 
                onChange={setOtp} 
                maxLength={4}
                containerClassName="gap-3"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={1} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={2} className="border-gray-300 h-12 w-12 text-xl" />
                  <InputOTPSlot index={3} className="border-gray-300 h-12 w-12 text-xl" />
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
            disabled={isLoading || otp.length < 4}
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
