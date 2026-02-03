-- Create freelancer_reviews table for ratings and reviews
CREATE TABLE public.freelancer_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id uuid NOT NULL REFERENCES public.freelancers(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  order_id uuid REFERENCES public.freelancer_orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.freelancer_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reviews are viewable by everyone"
ON public.freelancer_reviews
FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews for completed orders"
ON public.freelancer_reviews
FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
ON public.freelancer_reviews
FOR UPDATE
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews"
ON public.freelancer_reviews
FOR DELETE
USING (auth.uid() = reviewer_id);

-- Create trigger for updated_at
CREATE TRIGGER update_freelancer_reviews_updated_at
BEFORE UPDATE ON public.freelancer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster queries
CREATE INDEX idx_freelancer_reviews_freelancer_id ON public.freelancer_reviews(freelancer_id);
CREATE INDEX idx_freelancer_reviews_reviewer_id ON public.freelancer_reviews(reviewer_id);