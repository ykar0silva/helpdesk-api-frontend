// src/pages/AdminChamados/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { useNavigate } from "react-router-dom"; // Para ir para a tela de detalhes

// Tipos base para o Chamado
interface Chamado {
    id: number;
    titulo: string;
    prioridade: string;
    status: string;
    tecnico?: { nome: string; };
    cliente: { nome: string; };
    dataAbertura: string;
}

export function AdminChamados() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadChamados = async () => {
        try {
            // Busca TODOS os chamados da empresa (não apenas os em aberto)
            const response = await api.get('/api/chamados/empresa/1');
            if (Array.isArray(response.data)) {
                // Ordena do mais novo para o mais antigo (melhor para dashboard)
                const ordenados = response.data.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime());
                setChamados(ordenados);
            }
        } catch (error) {
            console.error("Erro ao buscar chamados globais", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChamados();
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Dashboard Operacional: Fila Geral</h2>
                {loading ? <p>Carregando...</p> : (
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                        <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                                <th style={{ padding: '10px' }}>ID</th>
                                <th style={{ padding: '10px' }}>Título</th>
                                <th style={{ padding: '10px' }}>Cliente</th>
                                <th style={{ padding: '10px' }}>Proprietário</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamados.map(chamado => (
                                <tr key={chamado.id}>
                                    <td style={{ padding: '10px' }}>{chamado.id}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{chamado.titulo}</td>
                                    <td style={{ padding: '10px' }}>{chamado.cliente.nome}</td>
                                    <td style={{ padding: '10px' }}>
                                        {chamado.tecnico ? chamado.tecnico.nome : <strong>NENHUM</strong>}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ 
                                            background: chamado.status === 'FECHADO' ? 'green' : chamado.status === 'ABERTO' ? '#ffc107' : '#17a2b8',
                                            padding: '5px 10px', borderRadius: '15px', color: '#fff', fontSize: '12px'
                                        }}>
                                            {chamado.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <button 
                                            onClick={() => navigate(`/chamados/${chamado.id}`)}
                                            style={{ background: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}