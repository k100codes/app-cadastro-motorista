# Sistema de Cadastro de Motoristas - Trackia

Sistema completo e multi-empresa para cadastro de motoristas com captura biométrica facial e aprovação administrativa.

## 🚀 Funcionalidades

### Para Motoristas
- **Cadastro via link exclusivo** por empresa
- **Captura de 3 fotos faciais** obrigatórias (frontal, perfil esquerdo, perfil direito)
- **Formulário completo** com dados pessoais e senha
- **Consulta de status** do cadastro por CPF

### Para Administradores
- **Dashboard administrativo** com autenticação segura
- **Gestão de motoristas** da empresa com filtros e busca
- **Aprovação/reprovação** com motivo opcional
- **Geração automática** de links exclusivos
- **Exportação de dados** em CSV
- **Visualização de fotos** e informações completas

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Autenticação:** JWT + bcrypt
- **Captura de fotos:** getUserMedia API
- **Notificações:** react-hot-toast

## 📦 Instalação e Configuração

### 1. Clone e instale dependências
```bash
git clone <repo>
cd trackia-drivers-system
npm run setup
```

### 2. Configure o MongoDB Atlas
1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster e obtenha a string de conexão
3. Edite o arquivo `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/trackia_drivers
JWT_SECRET=seu_jwt_secret_super_seguro
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Popule o banco com dados de teste
```bash
npm run seed
```

### 4. Execute o projeto
```bash
npm run dev
```

O sistema estará rodando em:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 👥 Contas de Teste

Após executar o seed, você terá estas contas de admin:

| Usuário | Senha | Empresa | Link de Cadastro |
|---------|-------|---------|------------------|
| admin | 123456 | Empresa Demo | `/cadastro?empresaId=demo123` |
| transporteabc | abc123 | Transporte ABC Ltda | `/cadastro?empresaId=abc789` |
| logisticaxyz | xyz456 | Logística XYZ S.A. | `/cadastro?empresaId=xyz456` |

## 🔗 Fluxo de Uso

1. **Admin gera link** no painel administrativo
2. **Motorista acessa link** exclusivo da empresa
3. **Preenche formulário** e captura 3 fotos
4. **Envia cadastro** (status: pendente)
5. **Admin aprova/reprova** no painel
6. **Motorista consulta status** por CPF

## 🚀 Deploy

### Backend (Render/Railway)
1. Suba o código para seu repositório Git
2. Configure as variáveis de ambiente:
   - `MONGODB_URI`
   - `JWT_SECRET` 
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://seu-app.netlify.app`

### Frontend (Netlify)
1. Build do projeto: `npm run build`
2. Deploy da pasta `dist/`
3. Configure redirects para SPA

## 📁 Estrutura do Projeto

```
trackia-drivers-system/
├── src/                    # Frontend React
│   ├── pages/             # Páginas da aplicação
│   ├── App.tsx            # App principal
│   └── main.tsx          # Entry point
├── server/               # Backend Node.js
│   ├── server.js         # Servidor principal
│   ├── seed.js          # Script de seed
│   └── package.json     # Deps do backend
├── .env                 # Variáveis de ambiente
└── README.md           # Este arquivo
```

## 🔒 Segurança

- **Senhas hasheadas** com bcrypt (salt 12)
- **JWT tokens** com expiração de 24h
- **Middleware de autenticação** para rotas admin
- **Validação de dados** no frontend e backend
- **Isolamento multi-tenant** por empresaId

## 📊 Schema do Banco

### Coleção `drivers`
```javascript
{
  nomeCompleto: String,
  cpf: String (único),
  empresa: String,
  empresaId: String,
  telefone: String,
  email: String (único),
  senhaHash: String,
  cnh: String (opcional),
  fotos: {
    frontal: String (base64),
    perfilEsquerdo: String (base64),
    perfilDireito: String (base64)
  },
  status: String (pendente|aprovado|rejeitado),
  motivoReprovacao: String (opcional),
  dataCadastro: Date
}
```

### Coleção `admins`
```javascript
{
  usuario: String (único),
  senhaHash: String,
  empresa: String,
  empresaId: String (único),
  role: String,
  dataCriacao: Date
}
```

## 📡 API Endpoints

- `POST /api/drivers` - Cadastro de motorista
- `GET /api/drivers/status/:cpf` - Status do motorista
- `POST /api/admin/login` - Login admin
- `GET /api/admin/drivers` - Listar motoristas
- `PATCH /api/admin/drivers/:id` - Aprovar/reprovar
- `GET /api/admin/link` - Obter link exclusivo

## 🎯 Escalabilidade Multi-Empresa

- **Isolamento por `empresaId`** - cada empresa vê apenas seus motoristas
- **Links únicos** gerados automaticamente
- **Dashboard independente** por empresa
- **Dados segregados** no banco de dados
- **Autenticação isolada** por contexto empresarial

## 📱 Responsividade

- **Mobile-first** design
- **Breakpoints:** 768px (tablet), 1024px (desktop)
- **Interface adaptativa** para todos os dispositivos
- **Captura de fotos** otimizada para mobile

---

🎉 **Sistema pronto para produção e uso imediato!**