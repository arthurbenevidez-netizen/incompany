import { DocumentCategory } from "@/types";

export const documentCategories: DocumentCategory[] = [
  // =============================================
  // 1. CADASTRO DE CEDENTE
  // =============================================

  // 💰 Financeiro
  {
    id: "cc_f1",
    name: "Balanço e DRE (3 anos)",
    type: "financeira",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Balanço e DRE dos últimos três anos encerrados, assinados pelo contador da empresa",
  },
  {
    id: "cc_f2",
    name: "Balancete Atualizado",
    type: "financeira",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Balancete mais recente disponível, assinado pelo contador da empresa",
  },
  {
    id: "cc_f3",
    name: "Declaração de Faturamento Mensal (2 anos)",
    type: "financeira",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Declaração de Faturamento Mensal completo dos últimos dois anos",
  },
  {
    id: "cc_f4",
    name: "Declaração de Faturamento (12 meses)",
    type: "financeira",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Declaração de Faturamento dos últimos 12 meses, assinada pelo contador da empresa",
  },
  {
    id: "cc_f5",
    name: "Abertura do Endividamento",
    type: "financeira",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Abertura do Endividamento atual detalhado",
  },
  {
    id: "cc_f6",
    name: "Declaração de Instituições Financeiras",
    type: "financeira",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Declaração de Instituições Financeiras (agência e conta), em papel timbrado, assinada pelo administrador — defasagem máxima de 02 meses",
  },

  // 🏢 Documentação — Pessoa Jurídica (LTDA)
  {
    id: "cc_e1",
    name: "Contrato Social + Última Alteração Consolidada",
    type: "empresa",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Contrato Social + Última Alteração Contratual Consolidada",
    subtypeCondition: "ltda",
    observations: [
      "Em caso de sócio/acionista PJ, enviar a mesma documentação descrita acima para a empresa sócia.",
      "Se a última alteração do contrato consolidado foi registrada há mais de três anos, é necessário enviar uma Certidão Simplificada da Junta Comercial com data de emissão de no máximo 90 dias.",
    ],
  },

  // 🏢 Documentação — Pessoa Jurídica (S.A.)
  {
    id: "cc_e2",
    name: "Estatuto Social em vigor",
    type: "empresa",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Estatuto Social em vigor",
    subtypeCondition: "sa",
    observations: [
      "Em caso de sócio/acionista PJ, enviar a mesma documentação descrita acima para a empresa sócia.",
      "Se o estatuto consolidado foi registrado há mais de três anos, é necessário enviar uma Certidão Simplificada da Junta Comercial com data de emissão de no máximo 90 dias.",
    ],
  },
  {
    id: "cc_e3",
    name: "Boletim de Subscrição",
    type: "empresa",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Boletim de Subscrição",
    subtypeCondition: "sa",
  },
  {
    id: "cc_e4",
    name: "Ata de Eleição da Atual Diretoria",
    type: "empresa",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Ata de Eleição da Atual Diretoria",
    subtypeCondition: "sa",
  },

  // 👤 Documentação — Pessoa Física
  {
    id: "cc_s1",
    name: "RG/CPF ou CNH",
    type: "socios",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "RG/CPF ou CNH vigente",
  },
  {
    id: "cc_s2",
    name: "Certidão de Casamento + Doc. Cônjuge",
    type: "socios",
    processType: "cadastro_cedente",
    obligation: "condicional",
    description: "Certidão de Casamento + documento de identificação do(a) cônjuge — somente se aplicável",
    observations: [
      "Em caso de estado civil \"divorciado(a)\" ou \"viúvo(a)\", enviar a Certidão de Casamento averbada.",
    ],
  },
  {
    id: "cc_s3",
    name: "Comprovante de Endereço",
    type: "socios",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Comprovante de endereço — defasagem máxima de 90 dias (válidos apenas contas de consumo: energia, água, telefone, gás)",
  },
  {
    id: "cc_s4",
    name: "Recibo e Declaração de IR",
    type: "socios",
    processType: "cadastro_cedente",
    obligation: "obrigatorio",
    description: "Recibo e Declaração de IR do último exercício",
  },

  // 📎 Documentos Complementares
  {
    id: "cc_c1",
    name: "Apólices de Seguro",
    type: "complementar",
    processType: "cadastro_cedente",
    obligation: "opcional",
    description: "Apólices de seguro vigentes",
  },
  {
    id: "cc_c2",
    name: "Backlog de Contratos",
    type: "complementar",
    processType: "cadastro_cedente",
    obligation: "complementar",
    description: "Backlog de contratos",
  },

  // =============================================
  // 2. ATUALIZAÇÃO DE CEDENTE
  // =============================================

  // 💰 Financeiro
  {
    id: "ac_f1",
    name: "Balanço e DRE (último ano)",
    type: "financeira",
    processType: "atualizacao_cedente",
    obligation: "obrigatorio",
    description: "Balanço e DRE encerrado do último ano, assinado pelo contador da empresa",
  },
  {
    id: "ac_f2",
    name: "Balancete do Ano Vigente",
    type: "financeira",
    processType: "atualizacao_cedente",
    obligation: "obrigatorio",
    description: "Balancete recente do ano vigente, assinado pelo contador da empresa",
  },
  {
    id: "ac_f3",
    name: "Declaração de Faturamento (12 meses)",
    type: "financeira",
    processType: "atualizacao_cedente",
    obligation: "obrigatorio",
    description: "Declaração de Faturamento dos últimos 12 meses, assinada pelo contador da empresa",
  },
  {
    id: "ac_f4",
    name: "Abertura do Endividamento Financeiro",
    type: "financeira",
    processType: "atualizacao_cedente",
    obligation: "obrigatorio",
    description: "Abertura do Endividamento Financeiro atual detalhado",
    observations: [
      "Se possível, informar: Bancos, Factorings, FIDCs, modalidades, limites, saldos devedores, valor das parcelas, garantias e vencimentos.",
    ],
  },

  // 🏢 Documentação — Pessoa Jurídica
  {
    id: "ac_e1",
    name: "Último Aditivo ou Ata Vigente",
    type: "empresa",
    processType: "atualizacao_cedente",
    obligation: "obrigatorio",
    description: "Último aditivo ou última ata de eleição vigente",
  },

  // 👤 Documentação — Pessoa Física
  {
    id: "ac_s1",
    name: "Comprovante de Endereço",
    type: "socios",
    processType: "atualizacao_cedente",
    obligation: "obrigatorio",
    description: "Comprovante de endereço — defasagem máxima de 90 dias (válidos apenas contas de consumo: energia, água, telefone, gás)",
  },
  {
    id: "ac_s2",
    name: "Declaração de IR e Recibo",
    type: "socios",
    processType: "atualizacao_cedente",
    obligation: "condicional",
    description: "Declaração de IR e Recibo do ano vigente — somente se não apresentado anteriormente",
  },

  // 📎 Documentos Complementares
  {
    id: "ac_c1",
    name: "Backlog de Contratos",
    type: "complementar",
    processType: "atualizacao_cedente",
    obligation: "complementar",
    description: "Backlog de contratos",
  },

  // =============================================
  // 3. RISCO SACADO
  // =============================================

  // 🏢 Documentação — Pessoa Jurídica (LTDA)
  {
    id: "rs_e1",
    name: "Contrato Social + Última Alteração Consolidada",
    type: "empresa",
    processType: "risco_sacado",
    obligation: "obrigatorio",
    description: "Contrato Social + Última Alteração Contratual Consolidada",
    subtypeCondition: "ltda",
    observations: [
      "Em caso de sócio/acionista PJ, enviar a mesma documentação descrita acima para a empresa sócia.",
      "Se a última alteração do contrato consolidado foi registrada há mais de três anos, é necessário enviar uma Certidão Simplificada da Junta Comercial com data de emissão de no máximo 90 dias.",
    ],
  },

  // 🏢 Documentação — Pessoa Jurídica (S.A.)
  {
    id: "rs_e2",
    name: "Estatuto Social em vigor",
    type: "empresa",
    processType: "risco_sacado",
    obligation: "obrigatorio",
    description: "Estatuto Social em vigor",
    subtypeCondition: "sa",
    observations: [
      "Em caso de sócio/acionista PJ, enviar a mesma documentação descrita acima para a empresa sócia.",
      "Se o estatuto consolidado foi registrado há mais de três anos, é necessário enviar uma Certidão Simplificada da Junta Comercial com data de emissão de no máximo 90 dias.",
    ],
  },
  {
    id: "rs_e3",
    name: "Ata de Eleição da Atual Diretoria",
    type: "empresa",
    processType: "risco_sacado",
    obligation: "obrigatorio",
    description: "Ata de Eleição da Atual Diretoria",
    subtypeCondition: "sa",
  },
  {
    id: "rs_e4",
    name: "Boletim de Subscrição",
    type: "empresa",
    processType: "risco_sacado",
    obligation: "obrigatorio",
    description: "Boletim de Subscrição",
    subtypeCondition: "sa",
  },

  // 👤 Documentação — Pessoa Física
  {
    id: "rs_s1",
    name: "RG/CPF ou CNH",
    type: "socios",
    processType: "risco_sacado",
    obligation: "obrigatorio",
    description: "RG/CPF ou CNH vigente",
  },

  // =============================================
  // 4. CADASTRO DE SACADO
  // =============================================

  // 📋 Análise e Estruturação
  {
    id: "cs_a1",
    name: "Apresentação do Sacado + Operação",
    type: "analise_estruturacao",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "(I) Apresentação do Sacado (breve relato) + Operação (Estrutura / Crédito / Legal) + Controles adotados para segurança do processo",
  },
  {
    id: "cs_a2",
    name: "Parecer da Gestora",
    type: "analise_estruturacao",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "(II) Parecer da Gestora",
  },
  {
    id: "cs_a3",
    name: "Fluxograma do Processo de Originação",
    type: "analise_estruturacao",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "(III) Fluxograma do processo de originação — desde a prospecção do Sacado até o pagamento dos direitos creditórios",
  },
  {
    id: "cs_a4",
    name: "Definição da Análise dos Fornecedores",
    type: "analise_estruturacao",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "(IV) Definição da análise que será realizada dos Fornecedores (Cedentes)",
  },

  // 🏢 Documentação do Sacado
  {
    id: "cs_d1",
    name: "Cartão CNPJ",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Cartão CNPJ",
    link: "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp",
  },
  {
    id: "cs_d2",
    name: "Último Contrato Social",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Último Contrato Social registrado na Junta Comercial",
  },
  {
    id: "cs_d3",
    name: "Arquivo de Sócios/Diretores/Conselheiros",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Arquivo contendo Nome / CPF dos sócios, diretores e conselheiros (se sócio PJ, abrir até o beneficiário final)",
  },
  {
    id: "cs_d4",
    name: "Último Balanço Patrimonial / DFs Auditadas",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Último Balanço Patrimonial assinado ou Demonstração Financeira Auditada",
  },
  {
    id: "cs_d5",
    name: "Certificado de Regularidade do FGTS (CRF)",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Certificado de Regularidade do FGTS (CRF) atualizado",
    link: "https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf",
  },
  {
    id: "cs_d6",
    name: "Certidão da Justiça do Trabalho",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Certidão da Justiça do Trabalho atualizada",
    link: "https://www.tst.jus.br/certidao",
  },
  {
    id: "cs_d7",
    name: "Certidão Negativa de Débitos Federais",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Certidão Negativa de Débitos — Tributos Federais e Dívida Ativa da União",
    link: "https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pj/emitir",
  },
  {
    id: "cs_d8",
    name: "Política de Contratação de Fornecedores",
    type: "documentacao_sacado",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Política (ou documento equivalente) que demonstre o processo de contratação e diligência dos fornecedores da empresa (futuros Cedentes do Fundo)",
  },

  // 📝 Convênio Risco Sacado
  {
    id: "cs_cv1",
    name: "Convênio Risco Sacado",
    type: "convenio",
    processType: "cadastro_sacado",
    obligation: "obrigatorio",
    description: "Formalizar Convênio assinado por: Sacado / Gestor / Consultoria / Fundo",
    observations: [
      "O Convênio abrange funcionamento e regras das operações, regulamentações, taxas e demais condições acordadas. Modelo fornecido à parte, quando necessário.",
    ],
  },
];

// Helper functions

export const getObligationLabel = (obligation: string) => {
  switch (obligation) {
    case 'obrigatorio':
      return 'Obrigatório';
    case 'condicional':
      return 'Condicional';
    case 'complementar':
      return 'Complementar';
    default:
      return obligation;
  }
};

export const getObligationIcon = (obligation: string) => {
  switch (obligation) {
    case 'obrigatorio':
      return '✅';
    case 'condicional':
      return '🔀';
    case 'complementar':
      return '📎';
    default:
      return '📄';
  }
};

export const getObligationBadge = (obligation: string) => {
  switch (obligation) {
    case 'obrigatorio':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'condicional':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'complementar':
      return 'bg-slate-100 text-slate-500 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getSectionLabel = (type: string) => {
  switch (type) {
    case 'financeira':
      return '💰 Financeiro';
    case 'empresa':
      return '🏢 Documentação — Pessoa Jurídica';
    case 'socios':
      return '👤 Documentação — Pessoa Física';
    case 'complementar':
      return '📎 Documentos Complementares';
    case 'analise_estruturacao':
      return '📋 Análise e Estruturação';
    case 'documentacao_sacado':
      return '🏢 Documentação do Sacado';
    case 'convenio':
      return '📝 Convênio Risco Sacado';
    default:
      return type;
  }
};

export const getProcessTypeLabel = (processType: string) => {
  switch (processType) {
    case 'cadastro_cedente':
      return 'Cadastro Cedente';
    case 'atualizacao_cedente':
      return 'Atualização de Cedente';
    case 'risco_sacado':
      return 'Risco Sacado';
    case 'cadastro_sacado':
      return 'Cadastro de Sacado';
    default:
      return processType;
  }
};

export const getProcessTypeBadge = (processType: string) => {
  switch (processType) {
    case 'cadastro_cedente':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'atualizacao_cedente':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'risco_sacado':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'cadastro_sacado':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getProcessTypeIcon = (processType: string) => {
  switch (processType) {
    case 'cadastro_cedente':
      return 'UserPlus';
    case 'atualizacao_cedente':
      return 'RefreshCw';
    case 'risco_sacado':
      return 'ShieldAlert';
    case 'cadastro_sacado':
      return 'UserCheck';
    default:
      return 'FileText';
  }
};

export const processTypeOptions = [
  { value: 'cadastro_cedente', label: 'Cadastro Cedente' },
  { value: 'atualizacao_cedente', label: 'Atualização de Cedente' },
  { value: 'risco_sacado', label: 'Risco Sacado' },
  { value: 'cadastro_sacado', label: 'Cadastro de Sacado' },
] as const;
