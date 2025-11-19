// src/pages/AdminDashboard/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar"; // <-- 1. IMPORTE O MENU

interface DashboardData {
    totalPendente: number;
}

export function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/dashboard/admin');
                setData(response.data);
            } catch (err) {
                console.error("Erro ao buscar dados", err);
                setError("Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            {/* 2. ADICIONE O MENU AQUI NO TOPO */}
            <Navbar />

            <div style={{ padding: '20px' }}>
                <h2>Dashboard do Administrador</h2>
                
                <div style={{ 
                    border: '1px solid #ccc', 
                    padding: '20px', 
                    borderRadius: '8px',
                    maxWidth: '300px',
                    marginTop: '20px'
                }}>
                    <h3>Total Pendente</h3>
                    <h2 style={{ color: '#d32f2f' }}>
                        {data ? `R$ ${data.totalPendente.toFixed(2)}` : 'R$ 0.00'}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                        Valor a ser pago aos técnicos
                    </p>
                </div>
            </div>
        </div>
    );
}