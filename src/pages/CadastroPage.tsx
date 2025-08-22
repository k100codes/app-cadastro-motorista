import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Camera, ArrowLeft, Check, X, User, Mail, Phone, FileText, Building2, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  nomeCompleto: string;
  cpf: string;
  empresa: string;
  empresaId: string;
  telefone: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cnh: string;
}

interface Fotos {
  frontal: string;
  perfilEsquerdo: string;
  perfilDireito: string;
}

const CadastroPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const empresaId = searchParams.get('empresaId');
  
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    cpf: '',
    empresa: '',
    empresaId: empresaId || '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cnh: ''
  });

  const [fotos, setFotos] = useState<Fotos>({
    frontal: '',
    perfilEsquerdo: '',
    perfilDireito: ''
  });

  const [currentPhoto, setCurrentPhoto] = useState<'frontal' | 'perfilEsquerdo' | 'perfilDireito' | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!empresaId) {
      toast.error('Link inválido. Solicite um novo link à sua empresa.');
      return;
    }
    // Aqui você poderia fazer uma chamada para buscar o nome da empresa
    setFormData(prev => ({ ...prev, empresa: `Empresa ${empresaId}` }));
  }, [empresaId]);

  const startCamera = async (photoType: 'frontal' | 'perfilEsquerdo' | 'perfilDireito') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setCurrentPhoto(photoType);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error('Erro ao acessar a câmera. Verifique as permissões.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !currentPhoto) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      
      setFotos(prev => ({
        ...prev,
        [currentPhoto]: photoData
      }));
      
      stopCamera();
      toast.success('Foto capturada com sucesso!');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCurrentPhoto(null);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatTelefone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nomeCompleto.trim()) {
      toast.error('Nome completo é obrigatório');
      return false;
    }
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF deve conter 11 dígitos');
      return false;
    }
    if (!formData.telefone) {
      toast.error('Telefone é obrigatório');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Email deve ter um formato válido');
      return false;
    }
    if (!formData.senha || formData.senha.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('Senhas não conferem');
      return false;
    }
    if (!fotos.frontal || !fotos.perfilEsquerdo || !fotos.perfilDireito) {
      toast.error('Todas as 3 fotos são obrigatórias');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        fotos
      };
      
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Cadastro enviado com sucesso! Aguarde a aprovação.');
        
        // Resetar formulário
        setFormData({
          nomeCompleto: '',
          cpf: '',
          empresa: `Empresa ${empresaId}`,
          empresaId: empresaId || '',
          telefone: '',
          email: '',
          senha: '',
          confirmarSenha: '',
          cnh: ''
        });
        setFotos({ frontal: '', perfilEsquerdo: '', perfilDireito: '' });
      } else {
        toast.error(data.message || 'Erro ao enviar cadastro');
      }
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const photoLabels = {
    frontal: 'Foto Frontal',
    perfilEsquerdo: 'Perfil Esquerdo', 
    perfilDireito: 'Perfil Direito'
  };

  if (!empresaId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Inválido</h2>
          <p className="text-gray-600 mb-6">
            Este link de cadastro não é válido. Solicite um novo link à sua empresa.
          </p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Motorista</h1>
          <p className="text-gray-600 mt-2">Preencha todos os dados e capture as fotos obrigatórias</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-600" />
              Dados Pessoais
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNH (opcional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="cnh"
                    value={formData.cnh}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Número da CNH"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Senha */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Lock className="h-6 w-6 mr-2 text-blue-600" />
              Senha de Acesso
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Digite a senha novamente"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Camera className="h-6 w-6 mr-2 text-blue-600" />
              Fotos Obrigatórias
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {(Object.keys(photoLabels) as Array<keyof typeof photoLabels>).map((photoType) => (
                <div key={photoType} className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {photoLabels[photoType]} *
                  </label>
                  
                  {fotos[photoType] ? (
                    <div className="relative">
                      <img 
                        src={fotos[photoType]} 
                        alt={photoLabels[photoType]}
                        className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => startCamera(photoType)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Refazer Foto
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Foto não capturada</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startCamera(photoType)}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Capturar Foto
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Instruções:</strong> Capture uma foto frontal e duas fotos de perfil (esquerdo e direito). 
                Certifique-se de que o rosto esteja bem iluminado e visível.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Enviando...' : 'Enviar Cadastro'}
            </button>
          </div>
        </form>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Capturar {currentPhoto && photoLabels[currentPhoto]}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Posicione seu rosto no centro da tela
                </p>
              </div>
              
              <div className="relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Capturar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastroPage;