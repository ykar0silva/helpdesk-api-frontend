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
                <div className="container mx-auto px-4 relative z-10 flex justify-center md:justify-end lg:pr-24 h-full items-center py-12">
                
                {/* Card de Login */}
                <div className="w-full max-w-md bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl overflow-hidden p-8 md:p-10 transform transition-all duration-300 hover:shadow-3xl border border-transparent dark:border-gray-700">
                    
                    {/* Botão Fechar */}
                    <div className="flex justify-end mb-2">
                        <button 
                            type="button"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-text-main-light dark:hover:text-text-main-dark transition-colors"
                            onClick={() => navigate(-1)}
                        >
                            <span className="material-icons-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Logo SVG */}
                    <div className="flex justify-center mb-6">
                        <svg 
                            fill="none" 
                            height="60" 
                            viewBox="0 0 60 60" 
                            width="60" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M22 10V50" 
                                stroke="#0056b3" 
                                strokeLinecap="round" 
                                strokeWidth="6"
                            />
                            <path 
                                d="M38 10V50" 
                                stroke="#0056b3" 
                                strokeLinecap="round" 
                                strokeWidth="6"
                            />
                            <path 
                                d="M22 30H38" 
                                stroke="#0056b3" 
                                strokeLinecap="round" 
                                strokeWidth="6"
                            />
                        </svg>
                    </div>

                    {/* Título */}
                    <h2 className="text-3xl font-semibold text-text-main-light dark:text-text-main-dark mb-8 text-center md:text-left">
                        Sign in
                    </h2>

                    {/* Formulário */}
                    <div className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="email"
                                className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                            >
                                Email or phone number
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-input-border-light dark:border-input-border-dark bg-white dark:bg-gray-800 text-text-main-light dark:text-text-main-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                                placeholder=""
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center">
                                <label 
                                    htmlFor="password"
                                    className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                                >
                                    Password
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs text-text-muted-light dark:text-text-muted-dark hover:text-primary flex items-center gap-1"
                                >
                                    <span className="material-icons-outlined text-sm">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span> 
                                    {showPassword ? 'Show' : 'Hide'}
                                </button>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-input-border-light dark:border-input-border-dark bg-white dark:bg-gray-800 text-text-main-light dark:text-text-main-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                                placeholder=""
                            />
                        </div>

                        {/* Sign in Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gray-300 dark:bg-gray-600 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-200 font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        {/* Remember me & Need help */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:ring-offset-gray-800"
                                />
                                <label 
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-text-main-light dark:text-text-main-dark"
                                >
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a 
                                    href="#"
                                    className="font-medium text-text-main-light dark:text-text-main-dark hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    Need help?
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sign up & reCAPTCHA */}
                    <div className="mt-10 space-y-4">
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            Don't have an account?{' '}
                            <a 
                                href="#"
                                className="font-bold text-text-main-light dark:text-text-main-dark hover:underline decoration-2 underline-offset-2"
                            >
                                Sign up
                            </a>
                        </p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                            <a 
                                href="#"
                                className="font-bold text-text-main-light dark:text-text-main-dark hover:underline"
                            >
                                Learn more.
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}