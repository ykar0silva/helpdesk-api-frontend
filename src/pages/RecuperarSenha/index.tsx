import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"; 
export function RecuperarSenha() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if(!email) return;

        setLoading(true);
        try {
            await api.post('/api/forgot-password', { email });
            
            alert("Sucesso! Verifique seu e-mail (e a caixa de spam) para redefinir a senha.");
            navigate("/"); 
        } catch (error) {
            console.error(error);
            alert("Erro: E-mail não encontrado ou erro no servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-center" style={{ 
            height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' 
        }}>
            <div className="login" style={{ 
                backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Recuperar Senha</h2>
                <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                    Digite seu e-mail cadastrado. Enviaremos um link para você criar uma nova senha.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                    
                    <button type="submit" disabled={loading} style={{
                        padding: '10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}>
                        {loading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#1890ff', textDecoration: 'none' }}>Voltar para o Login</Link>
                </div>
            </div>
        </div>
    );
}