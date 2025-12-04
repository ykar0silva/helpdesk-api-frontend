// src/pages/AdminTecnicoDetalhes/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { TecnicoFormModal } from "../../components/Tecnicos/TecnicoFormModal"; // Importa o Modal

// Interfaces
interface ChamadoPendente {
    id: number;
    titulo: string;
    valorPendente: number;
    valorPago: number;
    dataFechamento: string;
}

// Interface completa do Técnico
interface TecnicoDetalhes {
    id: number;
    nome: string;
    sobrenome?: string;
    email: string;
    cpf?: string;
    telefone?: string;
    especialidades?: string;
    status?: string;
    empresa: { valorPorChamado: number };
}

function getStatusPagamento(chamado: ChamadoPendente, valorPorChamado: number): string {
    if (chamado.valorPendente === 0) return "Pago";
    if (chamado.valorPendente < valorPorChamado && chamado.valorPendente > 0) return "Parcial";
    return "Pendente";
}

export function AdminTecnicoDetalhes() {
    const { tecnicoId } = useParams<{ tecnicoId: string }>();
    const navigate = useNavigate();
    
    // Estados
    const [tecnico, setTecnico] = useState<TecnicoDetalhes | null>(null);
    const [chamados, setChamados] = useState<ChamadoPendente[]>([]);
    const [valorPagoInput, setValorPagoInput] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    
    // Estado do Modal de Edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const dividaTotal = chamados.reduce((sum, c) => sum + c.valorPendente, 0);

    // Carrega todos os dados (Técnico + Financeiro)
    const loadData = async () => {
        if (!tecnicoId) return;
        try {
            setLoading(true);
            // 1. Dados do Técnico
            const tecnicoRes = await api.get(`/api/tecnicos/${tecnicoId}`);
            setTecnico(tecnicoRes.data);

            // 2. Dados Financeiros (Chamados Pendentes)
            const chamadosRes = await api.get(`/api/chamados/tecnico/${tecnicoId}/pendentes`);
            setChamados(chamadosRes.data);
            
            // Preenche o input com o valor total
            const total = chamadosRes.data.reduce((sum: number, c: ChamadoPendente) => sum + c.valorPendente, 0);
            setValorPagoInput(total);
        } catch (error) {
            console.error("Erro ao carregar detalhes", error);
            alert("Erro ao carregar dados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [tecnicoId]);

    // Ação de Pagamento (FIFO)
    const handleRegistrarPagamento = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tecnicoId || valorPagoInput <= 0) return;

        if (valorPagoInput > dividaTotal) {
             if (!window.confirm("Valor maior que a dívida. Deseja continuar?")) return;
        }

        try {
            await api.post(`/api/chamados/tecnico/${tecnicoId}/pagar`, { valorPago: valorPagoInput });
            alert(`Pagamento registrado com sucesso!`);
            setValorPagoInput(0); 
            loadData(); // Recarrega tudo
        } catch (error) {
            alert("Erro ao registrar pagamento.");
        }
    };

    // Ação de Excluir
    const handleDelete = async () => {
        if(window.confirm(`ATENÇÃO: Deseja excluir o técnico ${tecnico?.nome}? Isso pode afetar históricos de chamados.`)){
            // TODO: Implementar DELETE na API
            alert("Funcionalidade de excluir pendente no backend.");
            // await api.delete(`/api/tecnicos/${tecnicoId}`);
            // navigate('/admin/tecnicos');
        }
    };

    if (loading || !tecnico) return <p style={{padding: 20}}>Carregando ficha do técnico...</p>;

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', paddingBottom: 50 }}>
            <Navbar />
            
            <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* CABEÇALHO: Navegação e Título */}
                <div style={{ marginBottom: 20 }}>
                    <button onClick={() => navigate('/admin/tecnicos')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px' }}>
                        ⬅ Voltar para Lista
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <h2 style={{ margin: 0 }}>Ficha do Técnico: {tecnico.nome} {tecnico.sobrenome}</h2>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                style={{ background: '#ffc107', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Editar Dados
                            </button>
                            <button 
                                onClick={handleDelete}
                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
                    
                    {/* BLOCO 1: INFORMAÇÕES PESSOAIS */}
                    <div style={{ background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginTop: 0 }}>Dados Cadastrais</h3>
                        <div style={{ display: 'grid', gap: 15, fontSize: '14px' }}>
                            <div>
                                <strong style={{ color: '#666', display: 'block', fontSize: '12px' }}>Status</strong>
                                <span style={{ background: tecnico.status === 'ATIVO' ? '#28a745' : '#dc3545', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: '12px' }}>
                                    {tecnico.status || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <strong style={{ color: '#666', display: 'block', fontSize: '12px' }}>E-mail</strong>
                                {tecnico.email}
                            </div>
                            <div>
                                <strong style={{ color: '#666', display: 'block', fontSize: '12px' }}>Telefone</strong>
                                {tecnico.telefone || '--'}
                            </div>
                            <div>
                                <strong style={{ color: '#666', display: 'block', fontSize: '12px' }}>CPF</strong>
                                {tecnico.cpf || '--'}
                            </div>
                            <div>
                                <strong style={{ color: '#666', display: 'block', fontSize: '12px' }}>Especialidades</strong>
                                {tecnico.especialidades || '--'}
                            </div>
                        </div>
                    </div>

                    {/* BLOCO 2: FINANCEIRO */}
                    <div style={{ background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                            <h3 style={{ margin: 0 }}>Financeiro</h3>
                            <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: dividaTotal > 0 ? '#dc3545' : '#28a745' }}>
                                Saldo Devedor: R$ {dividaTotal.toFixed(2)}
                            </span>
                        </div>

                        {/* Área de Pagamento */}
                        <div style={{ background: '#f8f9fa', padding: 15, marginTop: 20, borderRadius: 4, border: '1px solid #e9ecef' }}>
                            <strong style={{ display: 'block', marginBottom: 10 }}>Registrar Pagamento (FIFO)</strong>
                            <form onSubmit={handleRegistrarPagamento} style={{ display: 'flex', gap: 10 }}>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={valorPagoInput} 
                                    onChange={e => setValorPagoInput(Number(e.target.value))}
                                    style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                                />
                                <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '0 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
                                    Pagar
                                </button>
                            </form>
                        </div>

                        {/* Tabela de Pendências */}
                        <h4 style={{ marginTop: 20, marginBottom: 10 }}>Chamados Pendentes</h4>
                        {chamados.length === 0 ? (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhum valor pendente.</p>
                        ) : (
                            <table border={1} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#f0f0f0' }}>
                                        <th style={{ padding: 8 }}>ID</th>
                                        <th style={{ padding: 8 }}>Fechado em</th>
                                        <th style={{ padding: 8 }}>Título</th>
                                        <th style={{ padding: 8 }}>Valor Base</th>
                                        <th style={{ padding: 8 }}>A Pagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ padding: 8 }}>{c.id}</td>
                                            <td style={{ padding: 8 }}>{new Date(c.dataFechamento).toLocaleDateString()}</td>
                                            <td style={{ padding: 8, textAlign: 'left' }}>{c.titulo}</td>
                                            <td style={{ padding: 8 }}>R$ {tecnico.empresa.valorPorChamado.toFixed(2)}</td>
                                            <td style={{ padding: 8, fontWeight: 'bold', color: '#dc3545' }}>R$ {c.valorPendente.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE EDIÇÃO (Reutilizado) */}
            {tecnico && (
                <TecnicoFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => { setIsEditModalOpen(false); loadData(); }}
                    // Mapeia os dados para o formato do form (senha vazia para não alterar)
                    initialData={{ ...tecnico, senha: '', sobrenome: tecnico.sobrenome || '', cpf: tecnico.cpf || '', telefone: tecnico.telefone || '', especialidades: tecnico.especialidades || '', status: tecnico.status || 'ATIVO' }}
                />
            )}
        </div>
    );
}