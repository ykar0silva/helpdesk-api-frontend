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
    const [hoveredId, setHoveredId] = useState<number | null>(null);


    const loadChamados = async () => {
        setLoading(true);
        // Em um ambiente de produção, este ID viria do JWT do Admin.
        // Por enquanto, usamos o ID fixo do MVP: Empresa 1
        const empresaId = 1; 

        try {
            // CHAMA O NOVO ENDPOINT FILTRADO PELA EMPRESA
            const response = await api.get(`/api/chamados/empresa/${empresaId}/dashboard`);
            
            if (Array.isArray(response.data)) {
                setChamados(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar chamados do administrador", error);
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
                                <th style={{ padding: '10px' }}>Data Abertura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamados.map(chamado => (
                                <tr 
                                    key={chamado.id} 
                                    // <-- APLICAÇÃO DO HOVER -->
                                    style={{ 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s', 
                                        backgroundColor: hoveredId === chamado.id ? 'rgba(239, 128, 0, 0.1)' : 'white'
                                    }} 
                                    onClick={() => navigate(`/chamados/${chamado.id}`)}
                                    onMouseEnter={() => setHoveredId(chamado.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    // <-- FIM DO HOVER -->
                                >
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
                                        {new Date(chamado.dataAbertura).toLocaleDateString()}
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