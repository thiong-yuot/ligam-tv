-- Create identity verification status enum
CREATE TYPE public.verification_status AS ENUM ('pending', 'submitted', 'approved', 'rejected');

-- Create withdrawal status enum
CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'rejected');

-- Identity verification table for KYC
CREATE TABLE public.identity_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    country TEXT NOT NULL,
    address TEXT,
    id_type TEXT NOT NULL, -- passport, drivers_license, national_id
    id_document_url TEXT,
    selfie_url TEXT,
    status verification_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Withdrawal methods (bank accounts, wallets)
CREATE TABLE public.withdrawal_methods (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    method_type TEXT NOT NULL, -- bank_account, paypal, crypto_wallet
    is_default BOOLEAN DEFAULT false,
    details JSONB NOT NULL, -- Stores encrypted bank details, wallet address, etc.
    nickname TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Withdrawal requests
CREATE TABLE public.withdrawals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    withdrawal_method_id UUID REFERENCES public.withdrawal_methods(id),
    amount NUMERIC NOT NULL,
    fee NUMERIC DEFAULT 0,
    net_amount NUMERIC NOT NULL,
    status withdrawal_status NOT NULL DEFAULT 'pending',
    transaction_id TEXT,
    notes TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliate program table
CREATE TABLE public.affiliates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL UNIQUE,
    total_referrals INTEGER DEFAULT 0,
    total_earnings NUMERIC DEFAULT 0,
    pending_earnings NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Referral tracking table
CREATE TABLE public.referrals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    status TEXT NOT NULL DEFAULT 'pending', -- pending, converted, expired
    commission_rate NUMERIC NOT NULL DEFAULT 0.30, -- 30% first 2 months
    total_commission_earned NUMERIC DEFAULT 0,
    months_active INTEGER DEFAULT 0,
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(referred_user_id)
);

-- Affiliate earnings/commissions
CREATE TABLE public.affiliate_earnings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    commission_rate NUMERIC NOT NULL,
    subscription_month INTEGER NOT NULL, -- Which month of subscription this is for
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for identity_verifications
CREATE POLICY "Users can view own verification"
ON public.identity_verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can submit verification"
ON public.identity_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update pending verification"
ON public.identity_verifications FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all verifications"
ON public.identity_verifications FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for withdrawal_methods
CREATE POLICY "Users can view own withdrawal methods"
ON public.withdrawal_methods FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own withdrawal methods"
ON public.withdrawal_methods FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for withdrawals
CREATE POLICY "Users can view own withdrawals"
ON public.withdrawals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can request withdrawals"
ON public.withdrawals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all withdrawals"
ON public.withdrawals FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for affiliates
CREATE POLICY "Users can view own affiliate profile"
ON public.affiliates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own affiliate profile"
ON public.affiliates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate profile"
ON public.affiliates FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Affiliates can view own referrals"
ON public.referrals FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = referrals.affiliate_id 
    AND affiliates.user_id = auth.uid()
));

-- RLS Policies for affiliate_earnings
CREATE POLICY "Affiliates can view own earnings"
ON public.affiliate_earnings FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_earnings.affiliate_id 
    AND affiliates.user_id = auth.uid()
));

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_count INTEGER;
BEGIN
    LOOP
        code := upper(substring(md5(random()::text) from 1 for 8));
        SELECT COUNT(*) INTO exists_count FROM public.affiliates WHERE referral_code = code;
        EXIT WHEN exists_count = 0;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is verified for withdrawal
CREATE OR REPLACE FUNCTION public.is_verified_for_withdrawal(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.identity_verifications
        WHERE user_id = user_uuid AND status = 'approved'
    );
$$;

-- Trigger to update affiliate stats
CREATE OR REPLACE FUNCTION public.update_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.affiliates 
        SET total_referrals = total_referrals + 1,
            updated_at = now()
        WHERE id = NEW.affiliate_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_referral_created
AFTER INSERT ON public.referrals
FOR EACH ROW EXECUTE FUNCTION public.update_affiliate_stats();