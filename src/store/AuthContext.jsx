import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { listClientes, createCliente } from '../services/api';


const AuthContext = createContext();


const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};


const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};


function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_ERROR:
    case AUTH_ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}


export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

 
  const login = async (email) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
     
      const clientes = await listClientes();
      
     
      const user = clientes.find(cliente => cliente.email === email);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
    
      
     
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      dispatch({ type: AUTH_ACTIONS.LOGIN_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

 
  const register = async (nome, email) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
    
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }
      
      
      const clientes = await listClientes();
      const existingUser = clientes.find(cliente => cliente.email === email);
      
      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }
      
      
      const newUser = await createCliente({
        nome,
        email
      });
      
    
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS, payload: newUser });
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      dispatch({ type: AUTH_ACTIONS.REGISTER_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  
  const getUserInitials = (user) => {
    if (!user || !user.nome) return 'U';
    const names = user.nome.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    getUserInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;