const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// "Banco de dados" em memória (Dica: Dados somem ao reiniciar no Render)
let usuarios = [];

// Rota de Cadastro (Ajustada para bater com seu HTML)
app.post('/usuario', async (req, res) => {
    const { nome, email, cpf, telefone, endereco, senha, metodo } = req.body;

    if (!email || !senha || !nome) {
        return res.status(400).json({ erro: 'Nome, Email e senha são obrigatórios' });
    }

    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        return res.status(400).json({ erro: 'Este e-mail já está cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
        nome,
        email,
        cpf,
        telefone,
        endereco,
        senha: hash,
        metodo,
        protocolo: Math.floor(100000 + Math.random() * 900000) // Gera um protocolo aleatório
    };

    usuarios.push(novoUsuario);
    console.log(`✅ Novo cadastro: ${nome} via ${metodo}`);
    return res.json({ mensagem: 'Usuário criado com sucesso' });
});

// Rota de Login (Ajustada para bater com seu HTML)
app.post('/login-acesso', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
        return res.status(401).json({ erro: 'Senha inválida' });
    }

    console.log(`🔑 Login realizado: ${usuario.nome}`);
    return res.json({ 
        usuario: usuario.nome, 
        protocolo: usuario.protocolo 
    });
});

// Rota para ver usuários (Apenas para seu teste)
app.get('/lista-usuarios', (req, res) => {
    res.json(usuarios);
});

// Página Inicial do Servidor
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});