'use client';
import { useState } from 'react';
import Section from '@/components/ui/Section';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCartStore, useAuthStore, useOrderStore } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const GPAY_QR_URL = 'https://zyjqhivvmiowuzefvqpx.supabase.co/storage/v1/object/public/assets/gpay-qr.png';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [orderId, setOrderId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { items, clearCart } = useCartStore();
  const user = useAuthStore(s => s.user);
  const session = useAuthStore(s => s.session);
  const createOrder = useOrderStore(s => s.createOrder);
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCreateOrder = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
          shipping: details,
          total_amount: total
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      const oid = data.order_id;
      setOrderId(oid);

      // Upload payment screenshot if provided
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order_id', oid);
        await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session?.access_token || ''}` },
          body: formData
        });
      }

      createOrder({ id: oid, total, status: 'Pending Verification', date: new Date().toLocaleDateString(), items });
      clearCart();
      setStep(3);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Fallback for mock mode (no Supabase keys)
  const handleMockOrder = () => {
    const id = 'VL' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
    createOrder({ id, total, status: 'Pending Verification', date: new Date().toLocaleDateString(), items });
    clearCart();
    setStep(3);
  };

  if (items.length === 0 && step === 1) {
    return (
      <Section className="py-16">
        <div className="text-center">
          <p className='text-secondary mb-8'>Your cart is empty.</p>
          <Link href='/shop'><Button>Continue Shopping</Button></Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      {step === 1 && (
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Left: Form */}
          <div className='w-full lg:w-1/2'>
            <h2 className='font-heading text-3xl mb-8 text-primary'>Shipping Details</h2>
            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
            <Input placeholder='Full Name' value={details.name} onChange={(e:any) => setDetails({...details, name: e.target.value})} className='mb-4' />
            <Input placeholder='Phone Number' value={details.phone} onChange={(e:any) => setDetails({...details, phone: e.target.value})} className='mb-4' />
            <Input placeholder='Full Address' value={details.address} onChange={(e:any) => setDetails({...details, address: e.target.value})} className='mb-4' />
            <div className="flex gap-4 mb-6">
              <Input placeholder='City' value={details.city} onChange={(e:any) => setDetails({...details, city: e.target.value})} className="flex-1" />
              <Input placeholder='Pincode' value={details.pincode} onChange={(e:any) => setDetails({...details, pincode: e.target.value})} className="w-40" />
            </div>
            <Button className='w-full h-14 text-lg' onClick={() => {
              if (!details.name || !details.phone || !details.address || !details.city || !details.pincode) {
                setError('Please fill in all shipping details.');
                return;
              }
              setError('');
              setStep(2);
            }}>Continue to Payment</Button>
          </div>
          
          {/* Right: Order Summary */}
          <div className='w-full lg:w-1/2'>
            <div className="bg-ivory p-8 rounded-2xl border border-blush/30 sticky top-24">
              <h3 className='font-heading text-2xl mb-6 text-primary'>Order Summary</h3>
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-blush/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blush/20 rounded-lg"></div>
                    <div>
                      <p className="text-primary font-medium">{item.name}</p>
                      <p className="text-secondary text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-primary">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className='flex justify-between mt-6 pt-4 border-t border-blush/30 font-heading text-2xl'>
                <span>Total</span><span className="text-gold">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Left: QR + Upload */}
          <div className='w-full lg:w-1/2'>
            <h2 className='font-heading text-3xl mb-8 text-primary'>Scan & Pay</h2>
            <p className='text-secondary mb-6 text-lg'>Total: <span className="text-gold font-heading text-2xl">₹{total}</span></p>
            <div className='relative mx-auto lg:mx-0 mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-blush/30' style={{width: 224, height: 224}}>
              <Image src={GPAY_QR_URL} alt='GPay QR Code' fill className='object-cover' unoptimized />
            </div>
            <p className='text-center lg:text-left text-secondary text-sm mb-6'>UPI: <span className='font-medium text-primary'>7977036308@fam</span></p>
            <div className='border-2 border-dashed border-blush/40 rounded-2xl p-8 mb-8 bg-white'>
              <p className='text-primary font-medium mb-4'>Upload Payment Screenshot</p>
              <input type='file' accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className='block text-sm text-secondary' />
              {file && <p className="text-gold text-sm mt-2">✓ {file.name}</p>}
            </div>
            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
            <Button className='w-full h-14 text-lg' onClick={session ? handleCreateOrder : handleMockOrder} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Order'}
            </Button>
          </div>
          
          {/* Right: Summary */}
          <div className='w-full lg:w-1/2'>
            <div className="bg-ivory p-8 rounded-2xl border border-blush/30 sticky top-24">
              <h3 className='font-heading text-xl mb-4'>Shipping To</h3>
              <p className="text-primary font-medium">{details.name}</p>
              <p className="text-secondary text-sm">{details.phone}</p>
              <p className="text-secondary text-sm mb-6">{details.address}, {details.city} - {details.pincode}</p>
              <div className='flex justify-between font-heading text-2xl border-t border-blush/30 pt-4'>
                <span>Total</span><span className="text-gold">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-xl mx-auto text-center bg-white p-12 rounded-2xl border border-blush/30 shadow-sm'
        >
          <div className='w-20 h-20 bg-gold text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-8'>✓</div>
          <h3 className='font-heading text-3xl mb-3 text-primary'>Thank You!</h3>
          <p className='text-secondary mb-8'>Your order has been placed successfully.</p>
          <p className='font-heading text-xl mb-8 bg-ivory p-4 rounded-xl inline-block'>Order ID: <span className="text-gold">{orderId}</span></p>
          <div className="flex flex-col gap-3">
            <a href={`https://wa.me/917977036308?text=Hello%2C%20I%20have%20placed%20order%20${orderId}%20for%20%E2%82%B9${total}.%20Please%20verify%20my%20payment.`} target='_blank' rel='noreferrer'>
              <Button className='w-full bg-green-500 hover:bg-green-600 border-none !text-white'>Share on WhatsApp</Button>
            </a>
            <Link href='/account'><Button variant='secondary' className='w-full'>View Order</Button></Link>
          </div>
        </motion.div>
      )}
    </Section>
  );
}
