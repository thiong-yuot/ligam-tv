
-- Allow clients to update their own freelancer orders (for marking client_completed)
CREATE POLICY "Clients can update own freelancer orders"
ON public.freelancer_orders
FOR UPDATE
USING (auth.uid() = client_id);
