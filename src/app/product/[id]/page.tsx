'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { useProductStore, useCartStore, useWishlistStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Product() {
  const params = useParams<{ id: string }>();
  const products = useProductStore(state => state.products);
  const product = products.find(p => p.id === params.id);
  const addToCart = useCartStore(state => state.addToCart);
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const isWishlisted = useWishlistStore(state => state.items.includes(params.id));

  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return <Section><p>Product not found.</p></Section>;

  // Use product image for all thumbs (real app would have multiple per product)
  const images = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <Section className="py-12">
      <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24'>
        {/* Left: Vertical Thumbnail Gallery + Main Image */}
        <div className='w-full lg:w-1/2 flex gap-4' style={{ height: '75vh' }}>
          <div className="flex flex-col gap-4 w-20 flex-shrink-0">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-24 rounded-lg bg-blush/20 overflow-hidden border-2 transition-colors relative ${activeImageIndex === idx ? 'border-gold' : 'border-transparent'}`}
              >
                {img && <Image src={img} alt={product.name} fill className="object-cover" sizes="80px" />}
              </button>
            ))}
          </div>
          <div className="flex-1 bg-blush/10 rounded-2xl overflow-hidden relative">
            {images[activeImageIndex] ? (
              <Image
                src={images[activeImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-blush/20" />
            )}
          </div>
        </div>
        
        {/* Right: Details */}
        <div className='w-full lg:w-1/2 flex flex-col pt-4'>
          <h1 className='text-4xl md:text-5xl font-heading mb-4 text-primary'>{product.name}</h1>
          <p className='text-3xl text-gold mb-6 font-medium'>₹{product.price}</p>
          
          <div className='flex items-center gap-2 mb-8 border-b border-blush/30 pb-8'>
            <span className='text-gold tracking-widest text-lg'>★★★★★</span>
            <span className='text-sm text-secondary'>(128 Reviews)</span>
          </div>
          
          <p className='text-secondary mb-8 leading-relaxed text-lg'>{product.description || 'A delicate blend of elegance and charm. Crafted to make every moment special. This piece is designed to be worn alone for a subtle statement or layered for a more dramatic look.'}</p>
          
          <ul className='mb-12 text-primary space-y-3'>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Anti-tarnish finish
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Premium materials
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Skin friendly & hypoallergenic
            </li>
          </ul>
          
          <div className='flex gap-4 mt-auto'>
            <Button className='flex-1 h-14 text-lg' onClick={() => {
              addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
            }}>Add to Cart</Button>
            <Button variant='secondary' onClick={() => toggleWishlist(product.id)} className={`w-14 h-14 p-0 flex items-center justify-center rounded-[14px] ${isWishlisted ? 'bg-gold text-white' : ''}`}>
              ♥
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom: Tabs */}
      <div className='mt-16'>
        <div className="flex gap-12 border-b border-blush/30 mb-12">
          {['description', 'additional', 'reviews'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-heading text-xl transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-secondary hover:text-primary/70'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>
        
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="text-secondary leading-relaxed max-w-3xl">The Veloura Collection embodies the spirit of modern luxury. Each piece is carefully handcrafted by skilled artisans using only the finest materials. This piece features a unique design that catches the light from every angle, making it the perfect accessory for any occasion.</p>
              </motion.div>
            )}
            {activeTab === 'additional' && (
              <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="max-w-2xl bg-white rounded-xl border border-blush/20 p-6">
                  <div className="flex justify-between py-3 border-b border-blush/20"><span className="text-secondary">Weight</span><span className="text-primary font-medium">12g</span></div>
                  <div className="flex justify-between py-3 border-b border-blush/20"><span className="text-secondary">Dimensions</span><span className="text-primary font-medium">40cm chain</span></div>
                  <div className="flex justify-between py-3"><span className="text-secondary">Material</span><span className="text-primary font-medium">18k Gold Plated Brass</span></div>
                </div>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div key="rev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='p-8 bg-white border border-blush/20 rounded-2xl shadow-sm'>
                    <div className='flex justify-between items-center mb-4'>
                      <p className='font-bold text-lg text-primary'>Sarah M.</p>
                      <span className='text-gold'>★★★★★</span>
                    </div>
                    <p className='text-secondary leading-relaxed'>Absolutely beautiful! The quality is amazing and it looks so elegant. I get compliments every time I wear it.</p>
                  </div>
                  <div className='p-8 bg-white border border-blush/20 rounded-2xl shadow-sm'>
                    <div className='flex justify-between items-center mb-4'>
                      <p className='font-bold text-lg text-primary'>Priya K.</p>
                      <span className='text-gold'>★★★★★</span>
                    </div>
                    <p className='text-secondary leading-relaxed'>Bought this for my sister's birthday. The packaging was so premium and the product itself is gorgeous.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
