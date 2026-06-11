import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase/client';

type CartItem = { id: string; name: string; price: number; quantity: number; image?: string };

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) };
        }
        return { items: [...state.items, item] };
      }),
      removeFromCart: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, qty) => set((state) => ({ items: state.items.map(i => i.id === id ? { ...i, quantity: qty } : i) })),
      clearCart: () => set({ items: [] })
    }),
    { name: 'veloura-cart' }
  )
);

interface WishlistStore {
  items: string[];
  toggleWishlist: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      toggleWishlist: (id) => set((state) => ({
        items: state.items.includes(id) ? state.items.filter(i => i !== id) : [...state.items, id]
      }))
    }),
    { name: 'veloura-wishlist' }
  )
);

interface AuthStore {
  user: any;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: true,
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    set({ user: profile || { id: data.user.id, email, name: email }, session: data.session });
    return { error: null };
  },
  signup: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      await supabase.from('users').insert({ id: data.user.id, name, email });
      set({ user: { id: data.user.id, name, email }, session: data.session });
    }
    return { error: null };
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
      set({ user: profile || { id: session.user.id, email: session.user.email }, session, loading: false });
    } else {
      set({ loading: false });
    }
  }
}));

interface OrderStore {
  orders: any[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: { total: number, items: any[], payment_status?: string }) => Promise<{ data?: any, error?: string }>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,
  fetchOrders: async () => {
    set({ loading: true });
    const { user } = useAuthStore.getState();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    // If not admin, only fetch own orders
    if (!user?.is_admin) {
      if (!user) {
        set({ orders: [], loading: false });
        return;
      }
      query = query.eq('user_id', user.id);
    }
    
    const { data, error } = await query;
    if (!error && data) {
      set({ orders: data, loading: false });
    } else {
      set({ loading: false });
    }
  },
  createOrder: async (orderData) => {
    const { user } = useAuthStore.getState();
    const payload = {
      ...orderData,
      user_id: user?.id || null,
      status: 'Pending Verification'
    };
    const { data, error } = await supabase.from('orders').insert(payload).select().single();
    if (!error && data) {
      set((state) => ({ orders: [data, ...state.orders] }));
      return { data };
    }
    return { error: error?.message || 'Failed to create order' };
  },
  updateOrderStatus: async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      set((state) => ({ orders: state.orders.map(o => o.id === id ? { ...o, status } : o) }));
    }
  }
}));

interface ProductStore {
  products: any[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: any) => Promise<{ data?: any, error?: string }>;
  updateProduct: (id: string, updates: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      set({ products: data, loading: false });
    } else {
      set({ loading: false });
    }
  },
  addProduct: async (product) => {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (!error && data) {
      set((state) => ({ products: [data, ...state.products] }));
      return { data };
    }
    return { error: error?.message || 'Failed to add product' };
  },
  updateProduct: async (id, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (!error && data) {
      set((state) => ({ products: state.products.map(p => p.id === id ? data : p) }));
    }
  },
  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      set((state) => ({ products: state.products.filter(p => p.id !== id) }));
    }
  }
}));
