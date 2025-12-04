// src/pages/AdminTecnicos/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar"; 
import { useNavigate } from "react-router-dom"; 
import { TecnicoFormModal } from "../../components/Tecnicos/TecnicoFormModal";

// Molde do Técnico (CORRIGIDO COM SENHA OPCIONAL)
interface Tecnico {
    id: number;
    nome: string;
    sobrenome?: string; 
    email: string;
    senha?: string; // <-- ADICIONADO (Opcional para satisfazer a tipagem do Modal)
    cpf?: string;
    telefone?: string;
    especialidades?: string;
    status?: string; 
    empresa?: { id: number; nomeFantasia: string }; 
}

export function AdminTecnicos() {
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    const [loading, setLoading] = useState(true);
    
    // ESTADOS DO MODAL/EDIÇÃO
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tecnicoParaEditar, setTecnicoParaEditar] = useState<Tecnico | null>(null); 
    
    const navigate = useNavigate(); 

    const loadTecnicos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/tecnicos');
            setTecnicos(response.data);
        } catch (error) {
            console.error("Erro ao carregar técnicos", error);
            // Se der erro 403, é permissão. Se der erro de rede, é API fora.
        } finally {
            setLoading(false);
        }
    };

    // Handlers do Modal
    const handleAddClick = () => {
        setTecnicoParaEditar(null); // Modo Cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTecnicoParaEditar(null);
        loadTecnicos(); // Recarrega a lista após o sucesso
    };

    useEffect(() => {
        loadTecnicos();
    }, []);


    return (
        <div>
            <Navbar />

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Gerenciar Técnicos</h2>
                
                {/* 1. BOTÃO NOVO CADASTRO */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button 
                        onClick={handleAddClick}
                        style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Novo Técnico
                    </button>
                </div>

                {/* 2. LISTA DE TÉCNICOS (Limpa e Clicável) */}
                {loading ? <p>Carregando...</p> : (
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                                <th style={{ padding: 10 }}>ID</th>
                                <th style={{ padding: 10, textAlign: 'left' }}>Nome Completo</th>
                                <th style={{ padding: 10, textAlign: 'left' }}>E-mail</th>
                                <th style={{ padding: 10 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tecnicos.map(tecnico => (
                                <tr 
                                    key={tecnico.id}
                                    style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    onClick={() => navigate(`/admin/tecnicos/${tecnico.id}`)} // Vai para a Tela de Detalhes
                                >
                                    <td style={{ padding: 10 }}>{tecnico.id}</td>
                                    <td style={{ padding: 10, textAlign: 'left' }}>{tecnico.nome} {tecnico.sobrenome}</td>
                                    <td style={{ padding: 10, textAlign: 'left' }}>{tecnico.email}</td>
                                    <td style={{ padding: 10 }}>
                                         <span style={{ 
                                             background: tecnico.status === 'ATIVO' ? '#28a745' : '#dc3545',
                                             color: 'white', padding: '2px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold'
                                         }}>
                                             {tecnico.status || 'N/A'}
                                         </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 3. O MODAL DE CADASTRO (Só usado para Criar Novo aqui) */}
            <TecnicoFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleCloseModal}
                initialData={tecnicoParaEditar}
            />
        </div>
    );
}