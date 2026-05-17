import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Basic rate limiting (in-memory, per Vercel instance)
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 5;

    const rateData = rateLimit.get(ip) || { count: 0, timestamp: now };
    if (now - rateData.timestamp > windowMs) {
      rateData.count = 1;
      rateData.timestamp = now;
    } else {
      rateData.count++;
      if (rateData.count > maxRequests) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }
    rateLimit.set(ip, rateData);

    // 2. Parse request
    const body = await req.json();
    const { items, shipping, total_amount } = body;

    if (!items || !items.length || !shipping) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3. Auth Check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 4. Server-Side Validation
    // Recalculate total_amount on the server to prevent spoofing
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('price, stock')
        .eq('id', item.product_id)
        .single();
      
      if (error || !product) {
        return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product ${item.product_id}` }, { status: 400 });
      }

      calculatedTotal += product.price * item.quantity;
      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: product.price
      });
    }

    // Ensure total matches
    if (Math.abs(calculatedTotal - total_amount) > 0.01) {
      return NextResponse.json({ error: 'Total amount mismatch' }, { status: 400 });
    }

    // 5. Transactional Order Creation (RPC)
    const { data: orderId, error: rpcError } = await supabase.rpc('create_order_transaction', {
      p_user_id: user.id,
      p_total_amount: calculatedTotal,
      p_items: validatedItems,
      p_shipping: shipping
    });

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      return NextResponse.json({ error: 'Failed to create order. Stock may have changed.' }, { status: 500 });
    }

    // 6. Send Email Notification
    try {
      const { sendOrderConfirmationEmail } = await import('@/lib/email');
      await sendOrderConfirmationEmail(user.email || '', orderId, calculatedTotal);
    } catch (e) {
      console.error('Failed to send email:', e);
    }

    // 7. Return success
    return NextResponse.json({ success: true, order_id: orderId });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
