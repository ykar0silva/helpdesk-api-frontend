// src/pages/AdminDashboard/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api"; // O nosso Axios

// O "molde" dos dados que vamos receber (o DTO)
interface DashboardData {
    totalPendente: number;
}

export function AdminDashboard() {
    // 1. Criar um "estado" para guardar os dados do dashboard
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. useEffect: Roda este código UMA VEZ quando a página carrega
    useEffect(() => {
        // 3. Função para "buscar" os dados
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // 4. CHAMA A API! (O token JWT já está no 'api' por defeito)
                const response = await api.get('/api/dashboard/admin');

                // 5. Guarda os dados no estado
                setData(response.data);

            } catch (err) {
                console.error("Erro ao buscar dados do dashboard:", err);
                setError("Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // O array vazio [] garante que isto só roda UMA VEZ

    // 6. Lógica de renderização
    if (loading) {
        return <p>A carregar dados do dashboard...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Dashboard do Administrador</h2>

            {/* 7. Mostra os dados! */}
            <div>
                <h3>Total Pendente de Pagamento</h3>
                {/* Formata o número como dinheiro (R$) */}
                <h2>
                    {data ? `R$ ${data.totalPendente.toFixed(2)}` : 'R$ 0.00'}
                </h2>
            </div>

            {/* Aqui podemos adicionar os outros módulos (Cadastros, etc.) */}
        </div>
    );
}