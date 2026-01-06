import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import logoHelpTI from "@/assets/images/h-logo-removebg-preview.png";
import loginHero from "@/assets/images/login-hero.jpg";
import api from '@/services/api';

interface JwtPayload {
  sub: string;
  roles: string[];
  id: number;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroLogin, setErroLogin] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroLogin(false);
    setLoading(true);

    try {
      const response = await api.post('/api/login', {
        email,
        senha: password 
      });

      const token = response.data.token;
      localStorage.setItem('helpti_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
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
      console.error("Erro no login:", error);
      setErroLogin(true);
      alert("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Componente auxiliar para Espaçamento (substitui a div com caractere invisível)
  const Spacer = () => <div className="h-6" />; 

  return (
    <div className="min-h-screen flex w-full">
      {/* Lado esquerdo - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <img
          src={loginHero}
          alt="Equipe de suporte técnico HelpTI"
          className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent-orange/40" />
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-slide-in-right">
          
          {/* Header: Logo e Título */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src={logoHelpTI}
                alt="HelpTI Logo"
                className="h-16 w-auto object-contain drop-shadow-sm"
              />
            </div>
            
            <Spacer /> {/* Espaço extra igual ao original */}

            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          <Spacer /> {/* Espaço extra antes do formulário */}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="mb-8">
            
            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground pl-1"
              >
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-4 h-11" 
                  required
                />
              </div>
            </div>

            <Spacer /> {/* Espaço extra entre os campos */}

            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Senha
                </label>

                {/* Link Condicional de Recuperação */}
                {erroLogin && (
                  <Link
                    to="/recuperar-senha"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  >
                    Esqueceu a senha?
                  </Link>
                )}
              </div>

              <div className="relative space-y-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-4 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Spacer /> {/* Espaço extra antes do botão */}

            {/* Botão de Login */}
            <div>
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading} 
                className="w-full text-base font-semibold h-11" 
                variant="default"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <Spacer /> {/* Espaço extra antes do footer */}

          {/* Footer / Links Extras */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-8">
              Não tem uma conta?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Criar conta
              </a>
            </p>

            <Spacer />

            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} HelpTI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;