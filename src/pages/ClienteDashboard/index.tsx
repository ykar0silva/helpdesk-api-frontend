import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar"; // Vamos reutilizar a Navbar por enquanto

interface Chamado {
    id: number;
    titulo: string;
    status: string;
    dataAbertura: string;
}

export function ClienteDashboard() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const navigate = useNavigate();

    // Nota: Como ainda não criamos a rota "meus chamados" no backend, 
    // isso pode vir vazio ou com erro por enquanto, mas prepara o terreno.
    // O foco hoje é o botão "NOVO CHAMADO".
    useEffect(() => {
        // futuramente: api.get('/api/chamados/meus')...
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Meus Chamados</h2>
                    <button 
                        onClick={() => navigate('/cliente/novo-chamado')}
                        style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        + Abrir Novo Chamado
                    </button>
                </div>

                <p>Aqui aparecerá a lista dos seus chamados.</p>
                {/* Aqui entrará a tabela depois */}
            </div>
        </div>
    );
}