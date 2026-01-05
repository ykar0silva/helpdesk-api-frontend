import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export function RedefinirSenha() {
    // Pega o token da URL (definido na rota como :token)
    const { token } = useParams(); 
    
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        setLoading(true);
        try {
            // Envia o token e a senha para o Backend
            await api.post('/api/reset-password', { 
                token: token, 
                novaSenha: novaSenha 
            });
            
            alert("Senha alterada com sucesso! Faça login.");
            navigate("/"); // Manda pro login
        } catch (error) {
            console.error(error);
            alert("Erro: Link inválido ou expirado.");
            navigate("/recuperar-senha"); // Manda pedir outro link
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ 
            height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' 
        }}>
            <div style={{ 
                backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Nova Senha</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <input 
                        type="password" 
                        placeholder="Nova Senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />

                    <input 
                        type="password" 
                        placeholder="Confirmar Nova Senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                    
                    <button type="submit" disabled={loading} style={{
                        padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}>
                        {loading ? 'Salvando...' : 'Redefinir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}