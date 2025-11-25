// src/pages/AdminTecnicos/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar"; 
import { useNavigate } from "react-router-dom"; 
import { TecnicoFormModal } from "../../components/Tecnicos/TecnicoFormModal"; // <-- NOVO IMPORT

// Molde do Técnico (Completo, deve bater com o que a API retorna)
interface Tecnico {
    id: number;
    nome: string;
    sobrenome?: string; 
    email: string;
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
        } finally {
            setLoading(false);
        }
    };

    // Handlers do Modal
    const handleEditClick = (tecnico: Tecnico) => {
        setTecnicoParaEditar(tecnico);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setTecnicoParaEditar(null); // Modo Cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTecnicoParaEditar(null);
        loadTecnicos(); // Recarrega a lista após o sucesso
    };
    
    // TODO: Implementar a chamada DELETE
    const handleDelete = (id: number) => {
        if(window.confirm(`Tem certeza que deseja deletar o Técnico #${id}?`)){
            alert("Ação de Deletar pendente!");
            // TODO: Chamar a API DELETE /api/tecnicos/{id}
        }
    }


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
                
                {/* REMOVEMOS O FORMULÁRIO INLINE ANTIGO */}

                {/* 2. LISTA DE TÉCNICOS (Atualizada com 6 colunas) */}
                {loading ? <p>Carregando...</p> : (
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                                <th>ID</th>
                                <th>Nome Completo</th>
                                <th>E-mail</th>
                                <th>Telefone</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tecnicos.map(tecnico => (
                                <tr key={tecnico.id}>
                                    <td>{tecnico.id}</td>
                                    <td>{tecnico.nome} {tecnico.sobrenome}</td>
                                    <td>{tecnico.email}</td>
                                    <td>{tecnico.telefone || 'N/A'}</td>
                                    <td>
                                        <span style={{ 
                                            background: tecnico.status === 'ATIVO' ? '#28a745' : '#dc3545',
                                            color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '12px'
                                        }}>
                                            {tecnico.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '5px' }}>
                                        {/* Botão Gerenciar Pagamentos */}
                                        <button 
                                            onClick={() => navigate(`/admin/tecnicos/${tecnico.id}/pagamentos`)}
                                            style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', marginRight: '5px' }}
                                        >
                                            💰 Pagamentos
                                        </button>
                                        
                                        {/* Botão Editar (Abre o Modal) */}
                                        <button 
                                            onClick={() => handleEditClick(tecnico)}
                                            style={{ background: '#ffc107', color: 'black', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', marginRight: '5px' }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(tecnico.id)}
                                            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 3. O MODAL DE CADASTRO/EDIÇÃO */}
            <TecnicoFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleCloseModal} // Fechar e recarregar a lista
                initialData={tecnicoParaEditar}
            />
        </div>
    );
}