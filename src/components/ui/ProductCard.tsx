'use client';
import Button from './Button';
import { useCartStore, useWishlistStore } from '@/lib/store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductCard({ id, name, price, image = '' }: any) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.items.includes(id));

  return (
    <motion.div 
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className='bg-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group'
    >
      <Link href={`/product/${id}`} className='aspect-[4/5] bg-blush/20 relative overflow-hidden block'>
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          />
        ) : (
          <div className='absolute inset-0 bg-blush/30' />
        )}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm'>
          <Button variant='secondary' className='bg-white pointer-events-none'>View Details</Button>
        </div>
      </Link>
      <div className='p-4 flex-grow flex flex-col'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-heading text-lg'>{name}</h3>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleWishlist(id)} 
            className={`text-xl ${isWishlisted ? 'text-pink-500' : 'text-gray-300'}`}
          >
            ♥
          </motion.button>
        </div>
        <p className='text-secondary mb-4'>₹{price}</p>
        <Button className='mt-auto w-full' onClick={() => addToCart({ id, name, price, quantity: 1 })}>Add to Cart</Button>
      </div>
    </motion.div>
  );
}
