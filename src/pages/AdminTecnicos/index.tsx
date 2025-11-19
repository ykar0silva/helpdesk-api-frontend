// src/pages/AdminTecnicos/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar"; // Importa o menu

// Molde do Técnico (igual ao retorno do Java)
interface Tecnico {
    id: number;
    nome: string;
    email: string;
}

export function AdminTecnicos() {
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    
    // Estados para o formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // 1. Função para carregar a lista (GET)
    const loadTecnicos = async () => {
        try {
            const response = await api.get('/api/tecnicos');
            setTecnicos(response.data);
        } catch (error) {
            console.error("Erro ao carregar técnicos", error);
        }
    };

    // Carrega a lista assim que a página abre
    useEffect(() => {
        loadTecnicos();
    }, []);

    // 2. Função para criar novo técnico (POST)
    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Enviamos o ID da empresa fixo como 1 por enquanto (para o MVP)
            // Num sistema real, pegaríamos isso do token do Admin
            const payload = {
                nome,
                email,
                senha,
                empresa: { id: 1 } 
            };

            await api.post('/api/tecnicos', payload);
            
            alert("Técnico cadastrado com sucesso!");
            
            // Limpa o formulário e recarrega a lista
            setNome("");
            setEmail("");
            setSenha("");
            loadTecnicos();

        } catch (error) {
            console.error("Erro ao cadastrar", error);
            alert("Erro ao cadastrar. Verifique os dados.");
        }
    };

    return (
        <div>
            {/* Adiciona o Menu no topo */}
            <Navbar />

            <div style={{ padding: '20px' }}>
                <h2>Gerenciar Técnicos</h2>

                {/* --- Formulário de Cadastro --- */}
                <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                    <h3>Novo Técnico</h3>
                    <form onSubmit={handleCadastro} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <label>
                            Nome: <br />
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </label>
                        <label>
                            E-mail: <br />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </label>
                        <label>
                            Senha: <br />
                            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                        </label>
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>

                {/* --- Lista de Técnicos --- */}
                <h3>Equipe Atual</h3>
                <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tecnicos.map(tecnico => (
                            <tr key={tecnico.id}>
                                <td>{tecnico.id}</td>
                                <td>{tecnico.nome}</td>
                                <td>{tecnico.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}