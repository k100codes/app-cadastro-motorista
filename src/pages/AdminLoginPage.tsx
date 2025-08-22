import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.usuario || !formData.senha) {
      toast.error('Usuário e senha são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular validação de credenciais localmente
      const validCredentials = [
        { usuario: 'admin', senha: '123456', empresa: 'Empresa Demo', empresaId: 'demo123' },
        { usuario: 'transporteabc', senha: 'abc123', empresa: 'Transporte ABC Ltda', empresaId: 'abc789' },
        { usuario: 'logisticaxyz', senha: 'xyz456', empresa: 'Logística XYZ S.A.', empresaId: 'xyz456' }
      ];

      const validUser = validCredentials.find(
        cred => cred.usuario === formData.usuario && cred.senha === formData.senha
      );

      if (validUser) {
        // Simular token e dados do admin
        const mockToken = 'mock-jwt-token-' + Date.now();
        const adminData = {
          usuario: validUser.usuario,
          empresa: validUser.empresa,
          empresaId: validUser.empresaId
        };
        
        // Salvar no localStorage
        localStorage.setItem('adminToken', mockToken);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        toast.success(`Bem-vindo, ${validUser.usuario}!`);
        navigate('/admin/dashboard');
      } else {
        toast.error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro no login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Início
          </Link>
          
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">
              Acesse sua conta para gerenciar motoristas
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Digite sua senha"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">
            Contas de Demonstração
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>admin</span>
              <span className="font-mono">123456</span>
            </div>
            <div className="flex justify-between">
              <span>transporteabc</span>
              <span className="font-mono">abc123</span>
            </div>
            <div className="flex justify-between">
              <span>logisticaxyz</span>
              <span className="font-mono">xyz456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;