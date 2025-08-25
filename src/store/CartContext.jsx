import React, { createContext, useContext, useReducer, useEffect } from 'react';


const CartContext = createContext();

const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};


const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { product } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...product, quantity: 1 }]
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.id !== productId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }
    
    default:
      return state;
  }
};


const initialState = {
  items: []
};


const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};


const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('lenovo-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: { items: parsedCart }
        });
      }
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
    }
  }, []);

  
  useEffect(() => {
    try {
      localStorage.setItem('lenovo-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  }, [state.items]);

  
  const addToCart = (product) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { product }
    });
  };

  const removeFromCart = (productId) => {
    const item = state.items.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      // Si hay más de 1, reducir cantidad en 1
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: { productId, quantity: item.quantity - 1 }
      });
    } else {
      // Si solo hay 1, eliminar completamente
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART,
        payload: { productId }
      });
    }
  };

  const removeProductCompletely = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: { productId }
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART
    });
  };

  
  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.preco) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };


  const contextValue = {
   
    cartItems: state.items,
    
    
    addToCart,
    removeFromCart,
    removeProductCompletely,
    updateQuantity,
    clearCart,
    
    
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useCart };