import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { useNavigate } from "react-router-dom"; // <-- 1. IMPORT NOVO

// Tipos de dados
interface Chamado {
    id: number;
    titulo: string;
    prioridade: string;
    status: string;
    dataAbertura: string;
    cliente: { nome: string; }
}

interface Categoria {
    id: number;
    nome: string;
}

interface SubCategoria {
    id: number;
    nome: string;
    categoria: { id: number };
}

export function TecnicoDashboard() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // Estados do Modal de Fechamento
    const [modalAberto, setModalAberto] = useState(false);
    const [chamadoSelecionado, setChamadoSelecionado] = useState<number | null>(null);

    // Estados do Formulário
    const [solucao, setSolucao] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState("");

    const loadChamados = async () => {
        const token = localStorage.getItem('helpti_token');
        if (!token) return;

        try {
            setLoading(true);

            // 1. OBTÉM O ID DO TÉCNICO LOGADO (DE DENTRO DO TOKEN)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            const tecnicoId = payload.id; // ID do Técnico logado

            // 2. CHAMA O ENDPOINT CORRETO: Filtrado por Técnico e Ativos
            const response = await api.get(`/api/chamados/tecnico/${tecnicoId}/dashboard`);

            if (Array.isArray(response.data)) {
                // A API já retorna apenas os ativos atribuídos a este ID.
                setChamados(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar chamados do técnico", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategorias = async () => {
        try {
            // 1. CHAMA CATEGORIAS (Correto)
            const response = await api.get('/api/categorias');
            setCategorias(response.data);

            // 2. CORREÇÃO AQUI: A URL precisa do prefixo /categorias/subcategorias
            const subResponse = await api.get('/api/categorias/subcategorias');
            setSubCategorias(subResponse.data);

        } catch (error) {
            // Se a API FALHAR (403), usa os dados Mock para o desenvolvimento
            console.warn("API de categorias falhou, usando dados locais.");
            console.error("Erro detalhado:", error);
            setCategorias([
                { id: 1, nome: "Hardware" },
                { id: 2, nome: "Software" }
            ]);
            setSubCategorias([
                { id: 1, nome: "Impressora", categoria: { id: 1 } },
                { id: 2, nome: "Monitor", categoria: { id: 1 } },
                { id: 3, nome: "Windows", categoria: { id: 2 } }
            ]);
        }
    };

    useEffect(() => {
        loadChamados();
        loadCategorias();
    }, []);

    const handleAssumir = async (idChamado: number) => {
        try {
            const token = localStorage.getItem('helpti_token');
            if (!token) return;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));

            await api.put(`/api/chamados/${idChamado}/atender`, { tecnicoId: payload.id });
            alert("Chamado assumido!");
            loadChamados();
        } catch (error) {
            alert("Erro ao assumir.");
        }
    };

    const abrirModalFinalizar = (idChamado: number) => {
        setChamadoSelecionado(idChamado);
        setModalAberto(true);
    };

    const handleFinalizar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chamadoSelecionado) return;

        try {
            const payload = {
                solucao: solucao,
                categoriaId: Number(categoriaSelecionada),
                subCategoriaId: Number(subCategoriaSelecionada)
            };
            await api.put(`/api/chamados/${chamadoSelecionado}/fechar`, payload);
            alert("Chamado finalizado com sucesso!");
            setModalAberto(false);
            loadChamados();
        } catch (error) {
            alert("Erro ao finalizar chamado.");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h2>Fila de Atendimento</h2>

                {loading ? <p>Carregando...</p> : (
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f0f0f0' }}>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Chamado</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th> {/* ALINHA À ESQUERDA */}
                                <th style={{ padding: '10px', textAlign: 'left' }}>Título</th> {/* ALINHA À ESQUERDA */}
                                <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Data Abertura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamados.map(chamado => (
                                <tr
                                    key={chamado.id}
                                    style={{ textAlign: 'center', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: hoveredId === chamado.id ? 'rgba(239, 128, 0, 0.1)' : 'white' }}
                                    onClick={() => navigate(`/chamados/${chamado.id}`)}
                                    onMouseEnter={() => setHoveredId(chamado.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <td style={{ padding: '10px' }}>{chamado.id}</td> {/* 1. CHAMADO ID (CENTRO) */}
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{chamado.cliente.nome}</td> {/* 2. CLIENTE (ESQUERDA) */}
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{chamado.titulo}</td> {/* 3. TÍTULO (ESQUERDA) */}
                                    <td style={{ padding: '10px' }}> {/* 4. STATUS (CENTRO) */}
                                        <span style={{ background: chamado.status === 'ABERTO' ? '#ffc107' : '#17a2b8', padding: '5px 10px', borderRadius: '15px', color: '#fff', fontSize: '12px' }}>
                                            {chamado.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}> {/* 5. DATA ABERTURA (CENTRO) */}
                                        {new Date(chamado.dataAbertura).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Modal de Fechamento (Mantido igual) */}
                {modalAberto && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                            <h3>Finalizar Chamado #{chamadoSelecionado}</h3>
                            <form onSubmit={handleFinalizar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label>Solução:</label>
                                <textarea value={solucao} onChange={e => setSolucao(e.target.value)} required rows={3} />

                                <label>Categoria:</label>
                                <select value={categoriaSelecionada} onChange={e => setCategoriaSelecionada(e.target.value)} required>
                                    <option value="">Selecione...</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>

                                <label>Tipo:</label>
                                <select value={subCategoriaSelecionada} onChange={e => setSubCategoriaSelecionada(e.target.value)} required>
                                    <option value="">Selecione...</option>
                                    {subCategorias
                                        .filter(s => s.categoria.id === Number(categoriaSelecionada))
                                        .map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="submit" style={{ flex: 1, background: '#28a745', color: 'white', padding: '10px' }}>Confirmar</button>
                                    <button type="button" onClick={() => setModalAberto(false)} style={{ flex: 1, background: '#ccc', padding: '10px' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}