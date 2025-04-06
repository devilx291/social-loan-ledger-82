
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Wallet, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type UPIOption = {
  id: string;
  name: string;
  logo: string;
};

const upiOptions: UPIOption[] = [
  { id: "gpay", name: "Google Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_icon.svg" },
  { id: "phonepe", name: "PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" },
  { id: "paytm", name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" }
];

export const BalanceTab = () => {
  const [balance, setBalance] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isUpiSelectorOpen, setIsUpiSelectorOpen] = useState(false);
  const [selectedUpiOption, setSelectedUpiOption] = useState<UPIOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddCurrency = () => {
    setIsDialogOpen(true);
  };

  const handleSelectUpi = (option: UPIOption) => {
    setSelectedUpiOption(option);
    setIsUpiSelectorOpen(false);
  };

  const handleProceedToPayment = () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add",
        variant: "destructive"
      });
      return;
    }

    setIsUpiSelectorOpen(true);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const newAmount = Number(amount);
      setBalance(prevBalance => prevBalance + newAmount);
      setIsProcessing(false);
      setIsDialogOpen(false);
      setIsUpiSelectorOpen(false);
      setSelectedUpiOption(null);
      setAmount("");
      
      toast({
        title: "Payment successful",
        description: `₹${newAmount} has been added to your balance`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Your Balance
          </CardTitle>
          <CardDescription>
            Your current balance in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-primary">₹{balance.toFixed(2)}</span>
            {user && <span className="text-sm text-muted-foreground">Available to use</span>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddCurrency} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Add Currency
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent currency transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {balance > 0 ? (
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Added funds</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <p className="text-green-600 font-medium">+₹{balance.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Currency Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Currency</DialogTitle>
            <DialogDescription>
              Add currency to your account using UPI payment
            </DialogDescription>
          </DialogHeader>
          
          {!isUpiSelectorOpen ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleProceedToPayment} 
                className="w-full"
                disabled={!amount || Number(amount) <= 0}
              >
                Proceed to Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">₹{Number(amount).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Amount to be paid</div>
              </div>
              
              {selectedUpiOption ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <img src={selectedUpiOption.logo} alt={selectedUpiOption.name} className="h-8 w-8 object-contain" />
                      <span>{selectedUpiOption.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedUpiOption(null)}>
                      Change
                    </Button>
                  </div>

                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground mb-2">UPI ID</p>
                    <p className="font-mono bg-muted p-2 rounded text-sm">user@socialloan</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      (This is a fake UPI ID for demonstration purposes)
                    </p>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleCompletePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Processing...
                      </>
                    ) : (
                      "Complete Payment"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Select a UPI option</div>
                  {upiOptions.map((option) => (
                    <button
                      key={option.id}
                      className="flex items-center justify-between w-full p-3 border rounded-md hover:bg-muted transition-colors"
                      onClick={() => handleSelectUpi(option)}
                    >
                      <div className="flex items-center gap-3">
                        <img src={option.logo} alt={option.name} className="h-8 w-8 object-contain" />
                        <span>{option.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
