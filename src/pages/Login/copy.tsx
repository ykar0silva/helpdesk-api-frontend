import { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        // Simulação de login
        setTimeout(() => {
            alert('Login simulado - Funcionalidade a ser implementada');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex min-h-screen relative bg-cover bg-center bg-no-repeat" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')"}}>
      
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Lado esquerdo - vazio */}
            <div className="hidden lg:block lg:basis-1/2"></div>

            {/* Lado direito - Card de login */}
            <div className="basis-full lg:basis-1/2 flex items-center justify-center relative z-10 p-4 sm:p-6">
                <div className="w-full max-w-md">
                    
                    {/* Card de login */}
                    <div className="bg-white rounded-xl shadow-xl p-8 sm:p-12 relative">

                        {/* Botão fechar */}
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>

                        {/* Logo centralizada */}
                        <div className="flex justify-center mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <div className="text-white font-bold text-2xl">H</div>
                            </div>
                        </div>

                        {/* Título */}
                        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
                            Sign in
                        </h2>

                        {/* Formulário */}
                        <div className="space-y-5">
                            
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-normal text-gray-600 mb-2">
                                    Email or phone number
                                </label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                    placeholder=""
                                />
                            </div>
                            
                            {/* Password */}
                            <div>
                                <label className="block text-sm font-normal text-gray-600 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-16 text-sm"
                                        placeholder=""
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <span className="text-xs">Hide</span>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Sign in button */}
                            <div className="pt-1">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2.5 rounded-md transition-all duration-200 text-sm"
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>

                            {/* Remember me & Need help */}
                            <div className="flex items-center justify-between text-sm pt-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-gray-700">Remember me</span>
                                </label>
                                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                                    Need help?
                                </a>
                            </div>
                        </div>

                        {/* Sign up link */}
                        <div className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Sign up
                            </a>
                        </div>

                        {/* reCAPTCHA notice */}
                        <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
                            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                            <a href="#" className="text-blue-600 hover:underline transition-colors">
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