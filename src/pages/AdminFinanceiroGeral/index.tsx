// src/pages/AdminFinanceiroGeral/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AdminDashboardDTO {
    totalPendente: number; // O valor que a API retorna
}

interface TokenPayload {
    id: number;
}

export function AdminFinanceiroGeral() {
    const [data, setData] = useState<AdminDashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Decodifica o token para saber qual é o ID da empresa logada
    const token = localStorage.getItem('helpti_token');
    const userPayload: TokenPayload = token ? jwtDecode(token) : { id: 0 };
    const empresaId = userPayload.id;

    // Função para buscar o total devido da empresa (reutiliza o endpoint do dashboard)
    const fetchFinanceiroData = async () => {
        if (!empresaId) return;

        try {
            setLoading(true);
            // Chama a API do Dashboard (que retorna o total devido)
            const response = await api.get(`/api/dashboard/admin`);
            setData(response.data);
        } catch (err) {
            console.error("Erro ao buscar dados financeiros:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceiroData();
    }, [empresaId]);

    if (loading) return <p style={{ padding: 20 }}>Carregando Painel Financeiro...</p>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Controle Financeiro Geral</h2>
                
                {/* --- CARD DE RESUMO --- */}
                <div style={{ 
                    border: '1px solid #dc3545', 
                    padding: '30px', 
                    borderRadius: '8px',
                    maxWidth: '400px',
                    background: '#fff0f0',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontSize: '1.2em', color: '#dc3545' }}>Dívida Total Pendente:</p>
                    <h1 style={{ margin: '10px 0' }}>
                        {data ? `R$ ${data.totalPendente.toFixed(2)}` : 'R$ 0.00'}
                    </h1>
                </div>
                
                {/* --- LINK PARA A GESTÃO DE PAGAMENTOS --- */}
                <h3 style={{ marginTop: '40px' }}>Gestão por Funcionário</h3>
                <p>Use esta área para visualizar os saldos e registrar pagamentos em lote:</p>
                <button 
                    onClick={() => navigate('/admin/tecnicos')}
                    style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Ver Lista de Técnicos para Pagamento
                </button>
            </div>
        </div>
    );
}