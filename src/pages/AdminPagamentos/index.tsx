// src/pages/AdminPagamentos/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { jwtDecode } from "jwt-decode"; // Para ler o ID da Empresa do token

// Modelos de Dados
interface ChamadoPendente {
    id: number;
    titulo: string;
    valorPendente: number;
    dataAbertura: string;
    tecnico: { nome: string };
}

interface TokenPayload {
    id: number; // ID da Empresa/Admin (que injetamos no token)
}

export function AdminPagamentos() {
    const [chamados, setChamados] = useState<ChamadoPendente[]>([]);
    const [valorPago, setValorPago] = useState<number>(0);
    const [empresaId, setEmpresaId] = useState<number | null>(null);

    // Calcula a dívida total
    const dividaTotal = chamados.reduce((sum, chamado) => sum + chamado.valorPendente, 0);

    // 1. Função para buscar a lista de chamados pendentes
    const loadChamados = async (eId: number) => {
        try {
            const response = await api.get(`/api/chamados/empresa/${eId}/pendentes`);
            setChamados(response.data);
            // Preenche o campo de pagamento com o valor total devido
            setValorPago(response.data.reduce((sum: number, c: ChamadoPendente) => sum + c.valorPendente, 0));
        } catch (error) {
            console.error("Erro ao carregar lista de pagamentos", error);
        }
    };

    // 2. useEffect: Roda UMA VEZ ao carregar para pegar o ID do Admin
    useEffect(() => {
        const token = localStorage.getItem('helpti_token');
        if (token) {
            const decoded = jwtDecode<TokenPayload>(token);
            const adminId = decoded.id; // O ID do Admin é o ID da Empresa
            setEmpresaId(adminId);
            loadChamados(adminId);
        }
    }, []);

    // 3. Função para registrar o pagamento (PUT /api/chamados/empresa/{id}/pagar)
    const handleRegistrarPagamento = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!empresaId || valorPago <= 0) {
            alert("Valor inválido ou empresa não logada.");
            return;
        }

        try {
            // Chamada PUT para o backend com o valor total a ser aplicado
            await api.post(`/api/chamados/empresa/${empresaId}/pagar`, {
                valorPago: valorPago
            });
            
            alert(`Pagamento de R$ ${valorPago.toFixed(2)} registrado com sucesso!`);
            setValorPago(0); // Limpa o campo
            loadChamados(empresaId); // Recarrega a lista para mostrar os novos saldos
        } catch (error) {
            alert("Erro ao registrar pagamento. Verifique o console.");
            console.error(error);
        }
    };

    if (!empresaId) return <p>Carregando dados do administrador...</p>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Controle de Pagamentos de Técnicos</h2>

                {/* --- SEÇÃO DE PAGAMENTO EM LOTE --- */}
                <div style={{ border: '1px solid #007bff', padding: '20px', borderRadius: '8px', marginBottom: '30px', background: '#e9f5ff' }}>
                    <h3>Registar Pagamento em Lote</h3>
                    <p>Total Devido: <strong style={{ color: 'red' }}>R$ {dividaTotal.toFixed(2)}</strong></p>
                    
                    <form onSubmit={handleRegistrarPagamento} style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
                        <label>
                            Valor a Pagar:
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0.01"
                                value={valorPago} 
                                onChange={e => setValorPago(Number(e.target.value))} 
                                required 
                                style={{ padding: '8px', marginLeft: '10px' }}
                            />
                        </label>
                        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Registrar Pagamento
                        </button>
                    </form>
                    <p style={{ fontSize: '12px', marginTop: '10px', color: '#333' }}>
                        *O sistema fará a baixa nos chamados mais antigos primeiro (FIFO) e registrará o saldo pendente (PARCIAL).
                    </p>
                </div>

                {/* --- LISTA DE CHAMADOS PENDENTES --- */}
                <h3>Chamados com Saldo Pendente ({chamados.length})</h3>
                <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th>ID</th>
                            <th>Aberto em</th>
                            <th>Técnico</th>
                            <th>Título</th>
                            <th>Saldo Pendente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chamados.map(chamado => (
                            <tr key={chamado.id}>
                                <td>{chamado.id}</td>
                                <td>{new Date(chamado.dataAbertura).toLocaleDateString()}</td>
                                <td>{chamado.tecnico.nome}</td>
                                <td>{chamado.titulo}</td>
                                <td><strong style={{ color: 'red' }}>R$ {chamado.valorPendente.toFixed(2)}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!chamados.length && <p>Nenhum pagamento pendente no momento.</p>}
            </div>
        </div>
    );
}