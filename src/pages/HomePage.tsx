import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Camera, CheckCircle, ArrowRight, Building2, UserCheck, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                <Camera className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sistema de Cadastro
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Trackia Drivers
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Plataforma completa para cadastro de motoristas com captura biométrica facial 
              e aprovação administrativa multi-empresa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cadastro"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Fazer Cadastro
              </Link>
              <Link
                to="/status"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
              >
                Consultar Status
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema completo e seguro para gestão de motoristas com tecnologia de ponta
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                <Users className="h-12 w-12 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cadastro Simples
              </h3>
              <p className="text-gray-600">
                Motoristas acessam via link exclusivo da empresa e preenchem 
                formulário completo com dados pessoais
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 mb-6 transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                <Camera className="h-12 w-12 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Captura Biométrica
              </h3>
              <p className="text-gray-600">
                Sistema captura 3 fotos faciais obrigatórias (frontal e perfis) 
                usando tecnologia de câmera avançada
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 mb-6 transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                <Shield className="h-12 w-12 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Aprovação Segura
              </h3>
              <p className="text-gray-600">
                Administradores aprovam ou reprovam cadastros com total 
                segurança e controle multi-empresa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fluxo do Sistema
            </h2>
            <p className="text-xl text-gray-600">
              Processo otimizado em 4 etapas simples
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Admin Gera Link</h3>
                <p className="text-gray-600 text-sm">
                  Gestor da frota gera link exclusivo no painel administrativo
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Motorista Cadastra</h3>
                <p className="text-gray-600 text-sm">
                  Acessa link, preenche dados e captura 3 fotos faciais
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Admin Aprova</h3>
                <p className="text-gray-600 text-sm">
                  Gestor analisa dados e fotos, aprovando ou reprovando
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Status Atualizado</h3>
                <p className="text-gray-600 text-sm">
                  Motorista consulta status e recebe feedback do processo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Faça seu cadastro agora ou consulte o status do seu processo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cadastro"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
            >
              Fazer Cadastro
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/status"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Consultar Status
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Access */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Acesso Administrativo
          </h3>
          <p className="text-gray-300 mb-6">
            Gestores de frota podem acessar o painel administrativo
          </p>
          <Link
            to="/admin/login"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Painel Administrativo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;