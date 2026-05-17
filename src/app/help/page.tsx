'use client';
import Section from '@/components/ui/Section';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express shipping (2–3 days) is available at checkout.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day easy return policy. Items must be in original, unworn condition with tags intact.' },
  { q: 'How do I track my order?', a: 'Once shipped, you will receive a tracking link via WhatsApp and email with your order confirmation.' },
  { q: 'Are your products genuine?', a: 'Absolutely. All Veloura jewellery is 100% authentic and crafted from premium, skin-safe materials.' },
  { q: 'How do I pay for my order?', a: 'We accept UPI / GPay payments. Scan the QR at checkout and upload your payment screenshot to confirm.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placement. Contact us via WhatsApp for quick resolution.' },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <Section className="py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl mb-4 text-primary">Help &amp; Support</h1>
          <p className="text-secondary max-w-xl mx-auto">We&apos;re here to help. Find answers to common questions below, or reach out to us directly.</p>
        </div>

        {/* Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: '🚚', title: 'Shipping', desc: 'Free shipping on orders above ₹999. Delivers in 5–7 days.' },
            { icon: '↩️', title: 'Returns', desc: '7-day hassle-free returns on all products.' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Chat with us directly for fastest resolution.' },
          ].map((card, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="bg-white border border-blush/30 rounded-2xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="font-heading text-xl mb-2 text-primary">{card.title}</h3>
              <p className="text-secondary text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl mb-10 text-primary text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-blush/20 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-8 py-5 flex justify-between items-center font-medium text-primary hover:text-gold transition-colors"
                >
                  {faq.q}
                  <span className={`text-gold transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-8 pb-6 text-secondary leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-primary rounded-3xl p-12 text-ivory">
          <h3 className="font-heading text-3xl mb-4">Still need help?</h3>
          <p className="text-ivory/80 mb-8">Our support team is available 9am–7pm, Mon–Sat.</p>
          <a
            href="https://wa.me/1234567890?text=Hi%20Veloura%20team%2C%20I%20need%20help%20with%20my%20order."
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-4 rounded-[12px] transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </Section>
    </div>
  );
}
