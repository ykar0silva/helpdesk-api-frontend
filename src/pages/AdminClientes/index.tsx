// src/pages/AdminClientes/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";

interface Cliente {
    id: number;
    nome: string;
    email: string;
    empresaDoCliente: string;
}

export function AdminClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    
    // Estados do formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [empresaDoCliente, setEmpresaDoCliente] = useState("");
    const [perfil, setPerfil] = useState("USUARIO"); // Valor padrão

    const loadClientes = async () => {
        try {
            const response = await api.get('/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error("Erro ao carregar clientes", error);
        }
    };

    useEffect(() => {
        loadClientes();
    }, []);

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nome,
                email,
                senha,
                empresaDoCliente,
                perfil,
                empresa: { id: 1 } // ID da sua empresa de TI
            };

            await api.post('/api/clientes', payload);
            alert("Cliente cadastrado com sucesso!");
            
            // Limpar form
            setNome("");
            setEmail("");
            setSenha("");
            setEmpresaDoCliente("");
            loadClientes();

        } catch (error) {
            console.error("Erro ao cadastrar", error);
            alert("Erro ao cadastrar cliente.");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h2>Gerenciar Clientes</h2>

                <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                    <h3>Novo Cliente</h3>
                    <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
                        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
                        
                        {/* Novos Campos Específicos de Cliente */}
                        <input 
                            type="text" 
                            placeholder="Empresa do Cliente (Ex: Colégio X)" 
                            value={empresaDoCliente} 
                            onChange={e => setEmpresaDoCliente(e.target.value)} 
                            required 
                        />
                        
                        <select value={perfil} onChange={e => setPerfil(e.target.value)}>
                            <option value="USUARIO">Usuário Padrão</option>
                            <option value="GESTOR">Gestor</option>
                        </select>

                        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Cadastrar</button>
                    </form>
                </div>

                <h3>Lista de Clientes</h3>
                <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Empresa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.empresaDoCliente}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}