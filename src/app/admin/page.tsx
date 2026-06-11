'use client';
import { useState, useEffect, useRef } from 'react';
import Section from '@/components/ui/Section';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useOrderStore, useProductStore, useAuthStore } from '@/lib/store';
import { uploadImage } from '@/lib/supabase/storage';
import Image from 'next/image';

export default function Admin() {
  // Auth state
  const { user, login, logout, loading: authLoading } = useAuthStore();
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin state
  const [activeTab, setActiveTab] = useState('dashboard');
  const { orders, fetchOrders, updateOrderStatus, loading: ordersLoading } = useOrderStore();
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts, loading: productsLoading } = useProductStore();

  // New product form
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image: '' });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit product state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', description: '', image: '' });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data if admin
  useEffect(() => {
    if (user?.is_admin) {
      fetchOrders();
      fetchProducts();
    }
  }, [user]);

  const handleLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    const { error } = await login(loginId, loginPassword);
    setIsLoggingIn(false);
    if (error) {
      setLoginError(error);
    } else {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser?.is_admin) {
        setLoginError('Unauthorized. You do not have admin privileges.');
        logout();
      }
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setIsAdding(true);
    
    let imageUrl = newProduct.image;
    if (newImageFile) {
      const { url, error } = await uploadImage(newImageFile);
      if (error) {
        alert('Image upload failed: ' + error);
        setIsAdding(false);
        return;
      }
      if (url) imageUrl = url;
    }

    await addProduct({
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'Uncategorized',
      description: newProduct.description || '',
      image: imageUrl || ''
    });
    
    setNewProduct({ name: '', price: '', category: '', description: '', image: '' });
    setNewImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsAdding(false);
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
    setEditImageFile(null);
  };

  const handleSaveEdit = async (id: string) => {
    setIsSaving(true);
    let imageUrl = editForm.image;
    if (editImageFile) {
      const { url, error } = await uploadImage(editImageFile);
      if (error) {
        alert('Image upload failed: ' + error);
        setIsSaving(false);
        return;
      }
      if (url) imageUrl = url;
    }

    await updateProduct(id, {
      name: editForm.name,
      price: Number(editForm.price),
      category: editForm.category,
      description: editForm.description,
      image: imageUrl
    });
    setEditingId(null);
    setIsSaving(false);
  };

  if (authLoading) return <Section className="py-16 text-center"><p>Loading...</p></Section>;

  // ─── Login Screen ───
  if (!user || !user.is_admin) {
    return (
      <Section className="py-16">
        <div className='max-w-md mx-auto bg-white p-10 rounded-2xl border border-blush/30 shadow-sm'>
          <h2 className="font-heading text-3xl mb-2 text-center text-primary">Admin Login</h2>
          <p className="text-center text-secondary text-sm mb-8">Authorized personnel only</p>

          {loginError && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-xl">{loginError}</p>}

          <Input
            placeholder='Email Address'
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
          <Button className='w-full' onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? 'Verifying...' : 'Login'}
          </Button>
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
              <button onClick={() => logout()} className="text-left px-4 py-3 rounded-xl transition-colors text-red-400 hover:bg-red-50 mt-4">Logout</button>
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
              {ordersLoading ? <p>Loading orders...</p> : orders.length === 0 ? <p className='text-secondary'>No orders yet.</p> : (
                <div className='flex flex-col gap-4'>
                  {orders.map(o => (
                    <div key={o.id} className='bg-white border border-pink-50 p-6 rounded-[16px] flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4 hover:shadow-md transition-shadow'>
                      <div>
                        <p className='font-bold text-lg text-primary'>Order #{o.id.split('-')[0]}</p>
                        <p className='text-secondary text-sm'>{new Date(o.created_at).toLocaleDateString()} | ₹{o.total}</p>
                        <p className='text-xs mt-2 text-secondary'>User: {o.user_id || 'Guest'}</p>
                        <div className='mt-3'>
                          <p className='text-sm font-medium'>Items:</p>
                          <ul className='text-xs text-secondary list-disc pl-4'>
                            {(o.items || []).map((i: any, idx: number) => (
                              <li key={idx}>{i.quantity}x {i.name}</li>
                            ))}
                          </ul>
                        </div>
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
                <div className="flex gap-4 items-center">
                  <Input placeholder='Image URL (or upload below)' value={newProduct.image} onChange={(e: any) => setNewProduct({ ...newProduct, image: e.target.value })} className="flex-1" />
                  <span className="text-secondary text-sm">OR</span>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setNewImageFile(e.target.files?.[0] || null)} className="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blush/20 file:text-primary hover:file:bg-blush/30" />
                </div>
                <textarea
                  placeholder='Product description...'
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className='w-full bg-ivory border border-pink-100 rounded-[12px] px-4 py-3 text-primary placeholder-secondary/50 focus:outline-none focus:border-gold resize-none h-24'
                />
                <Button onClick={handleAddProduct} className='self-end' disabled={isAdding}>{isAdding ? 'Adding...' : 'Add Product'}</Button>
              </div>

              <h3 className='font-heading text-2xl mb-6'>Inventory</h3>
              {productsLoading ? <p>Loading products...</p> : (
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
                          <div className="flex gap-4 items-center">
                            <Input placeholder='Image URL' value={editForm.image} onChange={(e: any) => setEditForm({ ...editForm, image: e.target.value })} className="flex-1" />
                            <span className="text-secondary text-sm">OR</span>
                            <input type="file" accept="image/*" ref={editFileInputRef} onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} className="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blush/20 file:text-primary hover:file:bg-blush/30" />
                          </div>
                          <textarea
                            placeholder='Description...'
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className='w-full bg-ivory border border-pink-100 rounded-[12px] px-4 py-3 text-primary placeholder-secondary/50 focus:outline-none focus:border-gold resize-none h-24'
                          />
                          <div className='flex gap-3 justify-end'>
                            <Button variant='secondary' onClick={() => setEditingId(null)} disabled={isSaving}>Cancel</Button>
                            <Button onClick={() => handleSaveEdit(p.id)} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
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
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
