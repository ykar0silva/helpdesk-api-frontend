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
        <div className="flex flex-row 1/2 min-h-screen relative bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')"}}>
      
        <div className="absolute inset-0 bg-black/30"></div>

        <div className='basis-1/2'>
        </div>

        <div className="basis-1/2 flex items-center justify-center min-h-screen place-items-center">

            <div className="w-full h-full flex items-center justify-center ">
                {/* Card de login flutuante */}
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 relative animate-fade-in">

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img src="src/assets/images/logo-40.png" alt="logo helpti" />
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8 p-8 flex flex-col">
                        Sign in
                    </h2>

                    {/* Formulário */}
                    <div className="space-y-8">
                        {/* div sem classe */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-8 2">
                            Email or phone number
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder=""
                            />
                        </div>
                            
                        <div >
                            <label className="block text-sm text-gray-600 mb-8 p-8">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                placeholder=""
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Sign in button */}
                        <button
                        onClick={handleSubmit}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200"
                        >
                        Sign in
                        </button>

                        {/* Remember me & Need help */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="ml-2 text-gray-700">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Need help?
                            </a>
                        </div>
                    </div>

                    {/* Sign up link */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Sign up
                        </a>
                    </div>

                    {/* reCAPTCHA notice */}
                    <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                        Learn more
                        </a>
                        .
                    </p>
                </div>
            </div>

        </div>
    </div>
    );
}
