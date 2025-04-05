
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, AlertCircle, Lock } from "lucide-react";

export const SecurityTab = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "The new password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This is a placeholder for actual password change functionality
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Failed to update password",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      // This is a placeholder for actual two-factor auth toggle
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      
      toast({
        title: twoFactorEnabled ? "Two-factor authentication disabled" : "Two-factor authentication enabled",
        description: twoFactorEnabled 
          ? "Your account is now less secure." 
          : "Your account is now more secure.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update two-factor authentication",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </div>
          <Lock className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Two-Factor Authentication Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </div>
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Receive a verification code on your phone each time you sign in
              </p>
            </div>
            <Switch 
              id="two-factor"
              checked={twoFactorEnabled}
              onCheckedChange={handleToggleTwoFactor}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Security Alerts Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>Get notified about important security events</CardDescription>
          </div>
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-alerts">Login Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch 
              id="login-alerts"
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about all loan and payment transactions
              </p>
            </div>
            <Switch 
              id="transaction-alerts"
              checked={transactionAlerts}
              onCheckedChange={setTransactionAlerts}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => {
            toast({
              title: "Settings saved",
              description: "Your security alert preferences have been updated.",
            });
          }}>
            Save Alert Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
