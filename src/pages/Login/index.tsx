// src/pages/Login/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';

interface JwtPayload {
    sub: string;
    roles: string[];
    id: number;
}

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="flex flex-row h-screen">
            
            {/* LADO ESQUERDO - Imagem */}
            <div className="hidden lg:flex lg:basis-2/3 bg-gradient-to-br from-blue-500 via-blue-200 to-blue-50 relative animate-gradient"
                style={{
                    // backgroundImage: "url('/src/assets/images/other-bg.jpg')"
                }}>
                 <div className="absolute inset-0 bg-black/40"></div>

                {/* Padrão decorativo */}
                
                
            </div>

            {/* LADO DIREITO - Formulário */}
            <div className="flex-1 lg:basis-1/3 flex justify-center items-center p-6 lg:p-10 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header Mobile */}
                    <div className="text-center lg:hidden">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Help TI</h2>
                        <p className="text-gray-600">Sistema de Chamados</p>
                    </div>

                    {/* Título do Form */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h2>
                        <p className="mt-2 text-gray-600">Entre com suas credenciais</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        
                        {/* Campo Email */}
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Esqueceu a senha? */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Lembrar-me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                Esqueceu a senha?
                            </a>
                        </div>

                        {/* Botão Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500">
                        Sistema v1.0 • © 2024 Help TI
                    </div>
                </div>
            </div>
        </div>
    );
}