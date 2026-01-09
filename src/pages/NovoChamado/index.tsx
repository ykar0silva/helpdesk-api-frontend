import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Wifi, Printer, Server, ArrowLeft, CheckCircle, Camera, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "../../services/api";
import { LocationMap } from "@/components/LocationMap";

// --- CONTAINER FORA DA FUNÇÃO (CRÍTICO PARA NÃO TRAVAR O MAPA) ---
const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden border border-gray-200 mx-auto">
            {children}
        </div>
    </div>
);

export function NovoChamado() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [categoria, setCategoria] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("MEDIA");
    const [imagens, setImagens] = useState<File[]>([]);
    const [localizacao, setLocalizacao] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

    const categorias = [
        { id: "HARDWARE", label: "Hardware & Computadores", icon: <Monitor className="w-6 h-6" />, desc: "Notebook não liga, tela azul, lentidão física." },
        { id: "REDE", label: "Rede & Internet", icon: <Wifi className="w-6 h-6" />, desc: "Wi-Fi caiu, cabo desconectado, VPN." },
        { id: "IMPRESSORA", label: "Impressoras & Scanners", icon: <Printer className="w-6 h-6" />, desc: "Papel atolado, toner, falha na digitalização." },
        { id: "SERVIDOR", label: "Servidores & Cloud", icon: <Server className="w-6 h-6" />, desc: "Acesso a pastas, backup, firewall, sistemas." },
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImagens((prev) => [...prev, ...Array.from(e.target.files!)]);
    };

    const removeImage = (index: number) => {
        setImagens((prev) => prev.filter((_, i) => i !== index));
    };

    async function handleSubmit() {
        if (!titulo || !descricao) return alert("Preencha título e descrição.");
        // Validação opcional de GPS
        // if (!localizacao.lat) return alert("Aguarde o mapa carregar a localização.");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("observacoes", descricao);
            formData.append("prioridade", prioridade);
            formData.append("status", "ABERTO");
            formData.append("categoria", categoria);
            if (localizacao.lat) {
                formData.append("latitude", localizacao.lat.toString());
                formData.append("longitude", localizacao.lng!.toString());
            }
            imagens.forEach((img) => formData.append("imagens", img));
            await api.post("/chamados", formData);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("Erro ao abrir chamado.");
        } finally {
            setLoading(false);
        }
    }

    const catSelecionada = categorias.find(c => c.id === categoria);

    // TELA 1
    if (step === 1) {
        return (
            <Container>
                <div className="px-10 py-8 border-b border-gray-100 flex items-center gap-4 bg-white">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-10 w-10 text-gray-500 hover:bg-gray-100">
                        <ArrowLeft size={22} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Novo Chamado</h1>
                        <p className="text-gray-500 text-sm">Selecione a categoria do problema</p>
                    </div>
                </div>
                <div className="p-10 bg-gray-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categorias.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { setCategoria(cat.id); setStep(2); }}
                                className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all text-left flex items-start gap-4"
                            >
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{cat.label}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{cat.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Container>
        );
    }

    // TELA 2
    if (step === 2) {
        return (
            <Container>
                <div className="bg-gray-900 px-10 py-6 flex items-center gap-4 text-white">
                    <button onClick={() => setStep(1)} className="hover:text-blue-300 transition-colors p-2 bg-white/10 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Categoria</span>
                        <h2 className="text-xl font-bold flex items-center gap-2 mt-0.5">
                            {catSelecionada?.label}
                        </h2>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="grid gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Título Resumido</label>
                            <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Computador não liga..." className="h-12 text-base" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Descrição Detalhada</label>
                            <textarea 
                                value={descricao} 
                                onChange={e => setDescricao(e.target.value)} 
                                placeholder="Descreva o problema aqui..." 
                                className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-y text-sm bg-gray-50 focus:bg-white transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                        {/* MAPA GOOGLE */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <MapPin size={18} className="text-blue-600" /> Localização
                            </label>
                            <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative z-0 shadow-inner">
                                <LocationMap onLocationSelect={(lat, lng) => setLocalizacao({ lat, lng })} />
                            </div>
                            <p className="text-xs text-gray-500">* O Google Maps será usado para encontrar você.</p>
                        </div>
                        
                        {/* FOTOS */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Camera size={18} className="text-blue-600" /> Fotos (Opcional)
                            </label>
                            <div className="flex gap-3 flex-wrap content-start">
                                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500">
                                    <span className="text-2xl font-light">+</span>
                                    <span className="text-xs mt-1">Add</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                {imagens.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                                        <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-3">Urgência</label>
                            <div className="grid grid-cols-3 gap-4">
                                {["BAIXA", "MEDIA", "ALTA"].map(prio => (
                                    <button
                                        key={prio}
                                        onClick={() => setPrioridade(prio)}
                                        className={`h-12 rounded-xl font-bold text-xs tracking-wider border transition-all ${
                                            prioridade === prio
                                            ? prio === "ALTA" ? "bg-red-500 border-red-500 text-white" 
                                            : prio === "MEDIA" ? "bg-orange-500 border-orange-500 text-white"
                                            : "bg-green-500 border-green-500 text-white"
                                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {prio}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button size="lg" className="w-full h-14 text-base font-bold rounded-xl bg-gray-900 hover:bg-black shadow-lg" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Enviando..." : "ABRIR CHAMADO"}
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    // TELA 3
    return (
        <Container>
            <div className="p-16 text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sucesso!</h2>
                <p className="text-gray-500 mb-8">Técnicos notificados.</p>
                <Button className="w-full h-12 text-base font-bold rounded-xl" onClick={() => navigate('/cliente/dashboard')}>
                    Voltar ao Painel
                </Button>
            </div>
        </Container>
    );
}