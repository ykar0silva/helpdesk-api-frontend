import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom'; // Adicionado useSearchParams
import axios from 'axios';
import { User, Building2, Mail, Lock, Phone, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import './cadastro.css';

// Configuração do Axios (Se você já tiver um arquivo api.ts, pode usar ele)
const api = axios.create({
    baseURL: 'http://localhost:8082'
});

export function Cadastro() {
    const navigate = useNavigate();
    
    // 1. CAPTURA O ID DA URL (Ex: /cadastro?empresa=2)
    const [searchParams] = useSearchParams();
    const empresaIdParam = searchParams.get('empresa'); 

    const [tipoPessoa, setTipoPessoa] = useState<'FISICA' | 'JURIDICA'>('FISICA');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        telefone: '',
        documento: '',
        empresaNome: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.senha !== formData.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        setIsLoading(true);

        try {
            // 2. MONTA O PACOTE PARA O BACKEND
            const payload = {
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                telefone: formData.telefone,
                
                // Remove caracteres não numéricos do CPF/CNPJ
                documento: formData.documento.replace(/\D/g, ''),
                
                tipo: tipoPessoa, // "FISICA" ou "JURIDICA"
                
                // Só manda nome da empresa se for PJ
                empresaNome: tipoPessoa === 'JURIDICA' ? formData.empresaNome : null,

                // 3. AQUI VAI O ID DA PRESTADORA (Se existir na URL)
                // Se for null, o Backend assume que é para a HelpTI (Matriz)
                empresaId: empresaIdParam ? Number(empresaIdParam) : null
            };

            await api.post('/api/auth/register', payload);

            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            navigate('/');

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao realizar cadastro.";
            alert("Erro: " + msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="cadastro-container">
            <div className="cadastro-content">
                
                <div className="header-box">
                    <h2>Crie sua conta</h2>
                    <p>Preencha seus dados para começar</p>
                    
                    {/* AVISO VISUAL SE FOR CONVITE */}
                    {empresaIdParam && (
                        <div style={{ 
                            backgroundColor: '#e6fffa', 
                            color: '#047857', 
                            padding: '10px', 
                            borderRadius: '8px', 
                            fontSize: '0.9rem',
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <CheckCircle2 size={16} />
                            <span>Cadastro vinculado ao parceiro (Código: {empresaIdParam})</span>
                        </div>
                    )}
                </div>

                <div className="type-selector">
                    <button
                        type="button"
                        className={tipoPessoa === 'FISICA' ? 'active' : ''}
                        onClick={() => setTipoPessoa('FISICA')}
                    >
                        <User size={20} />
                        Pessoa Física
                    </button>
                    <button
                        type="button"
                        className={tipoPessoa === 'JURIDICA' ? 'active' : ''}
                        onClick={() => setTipoPessoa('JURIDICA')}
                    >
                        <Building2 size={20} />
                        Empresa (PJ)
                    </button>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <div className="input-icon">
                            <User className="icon" size={18} />
                            <Input 
                                name="nome" 
                                placeholder="Seu nome" 
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {tipoPessoa === 'JURIDICA' && (
                        <div className="form-group">
                            <label>Nome da Empresa</label>
                            <div className="input-icon">
                                <Building2 className="icon" size={18} />
                                <Input 
                                    name="empresaNome" 
                                    placeholder="Razão Social ou Fantasia" 
                                    value={formData.empresaNome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>E-mail</label>
                        <div className="input-icon">
                            <Mail className="icon" size={18} />
                            <Input 
                                type="email" 
                                name="email" 
                                placeholder="seu@email.com" 
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label>Telefone</label>
                            <div className="input-icon">
                                <Phone className="icon" size={18} />
                                <Input 
                                    name="telefone" 
                                    placeholder="(XX) 9XXXX-XXXX" 
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}</label>
                            <div className="input-icon">
                                <FileText className="icon" size={18} />
                                <Input 
                                    name="documento" 
                                    placeholder={tipoPessoa === 'FISICA' ? '000.000.000-00' : '00.000.000/0001-00'} 
                                    value={formData.documento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label>Senha</label>
                            <div className="input-icon">
                                <Lock className="icon" size={18} />
                                <Input 
                                    type="password" 
                                    name="senha" 
                                    placeholder="••••••••" 
                                    value={formData.senha}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirmar Senha</label>
                            <div className="input-icon">
                                <Lock className="icon" size={18} />
                                <Input 
                                    type="password" 
                                    name="confirmarSenha" 
                                    placeholder="••••••••" 
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                        <ArrowRight size={20} />
                    </Button>
                </form>

                <div className="footer-link">
                    <p>Já tem uma conta? <Link to="/">Faça Login</Link></p>
                </div>
            </div>
        </div>
    );
}