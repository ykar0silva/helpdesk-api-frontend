// src/pages/AdminTecnicoPagamento/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { useParams } from "react-router-dom"; // Para pegar o ID do técnico

// Modelos de Dados
interface ChamadoPendente {
    id: number;
    titulo: string;
    valorPendente: number;
    valorPago: number; // Para calcular o status Parcial
    dataFechamento: string;
    // ... outros campos (Categoria, etc., se quiser exibir)
}

// Para a lógica de exibição do status
function getStatusPagamento(chamado: ChamadoPendente, valorPorChamado: number): string {
    if (chamado.valorPendente === 0) {
        return "Pago";
    }
    if (chamado.valorPendente < valorPorChamado && chamado.valorPendente > 0) {
        return "Parcial";
    }
    return "Pendente"; // Deve ser igual ao valorPorChamado
}

export function AdminTecnicoPagamento() {
    const { tecnicoId } = useParams<{ tecnicoId: string }>();
    const [chamados, setChamados] = useState<ChamadoPendente[]>([]);
    const [tecnicoNome, setTecnicoNome] = useState("Carregando...");
    const [valorPagoInput, setValorPagoInput] = useState<number>(0);
    const [valorPorChamado, setValorPorChamado] = useState(0); // Necessário para a lógica Parcial/Pendente

    // Calcula a dívida total do técnico
    const dividaTotal = chamados.reduce((sum, chamado) => sum + chamado.valorPendente, 0);

    // Funções de Carregamento e Pagamento
    const loadData = async () => {
        if (!tecnicoId) return;
        try {
            // 1. Pega os dados do técnico (para o nome e valor/chamado)
            const tecnicoResponse = await api.get(`/api/tecnicos/${tecnicoId}`);
            setTecnicoNome(tecnicoResponse.data.nome);
            setValorPorChamado(tecnicoResponse.data.empresa.valorPorChamado); // Pega o valor da empresa

            // 2. Pega a lista de chamados pendentes
            const chamadosResponse = await api.get(`/api/chamados/tecnico/${tecnicoId}/pendentes`);
            setChamados(chamadosResponse.data);
            
            // Preenche o campo de pagamento com o valor total devido por padrão
            const total = chamadosResponse.data.reduce((sum: number, c: ChamadoPendente) => sum + c.valorPendente, 0);
            setValorPagoInput(total);

        } catch (error) {
            console.error("Erro ao carregar dados do técnico e pagamentos.", error);
        }
    };

    const handleRegistrarPagamento = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tecnicoId || valorPagoInput <= 0) {
            alert("Valor inválido.");
            return;
        }

        if (valorPagoInput > dividaTotal) {
             if (!window.confirm("O valor pago é maior que a dívida total. Deseja registrar assim mesmo? O valor excedente será ignorado.")) {
                return;
             }
        }

        try {
            await api.post(`/api/chamados/tecnico/${tecnicoId}/pagar`, {
                valorPago: valorPagoInput
            });
            
            alert(`Pagamento de R$ ${valorPagoInput.toFixed(2)} para ${tecnicoNome} registrado com sucesso!`);
            setValorPagoInput(0); 
            loadData(); // Recarrega a lista
        } catch (error) {
            alert("Erro ao registrar pagamento. Verifique o console.");
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, [tecnicoId]);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Financeiro: Pagamentos de {tecnicoNome}</h2>
                <p>Valor por Chamado na Empresa: <strong>R$ {valorPorChamado.toFixed(2)}</strong></p>

                {/* --- SEÇÃO DE PAGAMENTO EM LOTE --- */}
                <div style={{ border: '1px solid #007bff', padding: '20px', borderRadius: '8px', marginBottom: '30px', background: '#e9f5ff' }}>
                    <h3>Pagamento em Lote</h3>
                    <p>Dívida Total Pendente: <strong style={{ color: 'red', fontSize: '1.2em' }}>R$ {dividaTotal.toFixed(2)}</strong></p>
                    
                    <form onSubmit={handleRegistrarPagamento} style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
                        <label>
                            Valor a Pagar:
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0.01"
                                value={valorPagoInput} 
                                onChange={e => setValorPagoInput(Number(e.target.value))} 
                                required 
                                style={{ padding: '8px', marginLeft: '10px' }}
                            />
                        </label>
                        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Pagar em Lote
                        </button>
                    </form>
                    <p style={{ fontSize: '12px', marginTop: '10px', color: '#333' }}>
                        *O pagamento será aplicado nos chamados mais antigos primeiro (FIFO).
                    </p>
                </div>

                {/* --- LISTA DE CHAMADOS PENDENTES --- */}
                <h3>Chamados com Saldo Pendente ({chamados.length})</h3>
                <table border={1} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th>ID</th>
                            <th>Fechado em</th>
                            <th>Título</th>
                            <th>Valor Total</th>
                            <th>Saldo Pendente</th>
                            <th>Status Pag.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chamados.map(chamado => (
                            <tr key={chamado.id}>
                                <td>{chamado.id}</td>
                                <td>{new Date(chamado.dataFechamento).toLocaleDateString()}</td>
                                <td>{chamado.titulo}</td>
                                <td>R$ {valorPorChamado.toFixed(2)}</td> {/* O valor total é o valor base da empresa */}
                                <td><strong style={{ color: chamado.valorPendente > 0 ? 'red' : 'green' }}>R$ {chamado.valorPendente.toFixed(2)}</strong></td>
                                <td>
                                    <span style={{ 
                                        padding: '5px 10px', 
                                        borderRadius: '15px', 
                                        color: '#fff', 
                                        fontSize: '12px',
                                        background: getStatusPagamento(chamado, valorPorChamado) === 'Pago' ? '#28a745' : (getStatusPagamento(chamado, valorPorChamado) === 'Parcial' ? '#ffc107' : '#dc3545')
                                    }}>
                                        {getStatusPagamento(chamado, valorPorChamado)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!chamados.length && <p>O técnico {tecnicoNome} não tem pagamentos pendentes.</p>}
            </div>
        </div>
    );
}