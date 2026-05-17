import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;

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

    // 2. Auth Check
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

    // 3. Parse file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('order_id') as string;

    if (!file || !orderId) {
      return NextResponse.json({ error: 'Missing file or order ID' }, { status: 400 });
    }

    // Ensure order belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
    }

    // 4. Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    
    // We use service role key for uploading to a private bucket if needed, 
    // but the RLS policy allows users to insert into 'payment-proofs' 
    // so anon key with user's JWT is fine.
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 5. Update Order with payment proof URL
    const { data: publicUrlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName); // or get signed URL if private

    await supabase
      .from('orders')
      .update({ payment_proof: fileName })
      .eq('id', orderId);

    return NextResponse.json({ success: true, path: fileName });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
