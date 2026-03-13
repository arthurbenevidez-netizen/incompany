import { DocumentCategory } from "@/types";

export const documentCategories: DocumentCategory[] = [
  // CADASTRO CEDENTE - FINANCEIRO
  {
    id: "cc_f1",
    name: "Balanço Atualizado",
    type: "financeira",
    processType: "cadastro_cedente",
    required: true,
    description: "Balanço e DRE dos últimos 3 anos encerrados e assinados pelo contador da empresa"
  },
  {
    id: "cc_f4",
    name: "Balancete Atualizado",
    type: "financeira",
    processType: "cadastro_cedente",
    required: true,
    description: "Balancete atualizado assinado pelo contador da empresa"
  },
  {
    id: "cc_f5",
    name: "Declaração de Faturamento",
    type: "financeira",
    processType: "cadastro_cedente",
    required: true,
    description: "Declaração de Faturamento 2022, 2023, 2024 encerrados e 2025 até julho – assinado pelo contador"
  },
  {
    id: "cc_f6",
    name: "Abertura do Endividamento",
    type: "financeira",
    processType: "cadastro_cedente",
    required: true,
    description: "Abertura do Endividamento atual detalhado (data base com defasagem máxima de 02 meses)"
  },
  {
    id: "cc_f7",
    name: "Declaração de Instituições Financeiras",
    type: "financeira",
    processType: "cadastro_cedente",
    required: true,
    description: "Declaração de Instituições Financeiras (relação contendo agência e conta), em papel timbrado, assinada pelo administrador (defasagem máxima de 02 meses)"
  },

  // CADASTRO CEDENTE - EMPRESA (LTDA)
  {
    id: "cc_e1",
    name: "Contrato Social + Última Alteração",
    type: "empresa",
    processType: "cadastro_cedente",
    required: true,
    description: "Contrato Social + Última Alteração Contratual Consolidada (LTDA)"
  },
  {
    id: "cc_e2",
    name: "Certidão Simplificada Junta Comercial",
    type: "empresa",
    processType: "cadastro_cedente",
    required: false,
    description: "Se a última alteração foi há mais de 3 anos, certidão simplificada da Junta Comercial (máximo 90 dias)"
  },

  // CADASTRO CEDENTE - EMPRESA (S.A.)
  {
    id: "cc_e3",
    name: "Estatuto Social",
    type: "empresa",
    processType: "cadastro_cedente",
    required: true,
    description: "Estatuto Social em vigor + Boletim de Subscrição + Ata de Eleição da Atual Diretoria (S.A.)"
  },

  // CADASTRO CEDENTE - SÓCIOS
  {
    id: "cc_s1",
    name: "RG/CPF ou CNH",
    type: "socios",
    processType: "cadastro_cedente",
    required: true,
    description: "RG/CPF ou CNH vigente dos sócios"
  },
  {
    id: "cc_s2",
    name: "Certidão de Casamento",
    type: "socios",
    processType: "cadastro_cedente",
    required: false,
    description: "Certidão de Casamento + documento de identificação do cônjuge (se aplicável). Em caso de divórcio/viuvez, certidão averbada"
  },
  {
    id: "cc_s3",
    name: "Comprovante de Endereço",
    type: "socios",
    processType: "cadastro_cedente",
    required: true,
    description: "Comprovante de endereço (contas de consumo: energia, água, telefone, gás), defasagem máxima de 90 dias"
  },
  {
    id: "cc_s4",
    name: "Recibo e Declaração IR",
    type: "socios",
    processType: "cadastro_cedente",
    required: true,
    description: "Recibo e declaração de IR do último exercício"
  },

  // CADASTRO CEDENTE - DOCUMENTOS COMPLEMENTARES
  {
    id: "cc_c1",
    name: "Apólices de Seguro",
    type: "empresa",
    processType: "cadastro_cedente",
    required: false,
    description: "Apólices de seguro vigentes"
  },
  {
    id: "cc_c2",
    name: "Backlog de Contratos",
    type: "empresa",
    processType: "cadastro_cedente",
    required: false,
    description: "Backlog de contratos"
  },

  // ATUALIZAÇÃO DE CADASTRO - FINANCEIRO
  {
    id: "ac_f1",
    name: "Balanço Atualizado",
    type: "financeira",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Balanço e DRE atualizado assinado pelo contador da empresa"
  },
  {
    id: "ac_f2",
    name: "Balancete Atualizado",
    type: "financeira",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Balancete atualizado assinado pelo contador da empresa"
  },
  {
    id: "ac_f3",
    name: "Declaração de Faturamento 12 Meses",
    type: "financeira",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Declaração de Faturamento dos últimos 12 meses assinada pelo contador da empresa"
  },
  {
    id: "ac_f4",
    name: "Abertura Endividamento Financeiro",
    type: "financeira",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Abertura do Endividamento Financeiro atual detalhado (defasagem máxima de 03 meses). Informar BANCOS, FACTORINGs, FIDCs, modalidades, limites, saldos devedores, valor das parcelas, garantias, vencimentos"
  },

  // ATUALIZAÇÃO DE CADASTRO - EMPRESA
  {
    id: "ac_e1",
    name: "Último Aditivo ou Ata",
    type: "empresa",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Último aditivo ou última ata arquivados"
  },

  // ATUALIZAÇÃO DE CADASTRO - SÓCIOS
  {
    id: "ac_s1",
    name: "Comprovante de Endereço Atualizado",
    type: "socios",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Comprovante de endereço (contas de consumo: energia, água, telefone, gás), defasagem máxima de 90 dias"
  },
  {
    id: "ac_s2",
    name: "Imposto de Renda e Recibo",
    type: "socios",
    processType: "atualizacao_cadastro",
    required: true,
    description: "Imposto de Renda e Recibo dos sócios e representantes do último exercício"
  },

  // ATUALIZAÇÃO DE CADASTRO - COMPLEMENTARES
  {
    id: "ac_c1",
    name: "Backlog de Contratos Atualizado",
    type: "empresa",
    processType: "atualizacao_cadastro",
    required: false,
    description: "Backlog de contratos atualizado"
  },

  // RISCO SACADO - Documentos básicos (mock - pode ser expandido conforme necessário)
  {
    id: "rs_f1",
    name: "Demonstrações Financeiras",
    type: "financeira",
    processType: "risco_sacado",
    required: true,
    description: "Demonstrações financeiras para análise de risco do sacado"
  },
  {
    id: "rs_e1",
    name: "Documentos da Empresa Sacada",
    type: "empresa",
    processType: "risco_sacado",
    required: true,
    description: "Documentação da empresa para análise de risco"
  }
];

export const getProcessTypeLabel = (processType: string) => {
  switch (processType) {
    case 'cadastro_cedente':
      return 'Cadastro Cedente';
    case 'risco_sacado':
      return 'Risco Sacado';
    case 'atualizacao_cadastro':
      return 'Atualização de Cadastro';
    default:
      return processType;
  }
};

export const getProcessTypeBadge = (processType: string) => {
  switch (processType) {
    case 'cadastro_cedente':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'risco_sacado':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'atualizacao_cadastro':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getProcessTypeIcon = (processType: string) => {
  switch (processType) {
    case 'cadastro_cedente':
      return 'UserPlus'; // Novo cadastro
    case 'risco_sacado':
      return 'ShieldAlert'; // Análise de risco
    case 'atualizacao_cadastro':
      return 'RefreshCw'; // Atualização
    default:
      return 'FileText';
  }
};