import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Cargar el carrito desde localStorage, si existe
const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState: CartState = {
  items: loadCartFromLocalStorage()
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      producto: Omit<CartItem, 'quantity'>,
      quantity: number
    }>) => {
      const product = action.payload;
      const existing = state.items.find((item: CartItem) => item.id === product.producto.id);
      if (existing) {
        existing.quantity += product.quantity;
      } else {
        state.items.push({ ...product.producto, quantity: product.quantity });
      }
      localStorage.setItem('cart', JSON.stringify(state.items)); // Actualizar el carrito en localStorage
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items)); // Actualizar el carrito en localStorage
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items)); // Actualizar el carrito en localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart'); // Limpiar el carrito en localStorage
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
