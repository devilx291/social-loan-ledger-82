
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, MessageSquare, Mail, PhoneCall, Clock, Smartphone, Loader2 } from "lucide-react";

export const NotificationsTab = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification preferences
  const [loanRequestNotification, setLoanRequestNotification] = useState(true);
  const [loanApprovalNotification, setLoanApprovalNotification] = useState(true);
  const [repaymentNotification, setRepaymentNotification] = useState(true);
  const [trustScoreNotification, setTrustScoreNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);
  
  // Notification methods
  const [notificationMethod, setNotificationMethod] = useState("push");
  
  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive and how you receive them
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Communication Preferences</h3>
            
            <div className="space-y-4 divide-y">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label className="font-medium">Loan Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when someone requests a loan from you
                  </p>
                </div>
                <Switch
                  checked={loanRequestNotification}
                  onCheckedChange={setLoanRequestNotification}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label className="font-medium">Loan Approvals</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when your loan request is approved
                  </p>
                </div>
                <Switch
                  checked={loanApprovalNotification}
                  onCheckedChange={setLoanApprovalNotification}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label className="font-medium">Repayment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded when loan repayments are due
                  </p>
                </div>
                <Switch
                  checked={repaymentNotification}
                  onCheckedChange={setRepaymentNotification}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label className="font-medium">Trust Score Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about changes to your trust score
                  </p>
                </div>
                <Switch
                  checked={trustScoreNotification}
                  onCheckedChange={setTrustScoreNotification}
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label className="font-medium">Marketing & Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    News, tips, and product updates from TrustFund
                  </p>
                </div>
                <Switch
                  checked={marketingNotification}
                  onCheckedChange={setMarketingNotification}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Notification Methods</h3>
            <p className="text-sm text-muted-foreground">
              Choose how you would like to receive notifications
            </p>
            
            <RadioGroup value={notificationMethod} onValueChange={setNotificationMethod} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="push" id="push" />
                <Label htmlFor="push" className="flex items-center cursor-pointer">
                  <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Push Notifications</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center cursor-pointer">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Email</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>SMS</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="call" id="call" disabled />
                <Label htmlFor="call" className="flex items-center cursor-pointer text-muted-foreground">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  <span>Phone Call (Coming Soon)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Notification Schedule</h3>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <h4 className="font-medium">Quiet Hours</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We won't send notifications during your quiet hours, except for critical security alerts
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start" className="text-sm">Starts at</Label>
                  <select 
                    id="quiet-start" 
                    className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    defaultValue="22:00"
                  >
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                    <option value="23:00">11:00 PM</option>
                    <option value="00:00">12:00 AM</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="quiet-end" className="text-sm">Ends at</Label>
                  <select 
                    id="quiet-end" 
                    className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    defaultValue="07:00"
                  >
                    <option value="05:00">5:00 AM</option>
                    <option value="06:00">6:00 AM</option>
                    <option value="07:00">7:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={handleSavePreferences} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
