import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Ticket, Clock, CheckCircle, AlertCircle, Filter } from "lucide-react";
import { Navbar } from "../../components/Navbar"; 
import api from "../../services/api";

interface Chamado {
    id: number;
    titulo: string;
    status: string;
    prioridade: string;
    dataAbertura: string;
    descricao: string;
    tecnico?: { nome: string };
}

export function ClienteDashboard() {
    const navigate = useNavigate();
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        async function loadChamados() {
            try {
                const response = await api.get("/api/chamados"); 
                setChamados(response.data);
            } catch (error) {
                console.error("Erro ao buscar chamados", error);
            } finally {
                setLoading(false);
            }
        }
        loadChamados();
    }, []);

    const totalAbertos = chamados.filter(c => c.status === "ABERTO").length;
    const totalEmAndamento = chamados.filter(c => c.status === "EM_ATENDIMENTO").length;
    const totalFechados = chamados.filter(c => c.status === "FECHADO").length;

    const chamadosFiltrados = chamados.filter(c => 
        c.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        c.id.toString().includes(filtro)
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "ABERTO": return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-500", label: "Aguardando" };
            case "EM_ATENDIMENTO": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-500", label: "Em Andamento" };
            case "FECHADO": return { bg: "bg-green-50", text: "text-green-700", border: "border-green-500", label: "Finalizado" };
            default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-500", label: status };
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col w-full">
            <Navbar />

            {/* HEADER COM DEGRADÊ SUAVE */}
            <div className="bg-white shadow-sm w-full">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Painel do Cliente</h1>
                            <p className="text-gray-500 mt-1">Gerencie suas solicitações de suporte técnico.</p>
                        </div>
                        <button 
                            onClick={() => navigate("/cliente/novo-chamado")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            Novo Chamado
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL CENTRALIZADO */}
            <main className="flex-1 w-full py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* CARDS DE ESTATÍSTICAS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Card Pendentes */}
                        <div className="bg-white rounded-xl shadow-sm border-t-4 border-yellow-400 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium">Pendentes</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalAbertos}</h3>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                    <AlertCircle size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Card Em Andamento */}
                        <div className="bg-white rounded-xl shadow-sm border-t-4 border-blue-500 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium">Em Andamento</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalEmAndamento}</h3>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Card Finalizados */}
                        <div className="bg-white rounded-xl shadow-sm border-t-4 border-green-500 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium">Finalizados</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalFechados}</h3>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full text-green-600">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BARRA DE FILTRO E TÍTULO DA LISTA */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <Ticket size={20} />
                                Histórico de Chamados
                            </h2>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por ID ou título..." 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* LISTAGEM */}
                        <div className="bg-white">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Carregando informações...</p>
                                </div>
                            ) : chamadosFiltrados.length === 0 ? (
                                <div className="py-20 text-center flex flex-col items-center">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <Search size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Nenhum chamado encontrado</h3>
                                    <p className="text-gray-500 mt-1">Tente buscar por outro termo ou abra um novo chamado.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {chamadosFiltrados.map((chamado) => {
                                        const statusStyle = getStatusStyles(chamado.status);
                                        return (
                                            <div 
                                                key={chamado.id}
                                                onClick={() => navigate(`/chamados/${chamado.id}`)}
                                                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="hidden sm:flex h-12 w-12 bg-gray-100 rounded-lg items-center justify-center font-bold text-gray-600 text-sm shrink-0">
                                                        #{chamado.id}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                                                            {chamado.titulo}
                                                        </h4>
                                                        <p className="text-gray-500 text-sm mt-1 line-clamp-1 max-w-2xl">
                                                            {chamado.descricao}
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                📅 {new Date(chamado.dataAbertura).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                👤 {chamado.tecnico ? chamado.tecnico.nome : "Aguardando Técnico"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-end gap-2 self-start md:self-center shrink-0">
                                                    {chamado.prioridade === "ALTA" && (
                                                        <span className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded uppercase tracking-wider">
                                                            Urgente
                                                        </span>
                                                    )}
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                        {statusStyle.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}