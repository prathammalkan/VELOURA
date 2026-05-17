'use client';
import { motion } from 'framer-motion';

export default function Section({ className = '', children, title }: any) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`py-16 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto ${className}`}
    >
      {title && <h2 className='text-4xl font-heading text-center mb-12'>{title}</h2>}
      {children}
    </motion.section>
  );
}
