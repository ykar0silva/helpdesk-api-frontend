import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";

interface TokenPayload {
    id: number; // O ID que acabamos de adicionar no Java
}

export function NovoChamado() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("BAIXA");
    const [arquivo, setArquivo] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('helpti_token');
        if (!token) return;

        const decoded = jwtDecode<TokenPayload>(token);

        // ADICIONE ESTES LOGS:
        console.log("Token Decodificado:", decoded);
        console.log("ID do Cliente extraído:", decoded.id);

        const clienteId = decoded.id;
        try {
            // 1. Pegar o ID do cliente logado de dentro do token
            const token = localStorage.getItem('helpti_token');
            if (!token) return;
            const decoded = jwtDecode<TokenPayload>(token);
            const clienteId = decoded.id;

            // 2. Montar o JSON do chamado
            const chamadoJson = JSON.stringify({
                titulo,
                descricao,
                prioridade,
                cliente: { id: clienteId },
                empresa: { id: 1 } // Fixo por enquanto (MVP)
            });

            // 3. Criar o FormData (obrigatório para enviar arquivos)
            const formData = new FormData();
            formData.append("chamado", chamadoJson); // Parte texto
            if (arquivo) {
                formData.append("anexos", arquivo); // Parte arquivo
            }

            // 4. Enviar para o backend
            await api.post('/api/chamados', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Importante!
                }
            });

            alert("Chamado aberto com sucesso!");
            navigate('/cliente/dashboard');

        } catch (error) {
            console.error("Erro ao abrir chamado", error);
            alert("Erro ao enviar. Tente novamente.");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Abrir Novo Chamado</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <label>Título:</label>
                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />

                    <label>Descrição do Problema:</label>
                    <textarea rows={5} value={descricao} onChange={e => setDescricao(e.target.value)} required />

                    <label>Prioridade:</label>
                    <select value={prioridade} onChange={e => setPrioridade(e.target.value)}>
                        <option value="BAIXA">Baixa</option>
                        <option value="MEDIA">Média</option>
                        <option value="ALTA">Alta</option>
                    </select>

                    <label>Print do Erro (Imagem):</label>
                    <input type="file" onChange={e => setArquivo(e.target.files ? e.target.files[0] : null)} />

                    <button type="submit" style={{ padding: '15px', background: '#007bff', color: '#fff', border: 'none', marginTop: '10px' }}>
                        Enviar Chamado
                    </button>
                </form>
            </div>
        </div>
    );
}