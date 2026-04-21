const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const arquivoUsuarios = "./usuarios.json";
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Isso ajuda se você quiser subir o HTML junto)
app.use(express.static(path.join(__dirname)));

// Inicializa o banco de dados se não existir
if (!fs.existsSync(arquivoUsuarios)) {
    fs.writeFileSync(arquivoUsuarios, JSON.stringify([], null, 2));
}

// ROTA DE CADASTRO
app.post("/usuario", (req, res) => {
    try {
        const { nome, email, cpf, telefone, endereco, senha, metodo } = req.body;
        const dados = JSON.parse(fs.readFileSync(arquivoUsuarios, 'utf8'));

        // Validação de Duplicidade
        if (dados.find(u => u.email === email || u.cpf === cpf)) {
            return res.status(400).json({ ok: false, erro: "E-mail ou CPF já cadastrado!" });
        }

        const novoUsuario = {
            id: Date.now(),
            nome, email, cpf, telefone, endereco, senha,
            metodo: metodo || "Formulário",
            data_registro: new Date().toLocaleString("pt-BR")
        };
        
        dados.push(novoUsuario);
        fs.writeFileSync(arquivoUsuarios, JSON.stringify(dados, null, 2));
        
        console.log(`✅ Usuário cadastrado: ${nome}`);
        res.status(201).json({ ok: true, mensagem: "Cadastro realizado com sucesso!" });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({ ok: false, erro: "Erro ao salvar usuário." });
    }
});

// ROTA DE LOGIN
app.post("/login-acesso", (req, res) => {
    try {
        const { email, senha } = req.body;
        const dados = JSON.parse(fs.readFileSync(arquivoUsuarios, 'utf8'));

        const usuario = dados.find(u => u.email === email && u.senha === senha);

        if (!usuario) {
            return res.status(401).json({ ok: false, erro: "E-mail ou senha incorretos!" });
        }

        // Lógica de Logs de Acesso
        const nomePasta = usuario.nome.replace(/\s+/g, '_').toLowerCase();
        const pastaAcessos = path.join(__dirname, 'acessos');
        const caminhoUsuario = path.join(pastaAcessos, nomePasta);

        if (!fs.existsSync(pastaAcessos)) fs.mkdirSync(pastaAcessos);
        if (!fs.existsSync(caminhoUsuario)) fs.mkdirSync(caminhoUsuario);

        const protocolo = `PROT-${Date.now()}`;
        fs.writeFileSync(path.join(caminhoUsuario, 'acesso.txt'), `Entrou via ${usuario.metodo} em: ${new Date().toLocaleString()}\nProtocolo: ${protocolo}`);

        console.log(`🔑 Login realizado: ${usuario.nome}`);
        res.json({ 
            ok: true, 
            protocolo,
            usuario: usuario.nome,
            endereco: usuario.endereco,
            metodo: usuario.metodo
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ ok: false, erro: "Erro no servidor." });
    }
});

// CONFIGURAÇÃO DA PORTA (Essencial para o Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});