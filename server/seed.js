const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
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

// Admin Schema
const adminSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  empresa: { type: String, required: true },
  empresaId: { type: String, required: true },
  role: { type: String, default: 'admin' },
  dataCriacao: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Seed data
const seedAdmins = [
  {
    usuario: 'admin',
    senha: '123456',
    empresa: 'Empresa Demo',
    empresaId: 'demo123'
  },
  {
    usuario: 'transporteabc',
    senha: 'abc123',
    empresa: 'Transporte ABC Ltda',
    empresaId: 'abc789'
  },
  {
    usuario: 'logisticaxyz',
    senha: 'xyz456',
    empresa: 'Logística XYZ S.A.',
    empresaId: 'xyz456'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing admins
    await Admin.deleteMany({});
    console.log('Admins existentes removidos');
    
    // Create new admins
    for (const adminData of seedAdmins) {
      const senhaHash = await bcrypt.hash(adminData.senha, 12);
      
      await Admin.create({
        usuario: adminData.usuario,
        senhaHash,
        empresa: adminData.empresa,
        empresaId: adminData.empresaId,
        role: 'admin'
      });
      
      console.log(`Admin criado: ${adminData.usuario} / ${adminData.senha} - ${adminData.empresa}`);
    }
    
    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Contas de admin criadas:');
    console.log('1. admin / 123456 - Empresa Demo');
    console.log('2. transporteabc / abc123 - Transporte ABC Ltda');
    console.log('3. logisticaxyz / xyz456 - Logística XYZ S.A.');
    console.log('\n🔗 Links de cadastro:');
    console.log('- Empresa Demo: /cadastro?empresaId=demo123');
    console.log('- Transporte ABC: /cadastro?empresaId=abc789');
    console.log('- Logística XYZ: /cadastro?empresaId=xyz456');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  }
};

seedDatabase();