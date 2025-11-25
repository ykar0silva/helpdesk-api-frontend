// src/components/Tecnicos/TecnicoFormModal.tsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

// Tipagem dos dados do técnico (inclui os 9 campos)
interface TecnicoFormData {
    id?: number;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
    especialidades: string;
    status: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Função para recarregar a lista após o sucesso
    initialData?: TecnicoFormData | null; // Usado para o modo Edição
}

// Interface para o Payload do Token (pegar o ID da Empresa)
interface TokenPayload {
    id: number;
}

export const TecnicoFormModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {

    // 1. Estado do Formulário
    const [formData, setFormData] = useState<TecnicoFormData>({
        nome: '', sobrenome: '', email: '', senha: '',
        cpf: '', telefone: '', especialidades: '', status: 'ATIVO' // STATUS PADRÃO
    });
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;

    // 2. Pré-preencher em modo Edição ou resetar o formulário
    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                id: initialData.id,
                nome: initialData.nome,
                sobrenome: initialData.sobrenome || '', // Novo
                email: initialData.email,
                senha: '', // Não pré-preenche a senha
                cpf: initialData.cpf || '',
                telefone: initialData.telefone || '',
                especialidades: initialData.especialidades || '',
                status: initialData.status || 'ATIVO', // Novo
            });
        } else {
            // Reseta para o modo Cadastro
            setFormData({ nome: '', sobrenome: '', email: '', senha: '', cpf: '', telefone: '', especialidades: '', status: 'ATIVO' });
        }
    }, [isEditMode, initialData]);

    // 3. Obter ID da Empresa (do Token Admin)
    const token = localStorage.getItem('helpti_token');
    const adminPayload: TokenPayload = token ? jwtDecode(token) : { id: 0 };
    const empresaId = adminPayload.id;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode ? `/api/tecnicos/${formData.id}` : '/api/tecnicos';
        const method = isEditMode ? 'put' : 'post';

        // Prepara o payload (remove a senha se for PUT e estiver vazia, como no Java)
        const payload = {
            ...formData,
            empresa: { id: empresaId },
            senha: (isEditMode && !formData.senha) ? undefined : formData.senha // NÃO ENVIA SENHA VAZIA EM PUT
        };

        try {
            await api({ method, url, data: payload });
            alert(`Técnico ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
            onSuccess(); // Fecha o modal e recarrega a lista
        } catch (error) {
            alert(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} o técnico.`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // --- ESTRUTURA VISUAL DO MODAL ---
    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    {isEditMode ? `Editar: ${formData.nome} ${formData.sobrenome || ''}` : 'Cadastrar Novo Técnico'}
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>

                    {/* Linha 1: Nome e Sobrenome */}
                    <div style={formRowStyle}>
                        <div>
                            <label style={labelStyle}>Nome:</label>
                            <input name="nome" type="text" value={formData.nome} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Sobrenome:</label>
                            <input name="sobrenome" type="text" value={formData.sobrenome} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    {/* Linha 2: Email e Senha */}
                    <div style={formRowStyle}>
                        <div>
                            <label style={labelStyle}>Email:</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Senha {!isEditMode && <span>*</span>}:</label>
                            <input
                                name="senha"
                                type="password"
                                value={formData.senha}
                                onChange={handleChange}
                                required={!isEditMode}
                                placeholder={isEditMode ? 'Deixe vazio para não alterar' : ''}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Linha 3: CPF e Telefone/WhatsApp */}
                    <div style={formRowStyle}>
                        <div>
                            <label style={labelStyle}>CPF:</label>
                            <input name="cpf" type="text" value={formData.cpf} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Telefone/WhatsApp:</label>
                            <input name="telefone" type="text" value={formData.telefone} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    {/* Linha 4: Status (Dropdown) e Especialidades */}
                    <div style={formRowStyle}>
                        {/* ------------------------------------------------------------- */}
                        {/* NOVO BLOCO: STATUS (SÓ APARECE SE FOR MODO EDIÇÃO) */}
                        {isEditMode && (
                            <div style={formRowStyle}>
                                <div>
                                    <label style={labelStyle}>Status:</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                        style={{ ...inputStyle, padding: '10px' }}
                                    >
                                        <option value="ATIVO">ATIVO</option>
                                        <option value="INATIVO">INATIVO</option>
                                        <option value="FERIAS">FÉRIAS</option>
                                    </select>
                                </div>
                                <div style={{ visibility: 'hidden' }}>
                                    {/* Espaço Vazio para manter o grid alinhado */}
                                </div>
                            </div>
                        )}
                        {/* ------------------------------------------------------------- */}
                        <div>
                            <label style={labelStyle}>Especialidades (separadas por vírgula):</label>
                            <textarea
                                name="especialidades"
                                value={formData.especialidades}
                                onChange={handleChange}
                                style={{ ...inputStyle, width: '100%', minHeight: '80px' }}
                            />
                        </div>
                    </div>


                    {/* Botões de Ação */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" disabled={loading} style={{ ...buttonStyle, background: isEditMode ? '#ffc107' : '#28a745', flex: 1 }}>
                            {loading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Cadastrar')}
                        </button>
                        <button type="button" onClick={onClose} style={{ ...buttonStyle, background: '#dc3545', flex: 1 }}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Estilos Simples (Para que o Modal funcione visualmente) ---
const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalContentStyle: React.CSSProperties = {
    background: 'white', padding: '30px', borderRadius: '10px',
    maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto'
};
const formRowStyle: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'
};
const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em'
};
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px'
};
const buttonStyle: React.CSSProperties = {
    padding: '10px 15px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
};