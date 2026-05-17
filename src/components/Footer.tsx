import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-primary text-ivory px-8 py-16 mt-0'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12'>
        {/* Brand */}
        <div>
          <div className='font-heading text-3xl mb-4 text-ivory'>VELOURA</div>
          <p className='text-ivory/60 text-sm leading-relaxed mb-6'>Timeless jewelry for every woman. Crafted with love, designed for life.</p>
          <div className='flex gap-4'>
            <a href="#" className='w-9 h-9 bg-ivory/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors text-sm'>f</a>
            <a href="#" className='w-9 h-9 bg-ivory/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors text-sm'>in</a>
            <a href="#" className='w-9 h-9 bg-ivory/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors text-sm'>@</a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className='font-heading text-lg mb-6 text-ivory'>Shop</h4>
          <ul className='flex flex-col gap-3 text-ivory/60 text-sm'>
            <li><Link href='/shop' className='hover:text-gold transition-colors'>All Products</Link></li>
            <li><Link href='/shop' className='hover:text-gold transition-colors'>Necklaces</Link></li>
            <li><Link href='/shop' className='hover:text-gold transition-colors'>Earrings</Link></li>
            <li><Link href='/shop' className='hover:text-gold transition-colors'>Bracelets</Link></li>
            <li><Link href='/shop' className='hover:text-gold transition-colors'>Rings</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className='font-heading text-lg mb-6 text-ivory'>Help</h4>
          <ul className='flex flex-col gap-3 text-ivory/60 text-sm'>
            <li><Link href='/help' className='hover:text-gold transition-colors'>Shipping</Link></li>
            <li><Link href='/help' className='hover:text-gold transition-colors'>Returns</Link></li>
            <li><Link href='/help' className='hover:text-gold transition-colors'>Contact Us</Link></li>
            <li><Link href='/help' className='hover:text-gold transition-colors'>About Us</Link></li>
            <li><Link href='/help' className='hover:text-gold transition-colors'>Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className='font-heading text-lg mb-6 text-ivory'>Contact</h4>
          <ul className='flex flex-col gap-3 text-ivory/60 text-sm'>
            <li>support@veloura.com</li>
            <li>+91 98765-43210</li>
            <li className='mt-2'>Mon – Sat, 9am – 7pm IST</li>
          </ul>
        </div>
      </div>

      <div className='max-w-7xl mx-auto mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4 text-ivory/40 text-xs'>
        <p>&copy; {new Date().getFullYear()} Veloura Luxury. All rights reserved.</p>
        <p>Handcrafted jewelry for every occasion.</p>
      </div>
    </footer>
  );
}
