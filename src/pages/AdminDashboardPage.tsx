import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  LogOut,
  Copy,
  Building2,
  Calendar,
  Phone,
  Mail,
  FileText,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Driver {
  _id: string;
  nomeCompleto: string;
  cpf: string;
  empresa: string;
  telefone: string;
  email: string;
  cnh: string;
  fotos: {
    frontal: string;
    perfilEsquerdo: string;
    perfilDireito: string;
  };
  status: 'pendente' | 'aprovado' | 'rejeitado';
  motivoReprovacao?: string;
  dataCadastro: string;
}

interface Stats {
  total: number;
  pendente: number;
  aprovado: number;
  rejeitado: number;
}

interface AdminData {
  usuario: string;
  empresa: string;
  empresaId: string;
}

const AdminDashboardPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pendente: 0, aprovado: 0, rejeitado: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [cadastroLink, setCadastroLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    
    if (!token || !admin) {
      toast.error('Acesso negado. Faça login novamente.');
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(admin));
    fetchDrivers();
    fetchCadastroLink();
  }, [navigate]);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm, statusFilter]);

  const fetchDrivers = async () => {
    try {
      // Simular dados de motoristas para demonstração
      const mockDrivers: Driver[] = [
        {
          _id: '1',
          nomeCompleto: 'João Silva Santos',
          cpf: '123.456.789-00',
          empresa: adminData?.empresa || 'Empresa Demo',
          telefone: '(11) 99999-9999',
          email: 'joao.silva@email.com',
          cnh: '12345678901',
          fotos: {
            frontal: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvdG8gRnJvbnRhbDwvdGV4dD48L3N2Zz4=',
            perfilEsquerdo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBlcmZpbCBFc3E8L3RleHQ+PC9zdmc+',
            perfilDireito: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBlcmZpbCBEaXI8L3RleHQ+PC9zdmc+'
          },
          status: 'pendente',
          dataCadastro: new Date().toISOString()
        },
        {
          _id: '2',
          nomeCompleto: 'Maria Oliveira Costa',
          cpf: '987.654.321-00',
          empresa: adminData?.empresa || 'Empresa Demo',
          telefone: '(11) 88888-8888',
          email: 'maria.oliveira@email.com',
          cnh: '98765432109',
          fotos: {
            frontal: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvdG8gRnJvbnRhbDwvdGV4dD48L3N2Zz4=',
            perfilEsquerdo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBlcmZpbCBFc3E8L3RleHQ+PC9zdmc+',
            perfilDireito: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBlcmZpbCBEaXI8L3RleHQ+PC9zdmc+'
          },
          status: 'aprovado',
          dataCadastro: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
        },
        {
          _id: '3',
          nomeCompleto: 'Carlos Pereira Lima',
          cpf: '456.789.123-00',
          empresa: adminData?.empresa || 'Empresa Demo',
          telefone: '(11) 77777-7777',
          email: 'carlos.pereira@email.com',
          cnh: '45678912345',
          fotos: {
            frontal: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvdG8gRnJvbnRhbDwvdGV4dD48L3N2Zz4=',
            perfilEsquerdo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBlcmZpbCBFc3E8L3RleHQ+PC9zdmc+',
            perfilDireito: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBlcmZpbCBEaXI8L3RleHQ+PC9zdmc+'
          },
          status: 'rejeitado',
          motivoReprovacao: 'Fotos não estão claras o suficiente',
          dataCadastro: new Date(Date.now() - 172800000).toISOString() // 2 dias atrás
        }
      ];

      setDrivers(mockDrivers);
      
      // Calcular estatísticas
      const mockStats = {
        total: mockDrivers.length,
        pendente: mockDrivers.filter(d => d.status === 'pendente').length,
        aprovado: mockDrivers.filter(d => d.status === 'aprovado').length,
        rejeitado: mockDrivers.filter(d => d.status === 'rejeitado').length
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const fetchCadastroLink = async () => {
    try {
      // Simular geração de link baseado no empresaId
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/cadastro?empresaId=${adminData?.empresaId || 'demo123'}`;
      setCadastroLink(link);
    } catch (error) {
      console.error('Erro ao buscar link:', error);
    }
  };

  const filterDrivers = () => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.cpf.includes(searchTerm.replace(/\D/g, ''))
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }

    setFilteredDrivers(filtered);
  };

  const handleStatusChange = async (driverId: string, newStatus: 'aprovado' | 'rejeitado', motivo?: string) => {
    try {
      // Simular atualização de status
      const updatedDrivers = drivers.map(driver => {
        if (driver._id === driverId) {
          return {
            ...driver,
            status: newStatus,
            motivoReprovacao: newStatus === 'rejeitado' ? motivo : undefined
          };
        }
        return driver;
      });
      
      setDrivers(updatedDrivers);
      
      // Recalcular estatísticas
      const newStats = {
        total: updatedDrivers.length,
        pendente: updatedDrivers.filter(d => d.status === 'pendente').length,
        aprovado: updatedDrivers.filter(d => d.status === 'aprovado').length,
        rejeitado: updatedDrivers.filter(d => d.status === 'rejeitado').length
      };
      setStats(newStats);
      
      toast.success(`Motorista ${newStatus} com sucesso!`);
      setSelectedDriver(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro de conexão');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(cadastroLink);
    toast.success('Link copiado para a área de transferência!');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nome', 'CPF', 'Email', 'Telefone', 'Status', 'Data Cadastro'],
      ...filteredDrivers.map(driver => [
        driver.nomeCompleto,
        driver.cpf,
        driver.email,
        driver.telefone,
        driver.status,
        new Date(driver.dataCadastro).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `motoristas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Arquivo CSV exportado com sucesso!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejeitado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600">
                {adminData?.empresa} - {adminData?.usuario}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Voltar ao Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendente}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aprovado}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejeitado}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Link de Cadastro */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Link de Cadastro Exclusivo
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={cadastroLink}
              readOnly
              className="flex-1 px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70"
            />
            <button
              onClick={copyLink}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all flex items-center"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-2">
            Compartilhe este link com os motoristas para que possam se cadastrar
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="pendente">Pendentes</option>
                  <option value="aprovado">Aprovados</option>
                  <option value="rejeitado">Rejeitados</option>
                </select>
              </div>
              
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Drivers List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Motoristas ({filteredDrivers.length})
            </h3>
          </div>
          
          {filteredDrivers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum motorista encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motorista
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {driver.nomeCompleto}
                          </div>
                          <div className="text-sm text-gray-500">
                            CPF: {driver.cpf}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{driver.email}</div>
                        <div className="text-sm text-gray-500">{driver.telefone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(driver.status)}`}>
                          {getStatusIcon(driver.status)}
                          <span className="ml-1 capitalize">{driver.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(driver.dataCadastro).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setShowPhotos(false);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {driver.status === 'pendente' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(driver._id, 'aprovado')}
                                className="text-green-600 hover:text-green-900 transition-colors"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const motivo = prompt('Motivo da reprovação (opcional):');
                                  handleStatusChange(driver._id, 'rejeitado', motivo || undefined);
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalhes do Motorista
                </h3>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nome Completo</p>
                      <p className="font-medium text-gray-900">{selectedDriver.nomeCompleto}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">CPF</p>
                      <p className="font-medium text-gray-900">{selectedDriver.cpf}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Empresa</p>
                      <p className="font-medium text-gray-900">{selectedDriver.empresa}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium text-gray-900">{selectedDriver.telefone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedDriver.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Data do Cadastro</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedDriver.dataCadastro).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedDriver.cnh && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">CNH</p>
                  <p className="font-medium text-gray-900">{selectedDriver.cnh}</p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Fotos</h4>
                  <button
                    onClick={() => setShowPhotos(!showPhotos)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showPhotos ? 'Ocultar' : 'Mostrar'} Fotos
                  </button>
                </div>
                
                {showPhotos && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Frontal</p>
                      <img 
                        src={selectedDriver.fotos.frontal} 
                        alt="Foto frontal"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Perfil Esquerdo</p>
                      <img 
                        src={selectedDriver.fotos.perfilEsquerdo} 
                        alt="Perfil esquerdo"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Perfil Direito</p>
                      <img 
                        src={selectedDriver.fotos.perfilDireito} 
                        alt="Perfil direito"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedDriver.status)}`}>
                  {getStatusIcon(selectedDriver.status)}
                  <span className="ml-2 capitalize">{selectedDriver.status}</span>
                </span>
              </div>

              {selectedDriver.motivoReprovacao && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Motivo da Reprovação</p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800">{selectedDriver.motivoReprovacao}</p>
                  </div>
                </div>
              )}

              {selectedDriver.status === 'pendente' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStatusChange(selectedDriver._id, 'aprovado')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => {
                      const motivo = prompt('Motivo da reprovação (opcional):');
                      handleStatusChange(selectedDriver._id, 'rejeitado', motivo || undefined);
                    }}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Reprovar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;