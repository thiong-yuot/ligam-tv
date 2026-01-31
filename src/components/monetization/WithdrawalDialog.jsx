import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  Wallet, 
  Building2, 
  CreditCard,
  Plus,
  AlertCircle,
  Check
} from "lucide-react";
import { useWithdrawals } from "@/hooks/useWithdrawals";
import { useIdentityVerification } from "@/hooks/useIdentityVerification";

const WithdrawalDialog = ({ open, onOpenChange, availableBalance }) => {
  const { isVerified } = useIdentityVerification();
  const { withdrawalMethods, defaultMethod, requestWithdrawal, isRequesting, addMethod, isAddingMethod } = useWithdrawals();
  
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState(defaultMethod?.id || "");
  const [newMethodType, setNewMethodType] = useState("bank_account");
  const [newMethodDetails, setNewMethodDetails] = useState({});

  const minWithdrawal = 50;
  const fee = Math.max(parseFloat(amount || "0") * 0.02, 1);
  const netAmount = parseFloat(amount || "0") - fee;

  const handleRequestWithdrawal = async () => {
    await requestWithdrawal({
      amount: parseFloat(amount),
      withdrawal_method_id: selectedMethodId,
    });
    onOpenChange(false);
    resetForm();
  };

  const handleAddMethod = async () => {
    await addMethod({
      method_type: newMethodType,
      details: newMethodDetails,
      is_default: withdrawalMethods.length === 0,
    });
    setStep("method");
    setNewMethodDetails({});
  };

  const resetForm = () => {
    setStep("amount");
    setAmount("");
    setSelectedMethodId(defaultMethod?.id || "");
  };

  if (!isVerified) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Identity Verification Required</DialogTitle>
            <DialogDescription>
              You need to verify your identity before you can withdraw funds. This helps us ensure the security of your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg mt-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-foreground">
              Please complete identity verification in the Monetization Requirements section.
            </p>
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full mt-4">
            Got It
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "amount" && "Withdraw Funds"}
            {step === "method" && "Select Payment Method"}
            {step === "add-method" && "Add Payment Method"}
            {step === "confirm" && "Confirm Withdrawal"}
          </DialogTitle>
          <DialogDescription>
            {step === "amount" && `Available balance: $${availableBalance.toFixed(2)}`}
            {step === "method" && "Choose where to receive your funds"}
            {step === "add-method" && "Add a new withdrawal method"}
            {step === "confirm" && "Review and confirm your withdrawal"}
          </DialogDescription>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min={minWithdrawal}
                max={availableBalance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min $${minWithdrawal}`}
              />
            </div>

            {parseFloat(amount) > 0 && (
              <Card className="p-4 bg-secondary/50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Withdrawal amount</span>
                    <span>${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing fee (2%)</span>
                    <span>-${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>You'll receive</span>
                    <span className="text-primary">${netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            )}

            <Button 
              className="w-full" 
              disabled={parseFloat(amount) < minWithdrawal || parseFloat(amount) > availableBalance}
              onClick={() => setStep("method")}
            >
              Continue
            </Button>
          </div>
        )}

        {step === "method" && (
          <div className="space-y-4 mt-4">
            {withdrawalMethods.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No payment methods added yet</p>
                <Button onClick={() => setStep("add-method")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {withdrawalMethods.map((method) => (
                    <Card 
                      key={method.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedMethodId === method.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedMethodId(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        {method.method_type === "bank_account" && <Building2 className="w-5 h-5" />}
                        {method.method_type === "paypal" && <CreditCard className="w-5 h-5" />}
                        {method.method_type === "crypto_wallet" && <Wallet className="w-5 h-5" />}
                        <div className="flex-1">
                          <p className="font-medium">{method.nickname || method.method_type.replace("_", " ")}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.method_type === "bank_account" && `****${method.details.account_number?.slice(-4)}`}
                            {method.method_type === "paypal" && method.details.paypal_email}
                            {method.method_type === "crypto_wallet" && `${method.details.wallet_address?.slice(0, 8)}...`}
                          </p>
                        </div>
                        {selectedMethodId === method.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep("add-method")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Method
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("amount")} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep("confirm")} 
                    className="flex-1"
                    disabled={!selectedMethodId}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {step === "add-method" && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Method Type</Label>
              <Select value={newMethodType} onValueChange={(v) => setNewMethodType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_account">Bank Account</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto_wallet">Crypto Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newMethodType === "bank_account" && (
              <>
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={newMethodDetails.bank_name || ""}
                    onChange={(e) => setNewMethodDetails(prev => ({ ...prev, bank_name: e.target.value }))}
                    placeholder="e.g., Chase Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input
                    value={newMethodDetails.account_holder || ""}
                    onChange={(e) => setNewMethodDetails(prev => ({ ...prev, account_holder: e.target.value }))}
                    placeholder="Name on account"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={newMethodDetails.account_number || ""}
                    onChange={(e) => setNewMethodDetails(prev => ({ ...prev, account_number: e.target.value }))}
                    placeholder="Account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Routing Number</Label>
                  <Input
                    value={newMethodDetails.routing_number || ""}
                    onChange={(e) => setNewMethodDetails(prev => ({ ...prev, routing_number: e.target.value }))}
                    placeholder="9-digit routing number"
                  />
                </div>
              </>
            )}

            {newMethodType === "paypal" && (
              <div className="space-y-2">
                <Label>PayPal Email</Label>
                <Input
                  type="email"
                  value={newMethodDetails.paypal_email || ""}
                  onChange={(e) => setNewMethodDetails(prev => ({ ...prev, paypal_email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            )}

            {newMethodType === "crypto_wallet" && (
              <>
                <div className="space-y-2">
                  <Label>Wallet Type</Label>
                  <Select 
                    value={newMethodDetails.wallet_type || ""} 
                    onValueChange={(v) => setNewMethodDetails(prev => ({ ...prev, wallet_type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                      <SelectItem value="usdt">USDT (TRC20)</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <Input
                    value={newMethodDetails.wallet_address || ""}
                    onChange={(e) => setNewMethodDetails(prev => ({ ...prev, wallet_address: e.target.value }))}
                    placeholder="Your wallet address"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddMethod} className="flex-1" disabled={isAddingMethod}>
                {isAddingMethod ? "Adding..." : "Add Method"}
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 mt-4">
            <Card className="p-4 bg-secondary/50">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span>-${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>You'll receive</span>
                  <span className="text-primary">${netAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Payment method</span>
                  <span>{withdrawalMethods.find(m => m.id === selectedMethodId)?.nickname || "Selected method"}</span>
                </div>
              </div>
            </Card>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Withdrawals are typically processed within 1-3 business days. You'll receive an email confirmation once complete.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleRequestWithdrawal} className="flex-1" disabled={isRequesting}>
                {isRequesting ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
