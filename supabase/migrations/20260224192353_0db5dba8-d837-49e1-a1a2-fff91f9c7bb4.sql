
-- Allow sellers to view orders for their products
CREATE POLICY "Sellers can view orders for their products"
ON public.orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = orders.product_id
    AND products.seller_id = auth.uid()
  )
);

-- Allow sellers to update orders for their products (add tracking number, update status)
CREATE POLICY "Sellers can update orders for their products"
ON public.orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = orders.product_id
    AND products.seller_id = auth.uid()
  )
);
