import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaBarcode, FaQrcode, FaLock, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../store/AuthContext';
import './CheckoutForm.css';

const CheckoutForm = ({ totalPrice, onComplete, onCancel }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    
  
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    
    metodoPagamento: 'cartao',
    
  
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvvCartao: '',
    parcelamento: '1'
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Dados, 2: Pagamento, 3: Confirmação

  // Pre-llenar datos del usuario logueado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prevData => ({
        ...prevData,
        nome: user.nome || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  
  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };


  const validateCEP = (cep) => {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
  };

  
  const formatCPF = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCEP = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    
    switch (name) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
      case 'telefone':
        formattedValue = formatPhone(value);
        break;
      case 'numeroCartao':
        formattedValue = formatCardNumber(value);
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
    
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    else if (!validateCEP(formData.cep)) newErrors.cep = 'CEP inválido';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validação do Step 2 (Pagamento)
  const validateStep2 = () => {
    const newErrors = {};

    if (formData.metodoPagamento === 'cartao') {
      if (!formData.numeroCartao.trim()) newErrors.numeroCartao = 'Número do cartão é obrigatório';
      if (!formData.nomeCartao.trim()) newErrors.nomeCartao = 'Nome no cartão é obrigatório';
      if (!formData.validadeCartao.trim()) newErrors.validadeCartao = 'Validade é obrigatória';
      if (!formData.cvvCartao.trim()) newErrors.cvvCartao = 'CVV é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (validateStep1() && validateStep2()) {
      onComplete(formData);
    }
  };

  const renderStep1 = () => (
    <div className="checkout-step">
      <h3><FaUser /> Dados Pessoais e Entrega</h3>
      
      <div className="form-section">
        <h4>Informações Pessoais</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={errors.nome ? 'error' : ''}
              placeholder="Seu nome completo"
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="seu@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Telefone *</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className={errors.telefone ? 'error' : ''}
              placeholder="(11) 99999-9999"
              maxLength="15"
            />
            {errors.telefone && <span className="error-message">{errors.telefone}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              className={errors.cpf ? 'error' : ''}
              placeholder="000.000.000-00"
              maxLength="14"
            />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4><FaMapMarkerAlt /> Endereço de Entrega</h4>
        <div className="form-row">
          <div className="form-group">
            <label>CEP *</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              className={errors.cep ? 'error' : ''}
              placeholder="00000-000"
              maxLength="9"
            />
            {errors.cep && <span className="error-message">{errors.cep}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group flex-2">
            <label>Endereço *</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              className={errors.endereco ? 'error' : ''}
              placeholder="Rua, Avenida, etc."
            />
            {errors.endereco && <span className="error-message">{errors.endereco}</span>}
          </div>
          <div className="form-group">
            <label>Número *</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              className={errors.numero ? 'error' : ''}
              placeholder="123"
            />
            {errors.numero && <span className="error-message">{errors.numero}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Complemento</label>
            <input
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
              placeholder="Apto, Bloco, etc. (opcional)"
            />
          </div>
          <div className="form-group">
            <label>Bairro *</label>
            <input
              type="text"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              className={errors.bairro ? 'error' : ''}
              placeholder="Nome do bairro"
            />
            {errors.bairro && <span className="error-message">{errors.bairro}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Cidade *</label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              className={errors.cidade ? 'error' : ''}
              placeholder="Nome da cidade"
            />
            {errors.cidade && <span className="error-message">{errors.cidade}</span>}
          </div>
          <div className="form-group">
            <label>Estado *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className={errors.estado ? 'error' : ''}
            >
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="PR">Paraná</option>
              <option value="SC">Santa Catarina</option>
              <option value="BA">Bahia</option>
              <option value="GO">Goiás</option>
              <option value="PE">Pernambuco</option>
              <option value="CE">Ceará</option>
            </select>
            {errors.estado && <span className="error-message">{errors.estado}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="checkout-step">
      <h3><FaLock /> Método de Pagamento</h3>
      
      <div className="payment-methods">
        <div 
          className={`payment-method ${formData.metodoPagamento === 'cartao' ? 'active' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, metodoPagamento: 'cartao' }))}
        >
          <FaCreditCard />
          <span>Cartão de Crédito</span>
        </div>
        
        <div 
          className={`payment-method ${formData.metodoPagamento === 'pix' ? 'active' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, metodoPagamento: 'pix' }))}
        >
          <FaQrcode />
          <span>PIX</span>
        </div>
        
        <div 
          className={`payment-method ${formData.metodoPagamento === 'boleto' ? 'active' : ''}`}
          onClick={() => setFormData(prev => ({ ...prev, metodoPagamento: 'boleto' }))}
        >
          <FaBarcode />
          <span>Boleto Bancário</span>
        </div>
      </div>

      {formData.metodoPagamento === 'cartao' && (
        <div className="card-form">
          <div className="form-row">
            <div className="form-group">
              <label>Número do Cartão *</label>
              <input
                type="text"
                name="numeroCartao"
                value={formData.numeroCartao}
                onChange={handleInputChange}
                className={errors.numeroCartao ? 'error' : ''}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
              />
              {errors.numeroCartao && <span className="error-message">{errors.numeroCartao}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nome no Cartão *</label>
              <input
                type="text"
                name="nomeCartao"
                value={formData.nomeCartao}
                onChange={handleInputChange}
                className={errors.nomeCartao ? 'error' : ''}
                placeholder="Nome como está no cartão"
              />
              {errors.nomeCartao && <span className="error-message">{errors.nomeCartao}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Validade *</label>
              <input
                type="text"
                name="validadeCartao"
                value={formData.validadeCartao}
                onChange={handleInputChange}
                className={errors.validadeCartao ? 'error' : ''}
                placeholder="MM/AA"
                maxLength="5"
              />
              {errors.validadeCartao && <span className="error-message">{errors.validadeCartao}</span>}
            </div>
            <div className="form-group">
              <label>CVV *</label>
              <input
                type="text"
                name="cvvCartao"
                value={formData.cvvCartao}
                onChange={handleInputChange}
                className={errors.cvvCartao ? 'error' : ''}
                placeholder="123"
                maxLength="4"
              />
              {errors.cvvCartao && <span className="error-message">{errors.cvvCartao}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Parcelamento</label>
              <select
                name="parcelamento"
                value={formData.parcelamento}
                onChange={handleInputChange}
              >
                <option value="1">1x de R$ {totalPrice.toFixed(2)} (à vista)</option>
                <option value="2">2x de R$ {(totalPrice / 2).toFixed(2)}</option>
                <option value="3">3x de R$ {(totalPrice / 3).toFixed(2)}</option>
                <option value="6">6x de R$ {(totalPrice / 6).toFixed(2)}</option>
                <option value="12">12x de R$ {(totalPrice / 12).toFixed(2)}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {formData.metodoPagamento === 'pix' && (
        <div className="pix-info">
          <p>✅ Pagamento instantâneo via PIX</p>
          <p>📱 Você receberá o código PIX após confirmar o pedido</p>
          <p>⏰ O código expira em 30 minutos</p>
        </div>
      )}

      {formData.metodoPagamento === 'boleto' && (
        <div className="boleto-info">
          <p>📄 Boleto bancário com vencimento em 3 dias</p>
          <p>🏦 Pode ser pago em qualquer banco ou internet banking</p>
          <p>⚠️ Pedido será processado após confirmação do pagamento</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="checkout-step">
      <h3>✅ Confirmação do Pedido</h3>
      
      <div className="order-summary">
        <h4>Resumo do Pedido</h4>
        <div className="summary-section">
          <h5>Dados de Entrega</h5>
          <p><strong>{formData.nome}</strong></p>
          <p>{formData.endereco}, {formData.numero}</p>
          {formData.complemento && <p>{formData.complemento}</p>}
          <p>{formData.bairro}, {formData.cidade} - {formData.estado}</p>
          <p>CEP: {formData.cep}</p>
        </div>
        
        <div className="summary-section">
          <h5>Método de Pagamento</h5>
          {formData.metodoPagamento === 'cartao' && (
            <p>💳 Cartão de Crédito ({formData.parcelamento}x)</p>
          )}
          {formData.metodoPagamento === 'pix' && <p>📱 PIX</p>}
          {formData.metodoPagamento === 'boleto' && <p>📄 Boleto Bancário</p>}
        </div>
        
        <div className="summary-section">
          <h5>Total do Pedido</h5>
          <p className="total-price">R$ {totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form">
        <div className="checkout-header">
          <h2>Finalizar Compra</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span>1</span> Dados
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span>2</span> Pagamento
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span> Confirmação
          </div>
        </div>

        <div>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          
          <div className="checkout-actions">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrevStep}>
                Voltar
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNextStep}>
                Continuar
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary" 
                onClick={handleSubmit}
              >
                Finalizar Pedido
              </button>
            )}
            
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};

export default CheckoutForm;