const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// "Banco de dados" em memória (temporário)
let usuarios = [];

/**
 * 🔥 CADASTRO SEGURO
 */
app.post('/cadastro', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha obrigatórios' });
    }

    const existe = usuarios.find(u => u.email === email);

    if (existe) {
        return res.status(400).json({ mensagem: 'Usuário já existe' });
    }

    // criptografa senha
    const hash = await bcrypt.hash(senha, 10);

    usuarios.push({
        email,
        senha: hash
    });

    console.log(`✅ Usuário cadastrado: ${email}`);

    return res.json({ mensagem: 'Usuário criado com sucesso' });
});

/**
 * 🔐 LOGIN SEGURO
 */
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha obrigatórios' });
    }

    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
        return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    console.log(`🔑 Login realizado: ${email}`);

    return res.json({ mensagem: 'Login realizado com sucesso' });
});

/**
 * 📋 LISTAR USUÁRIOS (APENAS TESTE)
 */
app.get('/usuarios', (req, res) => {
    return res.json(usuarios);
});

/**
 * 🚀 SERVIDOR
 */
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});