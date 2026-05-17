'use client';
import { motion } from 'framer-motion';

export default function Button({ variant = 'primary', className = '', children, ...props }: any) {
  const base = 'px-6 py-3 rounded-[14px] shadow-sm font-medium transition-colors';
  const primary = 'bg-gold text-white hover:brightness-110';
  const secondary = 'bg-transparent border border-gold text-gold hover:bg-gold hover:text-white';
  const ghost = 'bg-transparent border border-white text-white hover:bg-white hover:text-primary';
  const style = variant === 'primary' ? primary : variant === 'ghost' ? ghost : secondary;
  return (
    <motion.button 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${base} ${style} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
}
