// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

// Este componente vai "envelopar" as rotas que queremos proteger

export const ProtectedRoute = () => {
    // 1. Busca o token no localStorage
    const token = localStorage.getItem('helpti_token');

    // 2. Se NÃO houver token...
    if (!token) {
        // ...redireciona o usuário para a página de login
        return <Navigate to="/" replace />;
    }

    // 3. Se houver token, mostra o conteúdo da rota (a página)
    // O <Outlet /> é o "lugar" onde o React vai renderizar
    // a página que está sendo protegida (ex: o HomePage)
    return <Outlet />;
};