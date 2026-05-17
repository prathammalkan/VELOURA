import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as defaultProducts } from './data';
import { supabase } from './supabase/client';

type CartItem = { id: string; name: string; price: number; quantity: number };

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
    // Fetch profile from users table
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    set({ user: profile || { id: data.user.id, email, name: email }, session: data.session });
    return { error: null };
  },
  signup: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      // Create profile in users table
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
  createOrder: (order: any) => void;
  updateOrderStatus: (id: string, status: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  createOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (id, status) => set((state) => ({ orders: state.orders.map(o => o.id === id ? { ...o, status } : o) }))
}));

interface ProductStore {
  products: any[];
  addProduct: (product: any) => void;
  updateProduct: (id: string, updates: any) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()((set) => ({
  products: defaultProducts,
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, updates) => set((state) => ({ products: state.products.map(p => p.id === id ? { ...p, ...updates } : p) })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) }))
}));
