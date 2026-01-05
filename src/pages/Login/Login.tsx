import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import logoHelpTI from "@/assets/images/h-logo-removebg-preview.png";
import loginHero from "@/assets/images/login-hero.jpg";
import api from '@/services/api';
import { Link } from "react-router-dom";
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
  const navigate = useNavigate();

  // Estado para controlar a visibilidade do link
  const [erroLogin, setErroLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reseta o erro ao tentar novamente
    setErroLogin(false);
    setLoading(true);

    try {
      const response = await api.post('/api/login', {
        email,
        senha: password // Certifique-se que o DTO do Java espera "senha" e não "password"
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
    }
    catch (error) {
      console.error("Erro no login:", error);
      setErroLogin(true);
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
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-slide-in-right space-y-6">
          {/* Logo e Título */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img
                src={logoHelpTI}
                alt="HelpTI Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div>ㅤ</div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>
          <div>ㅤ</div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
                style={{ paddingLeft: '8px' }}
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
                  className="ident-4 pl-4" // Ajustei padding (pl-12 estava muito grande sem ícone)
                  required
                />
              </div>
            </div>

            <div>ㅤ</div>

            {/* Campo Senha e Link "Esqueceu a Senha" Condicional */}
            <div className="space-y-2">
              <div className="grid justify-items-stretch grid-cols-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                  style={{ paddingLeft: '8px' }}
                >
                  Senha
                </label>

                {/* LÓGICA CONDICIONAL: Só aparece se errar o login */}
                {erroLogin && (
                  <Link
                    to="/recuperar-senha"
                    className="justify-self-end-safe text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Esqueceu a senha?ㅤ
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
                  className="pl-4" // Ajustei padding
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

            <div>ㅤ</div>

            <div>
              {/* Botão de Login */}
              <Button type="submit" size="lg" disabled={loading} className="w-full" variant="default">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div>ㅤ</div>

          {/* Link para criar conta (Se quiser manter) */}
          <div className="mt-8 text-center mb-8">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <a
                href="#"
                // Se futuramente tiver cadastro, mude para navigate('/cadastro')
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Criar conta
              </a>
            </p>
          </div>
          <div>ㅤ</div>

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