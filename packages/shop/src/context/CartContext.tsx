import { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem, EventType } from '@flowtel/shared';
import { track } from '@flowtel/tracker';

const CART_STORAGE_KEY = 'flowtel_cart';

export interface CartContextValue {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const defaultCart: Cart = {
  items: [],
  total: 0,
};

export const CartContext = createContext<CartContextValue | null>(null);

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function loadCartFromStorage(): Cart {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Cart;
      return {
        items: parsed.items || [],
        total: calculateTotal(parsed.items || []),
      };
    }
  } catch {
    // Ignore storage errors
  }
  return defaultCart;
}

function saveCartToStorage(cart: Cart): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Ignore storage errors
  }
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(defaultCart);

  useEffect(() => {
    setCart(loadCartFromStorage());
  }, []);

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.productId === item.productId);
      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = prev.items.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });

    track(EventType.ADD_TO_CART, {
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: 1,
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existingItem = prev.items.find((i) => i.productId === productId);
      if (!existingItem) return prev;

      let newItems: CartItem[];
      if (existingItem.quantity > 1) {
        newItems = prev.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        newItems = prev.items.filter((i) => i.productId !== productId);
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });

    track(EventType.REMOVE_FROM_CART, {
      productId,
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.productId !== productId);
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const newItems = prev.items.filter((i) => i.productId !== productId);
        return { items: newItems, total: calculateTotal(newItems) };
      }

      const existingItem = prev.items.find((i) => i.productId === productId);
      if (!existingItem) return prev;

      const newItems = prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      return { items: newItems, total: calculateTotal(newItems) };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(defaultCart);
  }, []);

  const getTotal = useCallback(() => {
    return cart.total;
  }, [cart.total]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeItem, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}
