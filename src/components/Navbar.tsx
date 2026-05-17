'use client';
import Link from 'next/link';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const user = useAuthStore(s => s.user);
  const initialize = useAuthStore(s => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <nav className='flex justify-between items-center px-8 py-4 sticky top-0 bg-ivory z-50 border-b border-pink-100'>
      <Link href='/' className='font-heading text-2xl font-bold tracking-wide'>VELOURA</Link>
      <div className='flex gap-8 items-center text-sm font-medium'>
        <Link href='/shop' className='hover:text-gold transition-colors'>Shop</Link>
        <Link href='/help' className='hover:text-gold transition-colors'>Help</Link>
        <Link href='/cart' className='relative hover:text-gold transition-colors'>
          Cart
          {cartCount > 0 && (
            <span className='absolute -top-2 -right-4 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>{cartCount}</span>
          )}
        </Link>
        <Link href={user ? '/account' : '/login'} className='hover:text-gold transition-colors'>
          {user ? user.name?.split(' ')[0] || 'Account' : 'Login'}
        </Link>
      </div>
    </nav>
  );
}
