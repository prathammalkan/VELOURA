'use client';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <Section title='Your Cart'>
        <div className='text-center py-12'>
          <p className='text-secondary mb-8'>Your cart is empty.</p>
          <Link href='/shop'><Button>Continue Shopping</Button></Link>
        </div>
      </Section>
    );
  }

  return (
    <Section title='Your Cart'>
      <div className='flex flex-col md:flex-row gap-12'>
        <div className='w-full md:w-2/3'>
          {items.map(item => (
            <div key={item.id} className='flex items-center gap-6 p-6 bg-white rounded-[16px] shadow-sm mb-4 border border-pink-50'>
              <div className='w-24 h-24 bg-blush/20 rounded-[12px]'></div>
              <div className='flex-grow'>
                <h3 className='font-heading text-lg'>{item.name}</h3>
                <p className='text-secondary mb-2'>&#8377;{item.price}</p>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center border border-gray-200 rounded-[8px]'>
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className='px-3 py-1 text-secondary hover:text-primary'>-</button>
                    <span className='w-8 text-center'>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='px-3 py-1 text-secondary hover:text-primary'>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className='text-red-400 text-sm hover:underline'>Remove</button>
                </div>
              </div>
              <div className='font-medium text-lg'>&#8377;{item.price * item.quantity}</div>
            </div>
          ))}
          <Link href='/shop' className='inline-block mt-2'>
            <Button variant='secondary'>&larr; Continue Shopping</Button>
          </Link>
        </div>
        <div className='w-full md:w-1/3 relative'>
          <div className='bg-ivory p-8 rounded-[16px] border border-pink-100 sticky top-24'>
            <h3 className='font-heading text-xl mb-6'>Order Summary</h3>
            <div className='flex justify-between mb-4 text-secondary'><span>Subtotal</span><span>&#8377;{subtotal}</span></div>
            <div className='flex justify-between mb-6 text-secondary'><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className='flex justify-between mb-8 font-heading text-2xl pt-4 border-t border-gray-200'><span>Total</span><span>&#8377;{subtotal}</span></div>
            <Link href='/checkout'><Button className='w-full'>Proceed to Checkout</Button></Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
