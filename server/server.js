const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('username:password')) {
      console.error('❌ ERRO: MongoDB URI não configurada corretamente!');
      console.error('📋 Configure sua string de conexão do MongoDB Atlas no arquivo .env');
      console.error('💡 Exemplo: MONGODB_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/trackia_drivers');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    console.error('💡 Verifique se sua string de conexão do MongoDB Atlas está correta no arquivo .env');
    process.exit(1);
  }
};

// Driver Schema
const driverSchema = new mongoose.Schema({
  nomeCompleto: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  empresa: { type: String, required: true },
  empresaId: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  senhaHash: { type: String, required: true },
  cnh: { type: String, default: '' },
  fotos: {
    frontal: { type: String, required: true },
    perfilEsquerdo: { type: String, required: true },
    perfilDireito: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado'], 
    default: 'pendente' 
  },
  motivoReprovacao: { type: String },
  dataCadastro: { type: Date, default: Date.now }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  empresa: { type: String, required: true },
  empresaId: { type: String, required: true },
  role: { type: String, default: 'admin' },
  dataCriacao: { type: Date, default: Date.now }
});

const Driver = mongoose.model('Driver', driverSchema);
const Admin = mongoose.model('Admin', adminSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'trackia_secret_2025';

// Middleware de autenticação
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Função para criar admin padrão
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ usuario: 'admin' });
    if (!existingAdmin) {
      const senhaHash = await bcrypt.hash('123456', 12);
      await Admin.create({
        usuario: 'admin',
        senhaHash,
        empresa: 'Empresa Demo',
        empresaId: 'demo123',
        role: 'admin'
      });
      console.log('Admin padrão criado: admin / 123456');
    }
  } catch (error) {
    console.error('Erro ao criar admin padrão:', error);
  }
};

// Rotas

// POST /api/drivers - Cadastro de motorista
app.post('/api/drivers', async (req, res) => {
  try {
    const { 
      nomeCompleto, 
      cpf, 
      empresa, 
      empresaId, 
      telefone, 
      email, 
      senha,
      cnh,
      fotos 
    } = req.body;

    // Validações
    if (!nomeCompleto || !cpf || !telefone || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    if (!fotos || !fotos.frontal || !fotos.perfilEsquerdo || !fotos.perfilDireito) {
      return res.status(400).json({ message: 'Todas as 3 fotos são obrigatórias' });
    }

    // Verificar se CPF já está cadastrado
    const cpfLimpo = cpf.replace(/\D/g, '');
    const existingDriver = await Driver.findOne({ cpf: cpfLimpo });
    if (existingDriver) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    // Verificar se email já está cadastrado
    const existingEmail = await Driver.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 12);

    // Criar motorista
    const driver = new Driver({
      nomeCompleto,
      cpf: cpfLimpo,
      empresa,
      empresaId,
      telefone,
      email,
      senhaHash,
      cnh: cnh || '',
      fotos,
      status: 'pendente'
    });

    await driver.save();

    res.status(201).json({ 
      message: 'Cadastro realizado com sucesso! Aguarde a aprovação.',
      driverId: driver._id 
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/drivers/status/:cpf - Consultar status
app.get('/api/drivers/status/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/\D/g, '');

    const driver = await Driver.findOne({ cpf: cpfLimpo }).select('-senhaHash -fotos');
    
    if (!driver) {
      return res.status(404).json({ message: 'CPF não encontrado' });
    }

    res.json(driver);

  } catch (error) {
    console.error('Erro ao consultar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /api/admin/login - Login do admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const admin = await Admin.findOne({ usuario });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senhaHash);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: admin._id, empresaId: admin.empresaId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        usuario: admin.usuario,
        empresa: admin.empresa,
        empresaId: admin.empresaId
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/admin/drivers - Listar motoristas da empresa
app.get('/api/admin/drivers', authenticateAdmin, async (req, res) => {
  try {
    const drivers = await Driver.find({ empresaId: req.admin.empresaId })
      .select('-senhaHash')
      .sort({ dataCadastro: -1 });

    const stats = {
      total: drivers.length,
      pendente: drivers.filter(d => d.status === 'pendente').length,
      aprovado: drivers.filter(d => d.status === 'aprovado').length,
      rejeitado: drivers.filter(d => d.status === 'rejeitado').length
    };

    res.json({ drivers, stats });

  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PATCH /api/admin/drivers/:id - Aprovar/reprovar motorista
app.patch('/api/admin/drivers/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, motivoReprovacao } = req.body;

    if (!['aprovado', 'rejeitado'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const driver = await Driver.findOne({ 
      _id: id, 
      empresaId: req.admin.empresaId 
    });

    if (!driver) {
      return res.status(404).json({ message: 'Motorista não encontrado' });
    }

    driver.status = status;
    if (status === 'rejeitado' && motivoReprovacao) {
      driver.motivoReprovacao = motivoReprovacao;
    }

    await driver.save();

    res.json({ message: `Motorista ${status} com sucesso!` });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /api/admin/link - Obter link de cadastro
app.get('/api/admin/link', authenticateAdmin, (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${baseUrl}/cadastro?empresaId=${req.admin.empresaId}`;
  
  res.json({ link });
});

// Rota para servir arquivos estáticos do frontend (para produção)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Inicializar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

startServer();