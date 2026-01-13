import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Navbar } from "../../components/Navbar";
import { jwtDecode } from "jwt-decode";

// --- Tipos de Dados ---
interface Nota {
    id: number;
    texto: string;
    dataCriacao: string;
    autorNome: string;
    autorTipo: string;
}

interface Anexo {
    id: number;
    urlArquivo: string;
    nomeOriginal: string;
    tipoArquivo: string;
}

interface Chamado {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
    prioridade: string;
    dataAbertura: string;
    latitude?: string;
    longitude?: string;
    cliente: { nome: string; email: string; empresaDoCliente: string; };
    tecnico?: { id: number; nome: string; };
    notas: Nota[];
    anexos: Anexo[]; 
}

interface Tecnico {
    id: number;
    nome: string;
}

interface Categoria { id: number; nome: string; }
interface SubCategoria { id: number; nome: string; categoria: { id: number }; }

export function DetalhesChamado() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [chamado, setChamado] = useState<Chamado | null>(null);
    const [novaNota, setNovaNota] = useState("");
    
    // SEGURANÇA: isAllowedUser define quem pode ver botões de gestão (Admin/Técnico)
    const [isAllowedUser, setIsAllowedUser] = useState(false);
    const [userRoleForNote, setUserRoleForNote] = useState(""); 

    // Estados para a Transferência
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    const [mostrarTransferir, setMostrarTransferir] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estados do Modal
    const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
    const [solucao, setSolucao] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState("");

    const loadDados = async () => {
        try {
            setLoading(true);

            // 1. LER TOKEN E DEFINIR PERMISSÕES
            const token = localStorage.getItem('token') || localStorage.getItem('helpti_token');
            let userIsAdminOrTech = false; 

            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    
                    const rawRole = decoded.roles?.[0] || decoded.role || "";
                    const role = String(rawRole).toUpperCase();
                    
                    setUserRoleForNote(role);

                    // Só libera se for explicitamente ADMIN ou TECNICO.
                    if (role.includes("ADMIN") || role.includes("TECNICO")) {
                        userIsAdminOrTech = true;
                        setIsAllowedUser(true);
                    } else {
                        userIsAdminOrTech = false;
                        setIsAllowedUser(false);
                    }

                } catch (e) {
                    setIsAllowedUser(false);
                }
            }

            // 2. Carrega o chamado
            const response = await api.get(`/api/chamados/${id}`);
            setChamado(response.data);

            // 3. Só carrega listas (técnicos/categorias) se tiver permissão
            if (userIsAdminOrTech) {
                try {
                    const techResponse = await api.get('/api/tecnicos/ativos');
                    setTecnicos(techResponse.data);

                    const catRes = await api.get('/api/categorias');
                    setCategorias(catRes.data);
                    const subRes = await api.get('/api/categorias/subcategorias');
                    setSubCategorias(subRes.data);
                } catch (e) { 
                    // Silencioso se não tiver permissão ou erro de rede
                }
            }

        } catch (error) {
            console.error("Erro ao carregar dados", error);
            alert("Erro ao carregar detalhes do chamado.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDados();
    }, [id]);

    const handleEnviarNota = async () => {
        if (!novaNota.trim()) return;
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('helpti_token');
            if (!token) {
                alert("Erro de autenticação. Faça login novamente.");
                return;
            }
            
            const decoded: any = jwtDecode(token);
            const userEmail = decoded.sub;

            // Limpa o prefixo ROLE_ para salvar bonito no banco
            const tipoLimpo = userRoleForNote.replace('ROLE_', '');

            await api.post(`/api/chamados/${id}/notas`, {
                texto: novaNota,
                autorNome: userEmail,
                autorTipo: tipoLimpo
            });

            setNovaNota("");
            loadDados();
        } catch (error) {
            alert("Erro ao enviar nota.");
        }
    };

    const handleTransferir = async (tecnicoId: number) => {
        if (!tecnicoId) return;
        try {
            await api.put(`/api/chamados/${id}/transferir`, { tecnicoId });
            alert("Chamado transferido com sucesso!");
            setMostrarTransferir(false);
            loadDados();
        } catch (error) {
            alert("Erro ao transferir chamado.");
        }
    };

    const handleFinalizar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/api/chamados/${id}/fechar`, {
                solucao,
                categoriaId: Number(categoriaSelecionada),
                subCategoriaId: Number(subCategoriaSelecionada)
            });
            alert("Chamado finalizado com sucesso!");
            setModalFinalizarAberto(false);
            loadDados();
        } catch (error) {
            alert("Erro ao finalizar chamado.");
        }
    };

    if (loading || !chamado) return <p style={{ padding: 20 }}>Carregando detalhes...</p>;

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', paddingBottom: 50 }}>
            <Navbar />

            <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Título e Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ width: '5px', height: '40px', background: '#ff9800' }}></div>
                    <div>
                        <h2 style={{ margin: 0, color: '#333' }}>#{chamado.id} — {chamado.titulo}</h2>
                        <span style={{ fontSize: '14px', color: '#666' }}>Aberto em {new Date(chamado.dataAbertura).toLocaleString()}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <span style={{
                            background: chamado.status === 'ABERTO' ? '#ffc107' : '#17a2b8',
                            padding: '5px 15px', borderRadius: '4px', color: 'white', fontWeight: 'bold'
                        }}>
                            {chamado.status}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', flexDirection: 'row' }}>

                    {/* --- COLUNA ESQUERDA: Histórico e Ações --- */}
                    <div style={{ flex: 3 }}>

                        {/* Barra de Ferramentas */}
                        <div style={{ background: 'white', padding: '10px', borderBottom: '1px solid #eee', borderTopLeftRadius: 4, borderTopRightRadius: 4, display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 'bold', color: '#555', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                ⬅ VOLTAR
                            </span>
                            
                            {/* LÓGICA DE SEGURANÇA: Só renderiza se for permitido */}
                            {isAllowedUser && (
                                <>
                                    <span>|</span>
                                    <span
                                        onClick={() => setMostrarTransferir(!mostrarTransferir)}
                                        style={{ cursor: 'pointer', color: '#007bff', display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                        👤 MUDAR PROPRIETÁRIO
                                    </span>

                                    {chamado.status !== 'FECHADO' && (
                                        <>
                                            <span>|</span>
                                            <span onClick={() => setModalFinalizarAberto(true)} style={{ cursor: 'pointer', color: '#28a745', display: 'flex', alignItems: 'center', gap: 5 }}>
                                                ✅ FINALIZAR CHAMADO
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Área de Transferência (Só Admin/Técnico) */}
                        {isAllowedUser && mostrarTransferir && (
                            <div style={{ background: '#e9ecef', padding: '15px', borderBottom: '1px solid #ccc' }}>
                                <label style={{ marginRight: 10 }}>Selecione o novo técnico:</label>
                                <select onChange={(e) => handleTransferir(Number(e.target.value))} style={{ padding: 5 }}>
                                    <option value="">Selecione...</option>
                                    {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Timeline */}
                        <div style={{ background: 'white', minHeight: '400px', border: '1px solid #ddd', borderTop: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                            {/* O Problema Original + ANEXOS */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #eee', background: '#fff8e1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <strong style={{ color: '#d35400' }}>Descrição do Problema</strong>
                                    <small>{chamado.cliente.nome}</small>
                                </div>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{chamado.descricao}</p>

                                {/* --- GALERIA DE ANEXOS --- */}
                                {chamado.anexos && chamado.anexos.length > 0 && (
                                    <div style={{ marginTop: '20px', borderTop: '1px solid #e0d8b0', paddingTop: '15px' }}>
                                        <strong style={{ fontSize: '13px', color: '#8a6d3b', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            📎 Anexos do Cliente ({chamado.anexos.length}):
                                        </strong>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                            {chamado.anexos.map(anexo => (
                                                <a 
                                                    key={anexo.id} 
                                                    href={`http://localhost:8082/api/files/${anexo.urlArquivo}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        border: '2px solid #fff', 
                                                        borderRadius: '8px', 
                                                        overflow: 'hidden', 
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                        background: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {anexo.tipoArquivo.includes('image') ? (
                                                            <img 
                                                                src={`http://localhost:8082/api/files/${anexo.urlArquivo}`} 
                                                                alt={anexo.nomeOriginal} 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                    (e.target as HTMLImageElement).parentElement!.innerText = '📄';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span style={{ fontSize: '24px' }}>📄</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '10px', marginTop: 4, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#666' }}>
                                                        {anexo.nomeOriginal}
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notas do Chamado */}
                            {chamado.notas.map((nota) => (
                                <div key={nota.id} style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #eee',
                                    background: nota.autorTipo === 'TECNICO' ? '#f8f9fa' : 'white',
                                    borderLeft: nota.autorTipo === 'TECNICO' ? '4px solid #007bff' : '4px solid #ccc'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#666' }}>
                                        <span>
                                            <b>{nota.autorNome}</b> <span style={{ background: '#eee', padding: '2px 6px', borderRadius: 4, marginLeft: 5 }}>{nota.autorTipo}</span>
                                        </span>
                                        <span>{new Date(nota.dataCriacao).toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{nota.texto}</p>
                                </div>
                            ))}

                            {chamado.status === 'FECHADO' && (
                                <div style={{ padding: '20px', background: '#d4edda', borderTop: '2px solid #28a745' }}>
                                    <strong>Solução Final:</strong>
                                    <p>{(chamado as any).solucao || "Sem solução registrada."}</p>
                                </div>
                            )}

                            {/* Área de Notas (Todos veem) */}
                            {chamado.status !== 'FECHADO' && (
                                <div style={{ padding: '20px', background: '#f9f9f9', borderTop: '2px solid #eee' }}>
                                    <textarea
                                        value={novaNota}
                                        onChange={e => setNovaNota(e.target.value)}
                                        placeholder="Escreva uma nota interna, resposta ou atualização..."
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                                        rows={4}
                                    />
                                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                        <button
                                            onClick={handleEnviarNota}
                                            style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Adicionar Nota
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* --- COLUNA DIREITA: Informações --- */}
                    <div style={{ flex: 1 }}>
                        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ padding: '10px', background: '#eee', fontWeight: 'bold', borderBottom: '1px solid #ddd', color: '#555' }}>
                                Informação do Chamado
                            </div>
                            <div style={{ padding: '15px', fontSize: '13px', lineHeight: '2' }}>
                                <div style={{ marginBottom: 5 }}>
                                    <span style={{ color: '#999' }}>Prioridade:</span><br />
                                    <b style={{ color: chamado.prioridade === 'ALTA' ? 'red' : 'black' }}>{chamado.prioridade}</b>
                                </div>
                                <div style={{ marginBottom: 5 }}>
                                    <span style={{ color: '#999' }}>Cliente:</span><br />
                                    <b>{chamado.cliente.nome}</b>
                                </div>
                                <div style={{ marginBottom: 5 }}>
                                    <span style={{ color: '#999' }}>Empresa:</span><br />
                                    <b>{chamado.cliente.empresaDoCliente}</b>
                                </div>

                                {/* BOTÃO DE MAPA (SÓ ADMIN/TÉCNICO) */}
                                {isAllowedUser && chamado.latitude && chamado.longitude ? (
                                    <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid #eee' }}>
                                        <span style={{ color: '#999' }}>Localização:</span>
                                        <button
                                            onClick={() => {
                                                const url = `https://www.google.com/maps?q=${chamado.latitude},${chamado.longitude}`;
                                                window.open(url, '_blank');
                                            }}
                                            style={{
                                                marginTop: 5,
                                                width: '100%',
                                                padding: '10px',
                                                background: '#fff',
                                                border: '1px solid #007bff',
                                                color: '#007bff',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                transition: '0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#f0f8ff'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                                        >
                                            📍 Ir até o Cliente
                                        </button>
                                        <div style={{ fontSize: '10px', color: '#ccc', marginTop: 4, textAlign: 'center' }}>
                                            GPS: {chamado.latitude}, {chamado.longitude}
                                        </div>
                                    </div>
                                ) : null}

                                <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #eee' }} />
                                <div>
                                    <span style={{ color: '#999' }}>Proprietário Atual:</span><br />
                                    {chamado.tecnico ? (
                                        <span style={{ color: '#007bff', fontWeight: 'bold' }}>{chamado.tecnico.nome}</span>
                                    ) : (
                                        <span style={{ color: '#999', fontStyle: 'italic' }}>-- Ninguém --</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MODAL DE FINALIZAÇÃO (SÓ ADMIN/TÉCNICO) --- */}
                    {isAllowedUser && modalFinalizarAberto && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                                <h3 style={{ marginTop: 0 }}>Finalizar Chamado</h3>
                                <form onSubmit={handleFinalizar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <label>Solução:</label>
                                    <textarea value={solucao} onChange={e => setSolucao(e.target.value)} required rows={3} style={{ padding: 5 }} />

                                    <label>Categoria:</label>
                                    <select value={categoriaSelecionada} onChange={e => setCategoriaSelecionada(e.target.value)} required style={{ padding: 5 }}>
                                        <option value="">Selecione...</option>
                                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                    </select>

                                    <label>Tipo:</label>
                                    <select value={subCategoriaSelecionada} onChange={e => setSubCategoriaSelecionada(e.target.value)} required style={{ padding: 5 }}>
                                        <option value="">Selecione...</option>
                                        {subCategorias
                                            .filter(s => s.categoria && s.categoria.id === Number(categoriaSelecionada))
                                            .map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                    </select>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button type="submit" style={{ flex: 1, background: '#28a745', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>Confirmar</button>
                                        <button type="button" onClick={() => setModalFinalizarAberto(false)} style={{ flex: 1, background: '#ccc', padding: '10px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}