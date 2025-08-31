import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { login, register, isLoading, error, clearError } = useAuth();


  useEffect(() => {
    if (isOpen) {
      setFormData({
        nome: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setFormErrors({});
      clearError();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    setFormErrors({});
    clearError();
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!isLogin) {
      if (!formData.nome) {
        errors.nome = 'Nome é obrigatório';
      } else if (formData.nome.length < 2) {
        errors.nome = 'Nome deve ter pelo menos 2 caracteres';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Senhas não coincidem';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.nome, formData.email, formData.password);
    }
    
    if (result.success) {
      onClose();
    }
  };



  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Iniciar Sessão' : 'Criar Conta'}</h2>
          <button 
            className="auth-modal-close" 
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>
        
        <div className="auth-modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={formErrors.nome ? 'error' : ''}
                  placeholder="Digite seu nome completo"
                />
                {formErrors.nome && (
                  <span className="error-message">{formErrors.nome}</span>
                )}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? 'error' : ''}
                placeholder="Digite seu email"
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={formErrors.password ? 'error' : ''}
                placeholder="Digite sua senha"
              />
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={formErrors.confirmPassword ? 'error' : ''}
                  placeholder="Confirme sua senha"
                />
                {formErrors.confirmPassword && (
                  <span className="error-message">{formErrors.confirmPassword}</span>
                )}
              </div>
            )}
            
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>
          
          <div className="auth-switch">
            <p>
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button 
                type="button"
                className="auth-switch-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;