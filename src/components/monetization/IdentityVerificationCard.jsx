import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Upload,
  AlertCircle
} from "lucide-react";
import { useIdentityVerification } from "@/hooks/useIdentityVerification";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Spain", "Italy", "Netherlands", "Brazil", "Mexico",
  "Japan", "South Korea", "India", "Singapore", "Other"
];

const idTypes = [
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "national_id", label: "National ID Card" },
];

const IdentityVerificationCard = () => {
  const { verification, isVerified, isPending, isRejected, submitVerification, isSubmitting } = useIdentityVerification();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: verification?.full_name || "",
    date_of_birth: verification?.date_of_birth || "",
    country: verification?.country || "",
    address: verification?.address || "",
    id_type: verification?.id_type || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitVerification(formData);
    setOpen(false);
  };

  const getStatusContent = () => {
    if (isVerified) {
      return {
        icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
        title: "Identity Verified",
        description: "Your identity has been verified. You can now withdraw funds.",
        bgClass: "bg-primary/10 border-primary/30",
        action: null,
      };
    }
    
    if (isPending) {
      return {
        icon: <Clock className="w-6 h-6 text-yellow-500" />,
        title: "Verification Pending",
        description: "We're reviewing your documents. This usually takes 1-3 business days.",
        bgClass: "bg-yellow-500/10 border-yellow-500/30",
        action: null,
      };
    }
    
    if (isRejected) {
      return {
        icon: <XCircle className="w-6 h-6 text-destructive" />,
        title: "Verification Rejected",
        description: verification?.rejection_reason || "Please resubmit your documents.",
        bgClass: "bg-destructive/10 border-destructive/30",
        action: (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Resubmit</Button>
            </DialogTrigger>
            <VerificationForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Dialog>
        ),
      };
    }

    return {
      icon: <Shield className="w-6 h-6 text-muted-foreground" />,
      title: "Identity Not Verified",
      description: "Verify your identity to enable withdrawals and unlock all monetization features.",
      bgClass: "bg-secondary border-border",
      action: (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Verify Now</Button>
          </DialogTrigger>
          <VerificationForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Dialog>
      ),
    };
  };

  const status = getStatusContent();

  return (
    <Card className={`p-6 border ${status.bgClass}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0">
          {status.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{status.title}</h3>
            {status.action}
          </div>
          <p className="text-sm text-muted-foreground">{status.description}</p>
        </div>
      </div>
    </Card>
  );
};

const VerificationForm = ({ formData, setFormData, onSubmit, isSubmitting }) => {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Verify Your Identity</DialogTitle>
        <DialogDescription>
          We need to verify your identity to enable withdrawals. Your information is securely encrypted.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Legal Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            placeholder="As shown on your ID"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select 
            value={formData.country} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address (Optional)</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Your residential address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_type">ID Type</Label>
          <Select 
            value={formData.id_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, id_type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {idTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Document Upload Coming Soon</p>
              <p>For now, submit your details and our team will contact you to complete verification.</p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit for Verification"}
        </Button>
      </form>
    </DialogContent>
  );
};

export default IdentityVerificationCard;
