'use client';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import Section from '@/components/ui/Section';
import { products } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const featured = products.slice(0, 4);
  const bestSellers = products.slice(2, 6);

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <section className="min-h-[85vh] flex items-center justify-center px-8 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=85"
          alt="Veloura luxury jewellery hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl z-10"
        >
          <h1 className="text-5xl md:text-7xl font-heading mb-6 leading-tight text-ivory drop-shadow-lg">Luxury That Feels Expensive. Isn&apos;t.</h1>
          <p className="text-lg md:text-xl text-ivory/90 mb-10 font-body drop-shadow">A luxurious e-commerce experience designed to make every woman feel elegant and confident.</p>
          <div className="flex justify-center gap-4">
            <Link href="/shop"><Button variant="primary">Shop Now</Button></Link>
            <Link href="/shop"><Button variant="primary">View Collections</Button></Link>
          </div>
        </motion.div>
      </section>

      {/* 2. Trust Badges */}
      <div className="bg-white py-12 border-b border-blush/30">
        <div className="container mx-auto px-4 flex flex-wrap justify-around items-center gap-8 opacity-70">
          <span className="font-heading text-xl text-gold">100% Authentic</span>
          <span className="font-heading text-xl text-gold">Free Shipping</span>
          <span className="font-heading text-xl text-gold">Lifetime Warranty</span>
          <span className="font-heading text-xl text-gold">Secure Checkout</span>
        </div>
      </div>
      
      {/* 3. Featured Grid */}
      <Section title="Featured Collection" className="bg-ivory pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featured.map(p => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/shop"><Button variant="secondary">View All Featured</Button></Link>
        </div>
      </Section>

      {/* 4. Banner */}
      <section className="py-24 bg-gradient-to-r from-lavender/40 to-blush/40 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading mb-6">The Pastel Collection</h2>
          <p className="text-secondary mb-8">Soft hues and delicate designs perfect for any occasion.</p>
          <Link href="/shop"><Button variant="primary">Explore Pastel</Button></Link>
        </div>
      </section>

      {/* 5. Best Sellers */}
      <Section title="Best Sellers" className="bg-ivory py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {bestSellers.map(p => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/shop"><Button variant="secondary">View All Best Sellers</Button></Link>
        </div>
      </Section>

      {/* 6. Testimonials */}
      <Section className="bg-white text-center py-24 border-t border-blush/30">
        <h2 className="text-4xl font-heading mb-16 text-primary">Loved By Thousands</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: 'Priya Sharma', text: 'Absolutely stunning jewelry. The quality is unmatched and it looks so elegant on me.' },
            { name: 'Ananya Mehta', text: 'I ordered the necklace for my mom\'s birthday — she was absolutely in love. Packaging was so premium!' },
            { name: 'Shreya Gupta', text: 'My go-to for every occasion. Veloura never disappoints — gorgeous designs at the best price.' },
          ].map((review, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-ivory p-8 rounded-[16px] shadow-sm">
              <div className="text-gold text-2xl mb-4">★★★★★</div>
              <p className="text-secondary italic mb-6">&quot;{review.text}&quot;</p>
              <h4 className="font-heading font-semibold">— {review.name}</h4>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 7. CTA */}
      <section className="py-32 bg-primary text-ivory text-center px-4">
        <h2 className="text-4xl md:text-5xl font-heading mb-6">Ready to Shine?</h2>
        <p className="text-ivory/80 mb-10 max-w-xl mx-auto">Join our newsletter to receive exclusive offers and be the first to know about new collections.</p>
        <div className="flex max-w-md mx-auto gap-2">
          <input type="email" placeholder="Your email address" className="flex-1 bg-white/10 border border-ivory/20 rounded-[12px] px-4 py-3 text-ivory placeholder-ivory/50 focus:outline-none focus:border-gold" suppressHydrationWarning />
          <Button variant="primary">Subscribe</Button>
        </div>
      </section>
    </div>
  );
}
