import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sendMobileOTP, verifyMobileOTP, updateUserProfile } from "@/services/authService";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";

import { AppSidebar } from "@/components/AppSidebar";

const MobileVerification = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isVerified) {
      setVerified(true);
    }
    
    if (user?.mobileNumber) {
      setMobileNumber(user.mobileNumber);
    }
  }, [user]);

  const handleSendOTP = async () => {
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

  const handleVerifyOTP = async () => {
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
      // Format number to E.164 format if not already done
      const formattedNumber = mobileNumber.startsWith('+') 
        ? mobileNumber 
        : `+${mobileNumber}`;
        
      await verifyMobileOTP(formattedNumber, otp);
      
      // Update the user profile with verified mobile number
      if (user) {
        await updateUserProfile(user.id, {
          mobileNumber: formattedNumber,
          isVerified: true
        });
        
        // Update the local user data
        await updateUser({
          mobileNumber: formattedNumber,
          isVerified: true
        });
      }
      
      setVerified(true);
      
      toast({
        title: "Verification Successful",
        description: "Your mobile number has been verified successfully",
      });
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
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-6">Mobile Verification</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Mobile Number</CardTitle>
              <CardDescription>
                Verifying your mobile number adds an extra layer of security and enables OTP login
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verified ? (
                <div className="flex items-center bg-green-50 p-4 rounded-md text-green-700 border border-green-200">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-medium">Mobile number verified</p>
                    <p className="text-sm">Your mobile number {user?.mobileNumber} has been verified successfully</p>
                  </div>
                </div>
              ) : otpSent ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otp">Verification Code</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter the 4-digit code sent to {mobileNumber}
                    </p>
                    
                    <div className="flex justify-center my-6">
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
                    
                    <div className="flex items-center justify-between mt-4">
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
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-md text-amber-700 border border-amber-200 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Verification Required</p>
                        <p className="text-sm">Please verify your mobile number to enable OTP-based login and additional security features</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      placeholder="Enter with country code (e.g. +919876543210)"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include your country code, e.g., +91 for India
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {verified ? (
                <Button onClick={() => navigate("/settings")} variant="outline">
                  Back to Settings
                </Button>
              ) : otpSent ? (
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={isLoading || otp.length < 4}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Verifying...
                    </>
                  ) : (
                    "Verify Number"
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleSendOTP} 
                  disabled={isLoading || !mobileNumber}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Sending OTP...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MobileVerification;
