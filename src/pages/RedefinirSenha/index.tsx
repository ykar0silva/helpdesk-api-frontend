import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";

export function RedefinirSenha() {
    const { token } = useParams(); 
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    
    // Estados para controlar o "Olhinho"
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Lógica de força da senha
    function getPasswordStrength(password: string) {
        if (!password) return { label: "", color: "#e0e0e0", width: "0%" };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 8 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;
        switch (strength) {
            case 0: return { label: "Fraca (Mínimo 8 caracteres)", color: "#ff4d4f", width: "33%" };
            case 1: return { label: "Mediana", color: "#faad14", width: "66%" };
            case 2: return { label: "Forte", color: "#52c41a", width: "100%" };
            default: return { label: "", color: "#e0e0e0", width: "0%" };
        }
    }

    const passwordStatus = getPasswordStrength(novaSenha);

    // Ícones SVG (Olho Aberto e Fechado)
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    );
    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.9 3M6.9 6.1c-2.9 1.6-5.5 4-6.9 5.9 3 7 10 7 10 7 1.7 0 3.4-.5 4.9-1.3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (novaSenha.length < 8) {
            alert("A senha precisa ter pelo menos 8 caracteres.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        setLoading(true);
        try {
            await api.post('/api/reset-password', { token, novaSenha });
            alert("Senha alterada com sucesso! Faça login.");
            navigate("/"); 
        } catch (error) {
            console.error(error);
            alert("Erro: Link inválido, expirado ou erro no servidor.");
            navigate("/recuperar-senha"); 
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#f0f2f5' }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Redefinir Senha</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* CAMPO NOVA SENHA */}
                    <div>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={mostrarSenha ? "text" : "password"} // Muda o tipo dinamicamente
                                placeholder="Nova Senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                style={{ width: '100%', padding: '10px', paddingRight: '40px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                required
                            />
                            {/* Botão do Olhinho */}
                            <button 
                                type="button" 
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {mostrarSenha ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        
                        {/* BARRA DE FORÇA */}
                        {novaSenha && (
                            <div style={{ marginTop: '5px' }}>
                                <div style={{ height: '4px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: passwordStatus.width, backgroundColor: passwordStatus.color, transition: 'all 0.3s ease' }} />
                                </div>
                                <span style={{ fontSize: '12px', color: passwordStatus.color, fontWeight: 'bold', marginTop: '4px', display: 'block' }}>
                                    {passwordStatus.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CAMPO CONFIRMAR SENHA */}
                    <div style={{ position: 'relative' }}>
                        <input 
                            type={mostrarConfirmarSenha ? "text" : "password"} 
                            placeholder="Confirmar Nova Senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            style={{ width: '100%', padding: '10px', paddingRight: '40px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            {mostrarConfirmarSenha ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    
                    <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.3s' }}>
                        {loading ? 'Salvando...' : 'Redefinir Senha'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#1890ff', textDecoration: 'none', fontSize: '14px' }}>Voltar para o Login</Link>
                </div>
            </div>
        </div>
    );
}