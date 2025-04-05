
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Bell, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NotificationsTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification types
  const [loanUpdates, setLoanUpdates] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  
  // Notification methods
  const [notificationMethod, setNotificationMethod] = useState("email");
  const [emailFrequency, setEmailFrequency] = useState("immediate");
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // This is a placeholder for actual settings update
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update preferences",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Types */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>Choose which notifications you'd like to receive</CardDescription>
          </div>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="loan-updates">Loan Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about loan approvals, rejections, and status changes
              </p>
            </div>
            <Switch 
              id="loan-updates"
              checked={loanUpdates}
              onCheckedChange={setLoanUpdates}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payment-reminders">Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded when you have upcoming payments due
              </p>
            </div>
            <Switch 
              id="payment-reminders"
              checked={paymentReminders}
              onCheckedChange={setPaymentReminders}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about important security events
              </p>
            </div>
            <Switch 
              id="security-alerts"
              checked={securityAlerts}
              onCheckedChange={setSecurityAlerts}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-updates">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get updates about new features and promotional offers
              </p>
            </div>
            <Switch 
              id="marketing-updates"
              checked={marketingUpdates}
              onCheckedChange={setMarketingUpdates}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Methods */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Notification Methods</CardTitle>
            <CardDescription>Choose how you'd like to receive notifications</CardDescription>
          </div>
          <Mail className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <RadioGroup value={notificationMethod} onValueChange={setNotificationMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="push" id="push" />
              <Label htmlFor="push">Push Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All Methods</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Email Digest Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Email Digest Schedule</CardTitle>
            <CardDescription>Choose how frequently you'd like to receive email updates</CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email-frequency">Frequency</Label>
            <Select value={emailFrequency} onValueChange={setEmailFrequency}>
              <SelectTrigger id="email-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Notification Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
