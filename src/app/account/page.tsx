'use client';
import { useAuthStore, useOrderStore } from '@/lib/store';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Account() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const orders = useOrderStore(s => s.orders);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return (
      <Section title='Account'>
        <div className='text-center'>
          <p className='mb-4'>Please login to view your account.</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="flex flex-col md:flex-row gap-8 min-h-[60vh]">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-ivory p-6 rounded-2xl border border-blush/30 sticky top-24">
            <h3 className="font-heading text-xl mb-6 text-primary border-b border-blush/30 pb-4">My Account</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveTab('dashboard')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Dashboard</button>
              <button onClick={() => setActiveTab('orders')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Order History</button>
              <button onClick={() => setActiveTab('wishlist')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'wishlist' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Wishlist</button>
              <button onClick={() => setActiveTab('settings')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Settings</button>
              <button onClick={() => { logout(); router.push('/'); }} className="text-left px-4 py-3 rounded-xl transition-colors text-red-400 hover:bg-red-50 mt-4">Logout</button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full md:w-3/4">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className='font-heading text-3xl mb-6 text-primary'>Welcome, {user.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-blush/30 shadow-sm">
                  <h4 className="text-secondary mb-2">Total Orders</h4>
                  <p className="text-3xl font-heading text-primary">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blush/30 shadow-sm">
                  <h4 className="text-secondary mb-2">Account Status</h4>
                  <p className="text-xl text-primary">Active Member</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Order History</h3>
              {orders.length === 0 ? (
                <p className='text-secondary'>No orders found.</p>
              ) : (
                <div className='flex flex-col gap-4'>
                  {orders.map(o => (
                    <div key={o.id} className='bg-white border border-pink-50 p-6 rounded-[16px] flex justify-between items-center shadow-sm hover:shadow-md transition-shadow'>
                      <div>
                        <p className='font-bold text-lg text-primary'>Order #{o.id}</p>
                        <p className='text-secondary text-sm'>{o.date}</p>
                      </div>
                      <div className="text-right">
                        <p className='font-medium text-lg text-primary'>₹{o.total}</p>
                        <span className='inline-block px-3 py-1 bg-lavender/30 text-primary rounded-full text-xs mt-2'>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Your Wishlist</h3>
              <p className='text-secondary'>Your wishlisted items will appear here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Account Settings</h3>
              <div className="bg-white p-8 rounded-2xl border border-blush/30">
                <p className='mb-4'><span className="text-secondary w-24 inline-block">Name:</span> {user.name}</p>
                <p className='mb-4'><span className="text-secondary w-24 inline-block">Email:</span> {user.email}</p>
                <Button variant="secondary" className="mt-4">Edit Profile</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
