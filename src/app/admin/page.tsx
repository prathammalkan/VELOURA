'use client';
import { useState } from 'react';
import Section from '@/components/ui/Section';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useOrderStore, useProductStore } from '@/lib/store';
import Image from 'next/image';

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';

export default function Admin() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin state
  const [activeTab, setActiveTab] = useState('dashboard');
  const { orders, updateOrderStatus } = useOrderStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();

  // New product form
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image: '' });

  // Edit product state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', description: '', image: '' });

  // Page images state
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=85');
  const [bannerSaved, setBannerSaved] = useState(false);

  const handleLogin = () => {
    setLoginError('');
    if (loginId === ADMIN_ID && loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid Admin ID or Password.');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    addProduct({
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'Uncategorized',
      description: newProduct.description || '',
      image: newProduct.image || ''
    });
    setNewProduct({ name: '', price: '', category: '', description: '', image: '' });
  };

  const handleStartEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: String(product.price),
      category: product.category || '',
      description: product.description || '',
      image: product.image || ''
    });
  };

  const handleSaveEdit = (id: string) => {
    updateProduct(id, {
      name: editForm.name,
      price: Number(editForm.price),
      category: editForm.category,
      description: editForm.description,
      image: editForm.image
    });
    setEditingId(null);
  };

  // ─── Login Screen ───
  if (!isAuthenticated) {
    return (
      <Section className="py-16">
        <div className='max-w-md mx-auto bg-white p-10 rounded-2xl border border-blush/30 shadow-sm'>
          <h2 className="font-heading text-3xl mb-2 text-center text-primary">Admin Login</h2>
          <p className="text-center text-secondary text-sm mb-8">Authorized personnel only</p>

          {loginError && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-xl">{loginError}</p>}

          <Input
            placeholder='Admin ID'
            value={loginId}
            onChange={(e: any) => setLoginId(e.target.value)}
            className='mb-4'
          />
          <Input
            placeholder='Password'
            type='password'
            value={loginPassword}
            onChange={(e: any) => setLoginPassword(e.target.value)}
            className='mb-6'
          />
          <Button className='w-full' onClick={handleLogin}>Login</Button>
        </div>
      </Section>
    );
  }

  // ─── Admin Dashboard ───
  return (
    <Section className="py-12">
      <div className="flex flex-col md:flex-row gap-8 min-h-[60vh]">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-ivory p-6 rounded-2xl border border-blush/30 sticky top-24">
            <h3 className="font-heading text-xl mb-6 text-primary border-b border-blush/30 pb-4">Admin Panel</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveTab('dashboard')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Overview</button>
              <button onClick={() => setActiveTab('orders')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Manage Orders</button>
              <button onClick={() => setActiveTab('products')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Inventory</button>
              <button onClick={() => setActiveTab('pages')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'pages' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Page Images</button>
              <button onClick={() => setActiveTab('customers')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'customers' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Customers</button>
              <button onClick={() => setActiveTab('settings')} className={`text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-gold text-white' : 'hover:bg-blush/20 text-secondary'}`}>Settings</button>
              <button onClick={() => setIsAuthenticated(false)} className="text-left px-4 py-3 rounded-xl transition-colors text-red-400 hover:bg-red-50 mt-4">Logout</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-3/4">
          {/* ─── Dashboard Overview ─── */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className='font-heading text-3xl mb-6 text-primary'>Admin Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-blush/30 shadow-sm">
                  <h4 className="text-secondary mb-2">Total Revenue</h4>
                  <p className="text-3xl font-heading text-primary">₹{orders.reduce((a, o) => a + (o.total || 0), 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blush/30 shadow-sm">
                  <h4 className="text-secondary mb-2">Pending Orders</h4>
                  <p className="text-3xl font-heading text-primary">{orders.filter(o => o.status === 'Pending Verification').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blush/30 shadow-sm">
                  <h4 className="text-secondary mb-2">Total Products</h4>
                  <p className="text-3xl font-heading text-primary">{products.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Manage Orders ─── */}
          {activeTab === 'orders' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Manage Orders</h3>
              {orders.length === 0 ? <p className='text-secondary'>No orders yet.</p> : (
                <div className='flex flex-col gap-4'>
                  {orders.map(o => (
                    <div key={o.id} className='bg-white border border-pink-50 p-6 rounded-[16px] flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4 hover:shadow-md transition-shadow'>
                      <div>
                        <p className='font-bold text-lg text-primary'>Order #{o.id}</p>
                        <p className='text-secondary text-sm'>{o.date} | ₹{o.total}</p>
                        <p className='text-xs mt-2 text-gold font-medium cursor-pointer hover:underline'>View Payment Screenshot</p>
                      </div>
                      <div className='flex items-center gap-4'>
                        <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className='bg-ivory border border-pink-100 rounded-[8px] px-3 py-2 text-sm focus:outline-none focus:border-gold'>
                          <option value='Pending Verification'>Pending Verification</option>
                          <option value='Verified'>Verified</option>
                          <option value='Shipped'>Shipped</option>
                          <option value='Delivered'>Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Inventory / Products ─── */}
          {activeTab === 'products' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Add New Product</h3>
              <div className='flex flex-col gap-4 mb-12 bg-white p-6 rounded-2xl border border-blush/30 shadow-sm'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <Input placeholder='Product Name' value={newProduct.name} onChange={(e: any) => setNewProduct({ ...newProduct, name: e.target.value })} className="flex-1" />
                  <Input placeholder='Price (₹)' type='number' value={newProduct.price} onChange={(e: any) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-32" />
                  <Input placeholder='Category' value={newProduct.category} onChange={(e: any) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-48" />
                </div>
                <Input placeholder='Image URL' value={newProduct.image} onChange={(e: any) => setNewProduct({ ...newProduct, image: e.target.value })} />
                <textarea
                  placeholder='Product description...'
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className='w-full bg-ivory border border-pink-100 rounded-[12px] px-4 py-3 text-primary placeholder-secondary/50 focus:outline-none focus:border-gold resize-none h-24'
                />
                <Button onClick={handleAddProduct} className='self-end'>Add Product</Button>
              </div>

              <h3 className='font-heading text-2xl mb-6'>Inventory</h3>
              <div className='flex flex-col gap-4'>
                {products.map(p => (
                  <div key={p.id} className='bg-white border border-pink-50 p-6 rounded-[16px] shadow-sm hover:shadow-md transition-shadow'>
                    {editingId === p.id ? (
                      /* ── Editing Mode ── */
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-col md:flex-row gap-4'>
                          <Input placeholder='Name' value={editForm.name} onChange={(e: any) => setEditForm({ ...editForm, name: e.target.value })} className="flex-1" />
                          <Input placeholder='Price' type='number' value={editForm.price} onChange={(e: any) => setEditForm({ ...editForm, price: e.target.value })} className="w-32" />
                          <Input placeholder='Category' value={editForm.category} onChange={(e: any) => setEditForm({ ...editForm, category: e.target.value })} className="w-48" />
                        </div>
                        <Input placeholder='Image URL' value={editForm.image} onChange={(e: any) => setEditForm({ ...editForm, image: e.target.value })} />
                        <textarea
                          placeholder='Description...'
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className='w-full bg-ivory border border-pink-100 rounded-[12px] px-4 py-3 text-primary placeholder-secondary/50 focus:outline-none focus:border-gold resize-none h-24'
                        />
                        <div className='flex gap-3 justify-end'>
                          <Button variant='secondary' onClick={() => setEditingId(null)}>Cancel</Button>
                          <Button onClick={() => handleSaveEdit(p.id)}>Save</Button>
                        </div>
                      </div>
                    ) : (
                      /* ── View Mode ── */
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-blush/20">
                            {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />}
                          </div>
                          <div>
                            <p className='font-bold text-lg text-primary'>{p.name}</p>
                            <p className='text-secondary text-sm'>₹{p.price} | {p.category}</p>
                            {p.description && <p className='text-secondary/70 text-xs mt-1 max-w-md truncate'>{p.description}</p>}
                          </div>
                        </div>
                        <div className='flex gap-3'>
                          <button onClick={() => handleStartEdit(p)} className='text-gold hover:text-gold/80 transition-colors bg-gold/10 px-4 py-2 rounded-lg text-sm font-medium'>Edit</button>
                          <button onClick={() => deleteProduct(p.id)} className='text-red-400 hover:text-red-600 transition-colors bg-red-50 px-4 py-2 rounded-lg text-sm font-medium'>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Page Images ─── */}
          {activeTab === 'pages' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Page Images</h3>
              <p className='text-secondary mb-8'>Manage the hero and banner images across the website.</p>

              <div className='bg-white p-6 rounded-2xl border border-blush/30 shadow-sm mb-8'>
                <h4 className='font-heading text-lg mb-4 text-primary'>Homepage Hero Image</h4>
                <div className='flex flex-col md:flex-row gap-6 items-start'>
                  <div className='w-full md:w-1/3 aspect-video bg-blush/20 rounded-xl overflow-hidden relative'>
                    {heroImage && <Image src={heroImage} alt="Hero preview" fill className="object-cover" sizes="300px" />}
                  </div>
                  <div className='flex-1 flex flex-col gap-4'>
                    <Input placeholder='Hero image URL' value={heroImage} onChange={(e: any) => { setHeroImage(e.target.value); setBannerSaved(false); }} />
                    <Button onClick={() => setBannerSaved(true)} className='self-start'>
                      {bannerSaved ? '✓ Saved' : 'Save Image'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-blush/30 shadow-sm'>
                <h4 className='font-heading text-lg mb-4 text-primary'>Product Images</h4>
                <p className='text-secondary text-sm mb-4'>You can update individual product images from the <button onClick={() => setActiveTab('products')} className='text-gold font-medium hover:underline'>Inventory</button> tab by editing each product.</p>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {products.map(p => (
                    <div key={p.id} className='relative aspect-square bg-blush/20 rounded-xl overflow-hidden group cursor-pointer' onClick={() => { setActiveTab('products'); handleStartEdit(p); }}>
                      {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="150px" />}
                      <div className='absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <span className='text-white text-xs font-medium'>Edit</span>
                      </div>
                      <div className='absolute bottom-0 left-0 right-0 bg-primary/70 px-2 py-1'>
                        <p className='text-white text-xs truncate'>{p.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Customers ─── */}
          {activeTab === 'customers' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Customers</h3>
              <p className='text-secondary'>Customer list will appear here.</p>
            </div>
          )}

          {/* ─── Settings ─── */}
          {activeTab === 'settings' && (
            <div>
              <h3 className='font-heading text-2xl mb-6'>Store Settings</h3>
              <div className='bg-white p-8 rounded-2xl border border-blush/30'>
                <p className='text-secondary'>Store configuration options.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
