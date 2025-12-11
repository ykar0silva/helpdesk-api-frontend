import { useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import {useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logoHelpTI from "@/assets/images/h-logo-removebg-preview.png";
import loginHero from "@/assets/images/login-hero.jpg";
import api from '@/services/api';

interface JwtPayload{
    sub: string;
    roles: string[];
    id: number;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    // TODO: Implementar autenticação

    try{
        const response = await api.post('/api/login',{
            email,
            senha:password
        });

        const token = response.data.token;
        localStorage.setItem('helpti_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decoded = jwtDecode<JwtPayload>(token);
        const roles = decoded.roles;

        if(roles.includes("ROLE_ADMIN")){
            navigate('/admin/dashboard');
        } else if(roles.includes("ROLE_TECNICO")){
            navigate('/tecnico/dashboard');
        } else {
            navigate('/cliente/dashboard');
        }
    }
    catch (error) {
        alert("Erro ao fazer login. Verifique suas credenciais e tente novamente.");

    }
    finally {
        setLoading(false);
    }

  }; 



  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <img
          src={loginHero}
          alt="Equipe de suporte técnico HelpTI"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent-orange/40" />
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-slide-in-right">
          {/* Logo e Título */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img
                src={logoHelpTI}
                alt="HelpTI Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                {/* <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> */}
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <div className="relative">
                {/* <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> */}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar-me e Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Lembrar-me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão de Login */}
            <Button type="submit" size="lg" className="w-full" variant="default" onClick={handleSubmit}>
              Entrar
            </Button>
          </form>

          {/* Link para criar conta */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Criar conta
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HelpTI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
