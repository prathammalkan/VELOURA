'use client';
import { useState } from 'react';
import Section from '@/components/ui/Section';
import ProductCard from '@/components/ui/ProductCard';
import Input from '@/components/ui/Input';
import { useProductStore } from '@/lib/store';

export default function Shop() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Necklaces', 'Earrings', 'Bracelets', 'Rings'];

  const products = useProductStore(s => s.products);
  const filtered = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Section title='Shop Our Collection'>
      <div className='flex flex-col md:flex-row gap-8 mb-12'>
        <div className='w-full md:w-1/4'>
          <Input placeholder='Search products...' value={search} onChange={(e: any) => setSearch(e.target.value)} className='mb-8' />
          <h3 className='font-heading text-xl mb-4'>Categories</h3>
          <div className='flex flex-col gap-2'>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`text-left px-4 py-2 rounded-[12px] transition-colors ${category === c ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className='w-full md:w-3/4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
            {filtered.map(p => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} />
            ))}
          </div>
          {filtered.length === 0 && <p className='text-secondary text-center py-12'>No products found.</p>}
        </div>
      </div>
    </Section>
  );
}
