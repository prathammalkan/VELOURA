CREATE OR REPLACE FUNCTION create_order_transaction(
  p_user_id UUID,
  p_total_amount NUMERIC,
  p_items JSONB, -- Array of { product_id, quantity, price_at_time }
  p_shipping JSONB -- { name, phone, address, city, pincode }
) RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_stock INTEGER;
  v_product_name TEXT;
  v_product_image TEXT;
  v_order_id_string TEXT;
BEGIN
  -- Generate Collision-Safe Order ID (UUID for primary key is already safe, but we can generate a friendly one if needed. Here we just use UUID)
  
  -- Create order
  INSERT INTO public.orders (user_id, total_amount, status)
  VALUES (p_user_id, p_total_amount, 'pending_verification')
  RETURNING id INTO v_order_id;
  
  -- Process items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Lock product row
    SELECT stock, name INTO v_stock, v_product_name
    FROM public.products
    WHERE id = (v_item->>'product_id')::UUID
    FOR UPDATE;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found', v_item->>'product_id';
    END IF;
    
    IF v_stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Insufficient stock for %', v_product_name;
    END IF;
    
    -- Get first image
    SELECT image_url INTO v_product_image
    FROM public.product_images
    WHERE product_id = (v_item->>'product_id')::UUID
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- Update stock
    UPDATE public.products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = (v_item->>'product_id')::UUID;
    
    -- Insert order item
    INSERT INTO public.order_items (order_id, product_id, quantity, price_at_time)
    VALUES (
      v_order_id, 
      (v_item->>'product_id')::UUID, 
      (v_item->>'quantity')::INTEGER, 
      (v_item->>'price_at_time')::NUMERIC
    );
  END LOOP;
  
  -- Insert shipping details
  INSERT INTO public.shipping_details (order_id, name, phone, address, city, pincode)
  VALUES (
    v_order_id,
    p_shipping->>'name',
    p_shipping->>'phone',
    p_shipping->>'address',
    p_shipping->>'city',
    p_shipping->>'pincode'
  );
  
  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
