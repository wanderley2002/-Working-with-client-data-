
    let redeAtual = "";
    // IMPORTANTE: Mude para o SEU IP (o mesmo que você usa para abrir o site no celular)
    const URL_API = "http://192.168.15.5:3000"; 

    function mostrarLogin(tipo) {
        redeAtual = tipo;
        document.getElementById("cadastro").classList.remove("ativa");
        document.getElementById("login").classList.add("ativa");
        
        const titulo = document.getElementById("tituloLogin");
        // Ajuste para pegar qualquer rede social
        titulo.innerText = "Login via " + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    }

    function voltar() {
        document.getElementById("login").classList.remove("ativa");
        document.getElementById("cadastro").classList.add("ativa");
    }

    async function enviar() {
        const campos = ["nome", "email", "cpf", "telefone", "endereco"];
        const dados = {};
        
        campos.forEach(campo => {
            const el = document.getElementById(campo);
            if(el) dados[campo] = el.value;
        });

        if (!dados.nome || !dados.email) return alert("Preencha ao menos Nome e E-mail!");

        try {
            const res = await fetch(`${URL_API}/usuario`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ " + (data.mensagem || "Sucesso!"));
                campos.forEach(campo => document.getElementById(campo).value = "");
            } else {
                // Aqui o servidor avisa se o CPF ou Email já existe
                alert("❌ " + (data.erro || "Erro ao salvar"));
            }
        } catch (e) { 
            alert("📡 Erro: O servidor (Node) está desligado ou o IP mudou!"); 
        }
    }

    async function enviarLogin() {
        const email = document.getElementById("emailLogin").value;
        const senha = document.getElementById("senhaLogin").value;

        try {
            // Mudamos de localhost para URL_API (seu IP)
            const res = await fetch(`${URL_API}/login-social`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rede: redeAtual, email, senha })
            });
            
            const data = await res.json();
            alert(data.mensagem || data.erro);
            
            if (data.ok) voltar();
        } catch (e) { 
            alert("📡 Erro de conexão com o servidor de login."); 
        }
    }
