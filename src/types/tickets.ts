/**
 * Tipos e interfaces para o sistema HelpTI
 * Sistema de gerenciamento de chamados de suporte técnico
 */


// ============================================================================
// ENUMS E UNION TYPES
// ============================================================================

/**
 * Status possíveis de um chamado
 */
export type ChamadoStatus = 
  | "ABERTO" 
  | "EM_ATENDIMENTO" 
  | "AGUARDANDO_CLIENTE" 
  | "AGUARDANDO_TERCEIROS" 
  | "RESOLVIDO" 
  | "FECHADO" 
  | "CANCELADO";

/**
 * Níveis de prioridade de um chamado
 */
export type ChamadoPrioridade = 
  | "BAIXA" 
  | "MEDIA" 
  | "ALTA" 
  | "CRITICA";

/**
 * Categorias de chamados
 */
export type ChamadoCategoria = 
  | "HARDWARE" 
  | "SOFTWARE" 
  | "REDE" 
  | "EMAIL" 
  | "IMPRESSORA" 
  | "SEGURANCA" 
  | "INSTALACAO" 
  | "OUTROS";

/**
 * Tipos de eventos no histórico do chamado
 */
export type TipoEvento = 
  | "ABERTURA" 
  | "ATRIBUICAO" 
  | "COMENTARIO" 
  | "STATUS_ALTERADO" 
  | "PRIORIDADE_ALTERADA" 
  | "REABERTO" 
  | "FECHAMENTO";

/**
 * Tipos de equipamentos suportados
 */
export type TipoEquipamento = 
  | "DESKTOP" 
  | "NOTEBOOK" 
  | "IMPRESSORA" 
  | "SERVIDOR" 
  | "REDE" 
  | "OUTROS";

/**
 * Tipo de autor de evento (para histórico)
 */
export type TipoAutor = 
  | "CLIENTE" 
  | "TECNICO" 
  | "SISTEMA";

// ============================================================================
// ENTIDADES PRINCIPAIS
// ============================================================================

/**
 * Interface principal de um Chamado
 */
export interface Chamado {
  /** Identificador único do chamado */
  id: number;
  
  /** Título resumido do problema */
  titulo: string;
  
  /** Descrição detalhada do problema */
  descricao: string;
  
  /** Status atual do chamado */
  status: ChamadoStatus;
  
  /** Nível de prioridade */
  prioridade: ChamadoPrioridade;
  
  /** Categoria do problema */
  categoria: ChamadoCategoria;
  
  /** Data e hora de abertura (ISO 8601) */
  dataAbertura: string;
  
  /** Data e hora de fechamento (ISO 8601) - opcional */
  dataFechamento?: string;
  
  /** Prazo estimado para resolução (SLA) */
  prazoEstimado?: string;
  
  /** Cliente que abriu o chamado */
  cliente: Cliente;
  
  /** Técnico responsável pelo atendimento - opcional */
  tecnico?: Tecnico;
  
  /** Equipamento relacionado ao chamado - opcional */
  equipamento?: Equipamento;
  
  /** Lista de arquivos anexados - opcional */
  anexos?: Anexo[];
  
  /** Histórico de eventos do chamado - opcional */
  historico?: HistoricoEvento[];
  
  /** Avaliação do cliente após fechamento - opcional */
  avaliacao?: Avaliacao;
}

/**
 * Interface de Cliente
 */
export interface Cliente {
  /** Identificador único do cliente */
  id: number;
  
  /** Nome completo */
  nome: string;
  
  /** Email de contato */
  email: string;
  
  /** Telefone de contato - opcional */
  telefone?: string;
  
  /** Empresa do cliente - opcional */
  empresa?: string;
  
  /** Departamento do cliente - opcional */
  departamento?: string;
  
  /** URL do avatar - opcional */
  avatar?: string;
}

/**
 * Interface de Técnico
 */
export interface Tecnico {
  /** Identificador único do técnico */
  id: number;
  
  /** Nome completo */
  nome: string;
  
  /** Email corporativo */
  email: string;
  
  /** Telefone de contato - opcional */
  telefone?: string;
  
  /** Lista de especialidades técnicas - opcional */
  especialidades?: string[];
  
  /** Indica se o técnico está disponível para novos chamados */
  disponivel: boolean;
  
  /** URL do avatar - opcional */
  avatar?: string;
}

/**
 * Interface de Equipamento
 */
export interface Equipamento {
  /** Identificador único do equipamento */
  id: number;
  
  /** Tipo do equipamento */
  tipo: TipoEquipamento;
  
  /** Marca do equipamento - opcional */
  marca?: string;
  
  /** Modelo do equipamento - opcional */
  modelo?: string;
  
  /** Código de patrimônio - opcional */
  patrimonio?: string;
  
  /** Localização física do equipamento - opcional */
  localizacao?: string;
}

/**
 * Interface de Evento no Histórico (Timeline)
 */
export interface HistoricoEvento {
  /** Identificador único do evento */
  id: number;
  
  /** ID do chamado relacionado */
  chamadoId: number;
  
  /** Tipo do evento */
  tipo: TipoEvento;
  
  /** Descrição do evento */
  descricao: string;
  
  /** Autor do evento */
  autor: {
    /** ID do autor */
    id: number;
    /** Nome do autor */
    nome: string;
    /** Tipo de autor */
    tipo: TipoAutor;
  };
  
  /** Data e hora do evento (ISO 8601) */
  dataEvento: string;
  
  /** Arquivos anexados ao evento - opcional */
  anexos?: Anexo[];
}

/**
 * Interface de Anexo (arquivo)
 */
export interface Anexo {
  /** Identificador único do anexo */
  id: number;
  
  /** Nome do arquivo */
  nome: string;
  
  /** URL para download do arquivo */
  url: string;
  
  /** Tipo MIME do arquivo */
  tipo: string;
  
  /** Tamanho do arquivo em bytes */
  tamanho: number;
  
  /** Data e hora do upload (ISO 8601) */
  dataUpload: string;
}

/**
 * Interface de Avaliação do Chamado
 */
export interface Avaliacao {
  /** Nota de 1 a 5 estrelas */
  nota: 1 | 2 | 3 | 4 | 5;
  
  /** Comentário adicional do cliente - opcional */
  comentario?: string;
  
  /** Data e hora da avaliação (ISO 8601) */
  dataAvaliacao: string;
}

// ============================================================================
// TIPOS PARA FORMULÁRIOS E OPERAÇÕES
// ============================================================================

/**
 * Tipo para criação de novo chamado
 * Inclui apenas os campos necessários para abertura
 */
export interface ChamadoCreateInput {
  /** Título do chamado */
  titulo: string;
  
  /** Descrição detalhada */
  descricao: string;
  
  /** Prioridade do chamado */
  prioridade: ChamadoPrioridade;
  
  /** Categoria do problema */
  categoria: ChamadoCategoria;
  
  /** ID do equipamento relacionado - opcional */
  equipamentoId?: number;
  
  /** Arquivos para anexar - opcional */
  anexos?: File[];
}

/**
 * Tipo para atualização de chamado existente
 * Todos os campos são opcionais
 */
export interface ChamadoUpdateInput {
  /** Título do chamado */
  titulo?: string;
  
  /** Descrição detalhada */
  descricao?: string;
  
  /** Status do chamado */
  status?: ChamadoStatus;
  
  /** Prioridade do chamado */
  prioridade?: ChamadoPrioridade;
  
  /** Categoria do problema */
  categoria?: ChamadoCategoria;
  
  /** ID do técnico responsável */
  tecnicoId?: number;
}

/**
 * Interface para filtros de busca de chamados
 */
export interface ChamadoFiltros {
  /** Filtrar por status específicos */
  status?: ChamadoStatus[];
  
  /** Filtrar por prioridades específicas */
  prioridade?: ChamadoPrioridade[];
  
  /** Filtrar por categorias específicas */
  categoria?: ChamadoCategoria[];
  
  /** Filtrar por técnico específico */
  tecnicoId?: number;
  
  /** Filtrar por cliente específico */
  clienteId?: number;
  
  /** Data inicial para filtro por período */
  dataInicio?: string;
  
  /** Data final para filtro por período */
  dataFim?: string;
  
  /** Termo de busca (título, descrição, ID) */
  busca?: string;
}

/**
 * Interface para adicionar comentário ao chamado
 */
export interface ComentarioInput {
  /** Texto do comentário */
  descricao: string;
  
  /** Arquivos anexados ao comentário - opcional */
  anexos?: File[];
}

/**
 * Interface para avaliar um chamado fechado
 */
export interface AvaliacaoInput {
  /** Nota de 1 a 5 */
  nota: 1 | 2 | 3 | 4 | 5;
  
  /** Comentário opcional */
  comentario?: string;
}

// ============================================================================
// TIPOS DE RESPOSTA DA API
// ============================================================================

/**
 * Resposta paginada genérica
 */
export interface PaginatedResponse<T> {
  /** Lista de itens da página atual */
  content: T[];
  
  /** Número da página atual (começa em 0) */
  page: number;
  
  /** Tamanho da página */
  size: number;
  
  /** Total de elementos */
  totalElements: number;
  
  /** Total de páginas */
  totalPages: number;
  
  /** Indica se é a primeira página */
  first: boolean;
  
  /** Indica se é a última página */
  last: boolean;
}

/**
 * Resposta de sucesso da API
 */
export interface ApiResponse<T> {
  /** Dados retornados */
  data: T;
  
  /** Mensagem de sucesso */
  message?: string;
  
  /** Timestamp da resposta */
  timestamp: string;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  /** Código de erro HTTP */
  status: number;
  
  /** Mensagem de erro */
  message: string;
  
  /** Detalhes adicionais do erro */
  errors?: Record<string, string[]>;
  
  /** Timestamp do erro */
  timestamp: string;
  
  /** Caminho da requisição */
  path: string;
}

// ============================================================================
// TIPOS DE ESTATÍSTICAS E DASHBOARD
// ============================================================================

/**
 * Estatísticas gerais de chamados
 */
export interface ChamadoEstatisticas {
  /** Total de chamados abertos */
  totalAbertos: number;
  
  /** Total de chamados em atendimento */
  totalEmAndamento: number;
  
  /** Total de chamados fechados */
  totalFechados: number;
  
  /** Total de chamados cancelados */
  totalCancelados: number;
  
  /** Tempo médio de resolução (em horas) */
  tempoMedioResolucao: number;
  
  /** Taxa de satisfação (0-100%) */
  taxaSatisfacao: number;
  
  /** Chamados por categoria */
  porCategoria: Record<ChamadoCategoria, number>;
  
  /** Chamados por prioridade */
  porPrioridade: Record<ChamadoPrioridade, number>;
}

/**
 * Estatísticas de desempenho do técnico
 */
export interface TecnicoEstatisticas {
  /** ID do técnico */
  tecnicoId: number;
  
  /** Nome do técnico */
  tecnicoNome: string;
  
  /** Total de chamados atendidos */
  totalAtendidos: number;
  
  /** Total de chamados em andamento */
  totalEmAndamento: number;
  
  /** Tempo médio de resolução (em horas) */
  tempoMedioResolucao: number;
  
  /** Avaliação média (1-5) */
  avaliacaoMedia: number;
}

// ============================================================================
// TIPOS PARA AUTENTICAÇÃO
// ============================================================================

/**
 * Payload do JWT decodificado
 */
export interface JwtPayload {
  /** Subject (geralmente email ou username) */
  sub: string;
  
  /** Roles/permissões do usuário */
  roles: string[];
  
  /** ID do usuário */
  id: number;
  
  /** Data de expiração do token (timestamp) */
  exp?: number;
  
  /** Data de emissão do token (timestamp) */
  iat?: number;
}

/**
 * Dados de login
 */
export interface LoginCredentials {
  /** Email do usuário */
  email: string;
  
  /** Senha do usuário */
  senha: string;
}

/**
 * Resposta de login bem-sucedido
 */
export interface LoginResponse {
  /** Token JWT */
  token: string;
  
  /** Tipo do token (geralmente "Bearer") */
  type?: string;
  
  /** Dados do usuário autenticado */
  usuario?: {
    id: number;
    nome: string;
    email: string;
    roles: string[];
  };
}

// ============================================================================
// TIPOS UTILITÁRIOS
// ============================================================================

/**
 * Opções para ordenação
 */
export interface SortOptions {
  /** Campo para ordenar */
  field: keyof Chamado;
  
  /** Direção da ordenação */
  direction: "asc" | "desc";
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  /** Número da página (começa em 0) */
  page?: number;
  
  /** Tamanho da página */
  size?: number;
  
  /** Ordenação */
  sort?: SortOptions;
}

/**
 * Estado de loading para componentes
 */
export interface LoadingState {
  /** Indica se está carregando */
  isLoading: boolean;
  
  /** Mensagem de erro, se houver */
  error?: string;
}

// ============================================================================
// CONSTANTES E HELPERS
// ============================================================================

/**
 * Labels amigáveis para status de chamados
 */
export const STATUS_LABELS: Record<ChamadoStatus, string> = {
  ABERTO: "Aguardando",
  EM_ATENDIMENTO: "Em Andamento",
  AGUARDANDO_CLIENTE: "Aguardando Cliente",
  AGUARDANDO_TERCEIROS: "Aguardando Terceiros",
  RESOLVIDO: "Resolvido",
  FECHADO: "Finalizado",
  CANCELADO: "Cancelado",
};

/**
 * Labels amigáveis para prioridades
 */
export const PRIORIDADE_LABELS: Record<ChamadoPrioridade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

/**
 * Labels amigáveis para categorias
 */
export const CATEGORIA_LABELS: Record<ChamadoCategoria, string> = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  REDE: "Rede",
  EMAIL: "E-mail",
  IMPRESSORA: "Impressora",
  SEGURANCA: "Segurança",
  INSTALACAO: "Instalação",
  OUTROS: "Outros",
};

