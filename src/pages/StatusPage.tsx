import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, CheckCircle, XCircle, Clock, User, Building2, Calendar, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface DriverStatus {
  _id: string;
  nomeCompleto: string;
  cpf: string;
  empresa: string;
  telefone: string;
  email: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  motivoReprovacao?: string;
  dataCadastro: string;
}

const StatusPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [driver, setDriver] = useState<DriverStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      toast.error('Digite um CPF válido com 11 dígitos');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      // Simular busca de status
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay da API
      
      const cpfLimpo = cpf.replace(/\D/g, '');
      
      // Simular alguns CPFs de exemplo
      const mockDriversStatus = [
        {
          _id: '1',
          nomeCompleto: 'João Silva Santos',
          cpf: '12345678900',
          empresa: 'Empresa Demo',
          telefone: '(11) 99999-9999',
          email: 'joao.silva@email.com',
          status: 'pendente' as const,
          dataCadastro: new Date().toISOString()
        },
        {
          _id: '2',
          nomeCompleto: 'Maria Oliveira Costa',
          cpf: '98765432100',
          empresa: 'Transporte ABC Ltda',
          telefone: '(11) 88888-8888',
          email: 'maria.oliveira@email.com',
          status: 'aprovado' as const,
          dataCadastro: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '3',
          nomeCompleto: 'Carlos Pereira Lima',
          cpf: '45678912300',
          empresa: 'Logística XYZ S.A.',
          telefone: '(11) 77777-7777',
          email: 'carlos.pereira@email.com',
          status: 'rejeitado' as const,
          motivoReprovacao: 'Fotos não estão claras o suficiente',
          dataCadastro: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      const foundDriver = mockDriversStatus.find(d => d.cpf === cpfLimpo);
      
      if (foundDriver) {
        setDriver(foundDriver);
      } else {
        setDriver(null);
        toast.error('CPF não encontrado no sistema');
      }
    } catch (error) {
      console.error('Erro ao consultar status:', error);
      toast.error('Erro ao consultar status. Tente novamente.');
      setDriver(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'rejeitado':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejeitado':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Consultar Status do Cadastro</h1>
          <p className="text-gray-600 mt-2">Digite seu CPF para verificar o status do seu cadastro</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Consultando...' : 'Consultar Status'}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {driver ? (
              <div className="space-y-6">
                {/* Status Header */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {getStatusIcon(driver.status)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Status: {getStatusText(driver.status)}
                  </h2>
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(driver.status)}`}>
                    {getStatusText(driver.status)}
                  </div>
                </div>

                {/* Driver Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cadastro</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nome Completo</p>
                        <p className="font-medium text-gray-900">{driver.nomeCompleto}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Empresa</p>
                        <p className="font-medium text-gray-900">{driver.empresa}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium text-gray-900">{driver.telefone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{driver.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Data do Cadastro</p>
                        <p className="font-medium text-gray-900">
                          {new Date(driver.dataCadastro).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                {driver.status === 'rejeitado' && driver.motivoReprovacao && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Motivo da Reprovação</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">{driver.motivoReprovacao}</p>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 mb-4">
                        Você pode fazer um novo cadastro corrigindo os problemas apontados.
                      </p>
                      <Link 
                        to="/cadastro"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Fazer Novo Cadastro
                      </Link>
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                {driver.status === 'pendente' && (
                  <div className="border-t pt-6 text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Cadastro em Análise
                      </h3>
                      <p className="text-yellow-700">
                        Seu cadastro está sendo analisado pela equipe responsável. 
                        Você receberá uma notificação assim que houver uma decisão.
                      </p>
                    </div>
                  </div>
                )}

                {driver.status === 'aprovado' && (
                  <div className="border-t pt-6 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Cadastro Aprovado!
                      </h3>
                      <p className="text-green-700">
                        Parabéns! Seu cadastro foi aprovado com sucesso. 
                        Agora você está habilitado no sistema.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">CPF não encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos nenhum cadastro com este CPF em nosso sistema.
                </p>
                <Link 
                  to="/cadastro"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fazer Cadastro
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;