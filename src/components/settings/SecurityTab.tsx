
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, ShieldCheck, AlertTriangle, Smartphone } from "lucide-react";

export const SecurityTab = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      
      toast({
        title: twoFactorEnabled ? "2FA disabled" : "2FA enabled",
        description: twoFactorEnabled 
          ? "Two-factor authentication has been disabled" 
          : "Two-factor authentication has been enabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
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
            
            <div className="text-sm text-muted-foreground">
              <p>Password must:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Be at least 8 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable 2FA</h4>
              <p className="text-sm text-muted-foreground">
                Require a verification code when signing in
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
          
          {twoFactorEnabled && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                <Smartphone className="mr-2 h-4 w-4" />
                SMS Verification
              </h4>
              <p className="text-sm text-blue-600 mb-4">
                A verification code will be sent to your registered phone number when you sign in
              </p>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
                Configure Phone Number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Manage how you receive security alerts and notifications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Login Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Get notified of new logins to your account
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Biometric Login</h4>
              <p className="text-sm text-muted-foreground">
                Enable fingerprint or face recognition for faster login
              </p>
            </div>
            <Switch
              checked={biometricsEnabled}
              onCheckedChange={setBiometricsEnabled}
            />
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Recent Login Activity</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Mumbai, India</span>
                  <span className="text-muted-foreground">Just now</span>
                </div>
                <p className="text-muted-foreground mt-1">Chrome on Windows</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Delhi, India</span>
                  <span className="text-muted-foreground">Yesterday, 15:42</span>
                </div>
                <p className="text-muted-foreground mt-1">Safari on iPhone</p>
              </div>
            </div>
            <Button variant="link" className="mt-2 p-0">
              View all activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
