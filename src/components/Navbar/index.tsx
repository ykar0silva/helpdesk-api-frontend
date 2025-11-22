// src/components/Navbar/index.tsx
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Limpa o token e volta para o login
        localStorage.removeItem('helpti_token');
        navigate('/');
    };

    return (
        <nav style={{ 
            display: 'flex', 
            gap: '20px', 
            padding: '15px', 
            background: '#eee', 
            marginBottom: '20px',
            alignItems: 'center'
        }}>
            <h3 style={{ margin: 0 }}>Help TI</h3>
            
            {/* Links de Navegação */}
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/tecnicos">Técnicos</Link>
            <Link to="/admin/clientes">Clientes</Link>
            <Link to="/admin/categorias">Categorias</Link>
            <Link to="/admin/pagamentos">Financeiro</Link>
            {/* Botão de Sair (jogado para a direita) */}
            <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                Sair
            </button>
        </nav>
    );
}