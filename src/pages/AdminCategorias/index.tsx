// src/pages/AdminCategorias/index.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";

// Interfaces (Modelos de Dados)
interface Categoria {
    id: number;
    nome: string;
}

interface SubCategoria {
    id: number;
    nome: string;
    categoria: { id: number; nome: string }; // Inclui o nome da categoria pai
}

export function AdminCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
    
    // Estados para o cadastro
    const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
    const [novaSubCategoriaNome, setNovaSubCategoriaNome] = useState("");
    const [categoriaPaiSelecionada, setCategoriaPaiSelecionada] = useState<number | ''>('');

    const EMPRESA_ID = 1; // ID fixo da empresa logada (MVP)

    // Função para carregar as Categorias e Subcategorias do Backend
    const loadDados = async () => {
        try {
            const catResponse = await api.get('/api/categorias');
            setCategorias(catResponse.data);
            
            const subResponse = await api.get('/api/categorias/subcategorias');
            setSubCategorias(subResponse.data);
        } catch (error) {
            console.error("Erro ao carregar dados de categorias:", error);
            // Mostrar alerta ou mensagem de erro
        }
    };

    useEffect(() => {
        loadDados();
    }, []);

    // --- Lógica de Criação de Categoria Pai (POST /api/categorias) ---
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/categorias', {
                nome: novaCategoriaNome,
                empresa: { id: EMPRESA_ID } // A categoria pertence à empresa do Admin
            });
            alert("Categoria criada com sucesso!");
            setNovaCategoriaNome("");
            loadDados(); // Recarrega os dados
        } catch (error) {
            alert("Erro ao criar categoria. Verifique o console.");
        }
    };

    // --- Lógica de Criação de Subcategoria (POST /api/categorias/subcategorias) ---
    const handleCreateSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoriaPaiSelecionada) {
            alert("Por favor, selecione uma Categoria Pai.");
            return;
        }
        try {
            await api.post('/api/categorias/subcategorias', {
                nome: novaSubCategoriaNome,
                categoria: { id: categoriaPaiSelecionada } // O ID da categoria pai
            });
            alert("Subcategoria criada com sucesso!");
            setNovaSubCategoriaNome("");
            setCategoriaPaiSelecionada('');
            loadDados();
        } catch (error) {
            alert("Erro ao criar subcategoria.");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Gerenciamento de Categorias de Serviços</h2>

                {/* --- SEÇÃO DE CRIAÇÃO --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                    
                    {/* COLUNA 1: Criar Categoria Pai */}
                    <form onSubmit={handleCreateCategory}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Nova Categoria Principal</h3>
                        <label>Nome (Ex: Hardware):</label>
                        <input 
                            type="text" 
                            value={novaCategoriaNome} 
                            onChange={e => setNovaCategoriaNome(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                        />
                        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
                            + Criar Categoria
                        </button>
                    </form>

                    {/* COLUNA 2: Criar Subcategoria */}
                    <form onSubmit={handleCreateSubcategory}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Nova Subcategoria (Tipo)</h3>
                        <label>Categoria Pai:</label>
                        <select 
                            value={categoriaPaiSelecionada} 
                            onChange={e => setCategoriaPaiSelecionada(Number(e.target.value))} 
                            required 
                            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                        >
                            <option value="">-- Selecione uma Categoria --</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                        <label>Nome (Ex: Impressora, Windows):</label>
                        <input 
                            type="text" 
                            value={novaSubCategoriaNome} 
                            onChange={e => setNovaSubCategoriaNome(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                        />
                        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
                            + Criar Subcategoria
                        </button>
                    </form>
                </div>

                {/* --- SEÇÃO DE VISUALIZAÇÃO --- */}
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Estrutura Atual de Categorias</h3>
                <div style={{ display: 'flex', gap: '50px' }}>
                    
                    {/* Lista de Categorias */}
                    <div>
                        <h4>Categorias Principais ({categorias.length})</h4>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                            {categorias.map(c => (
                                <li key={c.id} style={{ fontWeight: 'bold' }}>
                                    {c.nome} (ID: {c.id})
                                    
                                    {/* Lista de Filhas */}
                                    <ul style={{ listStyleType: 'circle', fontWeight: 'normal', paddingLeft: '20px' }}>
                                        {subCategorias
                                            .filter(s => s.categoria.id === c.id)
                                            .map(s => (
                                                <li key={s.id}>
                                                    {s.nome} (ID: {s.id})
                                                </li>
                                            ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}