// src/pages/Login/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';
import { Eye, EyeOff, X } from 'lucide-react';

interface JwtPayload {
    sub: string;
    roles: string[];
    id: number;
}

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const response = await api.post('/api/login', {
                email,
                senha: password
            });

            const token = response.data.token;
            localStorage.setItem('helpti_token', token);
            
            const decoded = jwtDecode<JwtPayload>(token);
            const roles = decoded.roles;

            if (roles.includes("ROLE_ADMIN")) {
                navigate('/admin/dashboard');
            } else if (roles.includes("ROLE_TECNICO")) {
                navigate('/tecnico/dashboard');
            } else {
                navigate('/cliente/dashboard');
            }
        } catch (error) {
            alert("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen relative bg-cover bg-center bg-no-repeat" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')"}}>
      
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Lado esquerdo - vazio */}
            <div className="hidden lg:block lg:basis-1/2"></div>

            {/* Lado direito - Card de login */}
            <div className="basis-full lg:basis-1/2 flex items-center justify-center relative z-10 p-6">
                <div className="w-full max-w-md">
                    
                    {/* Card de login */}
                    <div className='bg-white rounded-2xl flex flex-col p-8 shadow-lg'>
                        <div className="space-y-8 flex flex-col items-center">
                            <h2 className="text-2xl mb-6 text-center">Login</h2>
                            <input className="w-4/5 px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder=' Nome'/>
                            <div className="w-4/5 relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    placeholder=' Senha'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div 
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe" 
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <label htmlFor="rememberMe" className="ml-2 select-none">Lembrar-me</label>
                            </div>
                            <button 
                                className="w-4/5 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}