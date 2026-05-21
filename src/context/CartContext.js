'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += action.payload.quantity || 1;
        return { ...state, items: updatedItems, isOpen: true };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
        isOpen: true,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === action.payload.id && item.size === action.payload.size)
        ),
      };
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id && item.size === action.payload.size) {
          return { ...item, quantity: Math.max(1, action.payload.quantity) };
        }
        return item;
      });
      return { ...state, items: updatedItems };
    }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cart is session-only (clears on refresh) - no localStorage persistence
  // This is intentional for public website security

  const addItem = (product, size, quantity = 1) => {
    // Check if adding this quantity would exceed stock
    const existingItem = state.items.find(
      (item) => item.id === product.id && item.size === size
    );
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantityInCart + quantity;
    
    // Get product stock (default to 0 if not available)
    const availableStock = product.quantity || 0;
    
    // If new total would exceed stock, only add up to stock limit
    if (newTotalQuantity > availableStock) {
      const maxCanAdd = availableStock - currentQuantityInCart;
      if (maxCanAdd <= 0) {
        // Already at max stock in cart
        console.warn(`Cannot add more. Maximum stock (${availableStock}) already in cart.`);
        return { success: false, message: `Maximum stock (${availableStock}) already in cart`, maxStock: availableStock };
      }
      // Add only what's available
      console.warn(`Only ${maxCanAdd} items available. Adding ${maxCanAdd} instead of ${quantity}.`);
      dispatch({
        type: 'ADD_ITEM',
        payload: { ...product, size, quantity: maxCanAdd },
      });
      return { success: true, message: `Only ${maxCanAdd} available. Added to cart.`, addedQuantity: maxCanAdd, maxStock: availableStock };
    }
    
    // Normal add - within stock limits
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...product, size, quantity },
    });
    return { success: true, message: 'Added to cart', addedQuantity: quantity };
  };

  const updateQuantity = (id, size, quantity, maxStock) => {
    // Validate against stock if maxStock is provided
    if (maxStock !== undefined && quantity > maxStock) {
      console.warn(`Cannot set quantity to ${quantity}. Maximum stock is ${maxStock}.`);
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity: maxStock } });
      return { success: false, message: `Maximum stock is ${maxStock}`, adjustedQuantity: maxStock };
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity: Math.max(1, quantity) } });
    return { success: true };
  };

  const removeItem = (id, size) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        openCart,
        closeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
