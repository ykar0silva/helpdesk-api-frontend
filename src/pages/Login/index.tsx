// src/pages/Login/index.tsx
import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


// 2. Definir um tipo para o payload do token (bom para o TypeScript)
interface JwtPayload {
    sub: string;
    roles: string[];
    exp: number;
    iat: number;
    iss: string;
}
export function LoginPage() {
    // "useState" guarda o que o usuário digita
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Função chamada quando o botão é clicado
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Impede o recarregamento da página

        console.log("Tentando logar com:", { email, password });

        try {
            // 1. CHAMA A API! (O backend que você testou no Postman)
            const response = await api.post('/api/login', {
                email: email,
                senha: password // Lembre-se que no backend é "senha"
            });

            // 2. SE O LOGIN FUNCIONAR:
            console.log("Login com sucesso!", response.data);

            const token = response.data.token;

            // 3. Salva o token no "localStorage" do navegador
            localStorage.setItem('helpti_token', token);

            // Decodifica o token para ler as 'roles'
            const decodedToken = jwtDecode<JwtPayload>(token);
            const roles = decodedToken.roles;

            console.log("Roles do usuário:", roles);

            // 4. Decide para onde redirecionar
            if (roles.includes("ROLE_ADMIN")) {
                navigate('/admin/dashboard');
            } else if (roles.includes("ROLE_TECNICO")) {
                navigate('/tecnico/dashboard');
            } else if (roles.includes("ROLE_CLIENTE")) {
                navigate('/cliente/dashboard');
            } else {
                // Fallback, caso algo dê errado
                navigate('/home'); 
            }

            // 4. Salva o token no Axios para futuras requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // TODO: Redirecionar o usuário para o Dashboard
            alert("Login feito com sucesso!");
            
        } catch (error) {
            // 5. SE O LOGIN FALHAR (senha errada, etc.)
            console.error("Erro no login:", error);
            alert("E-mail ou senha inválidos.");
        }
    };

    return (
        <div>
            <h2>Login - Help TI</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}