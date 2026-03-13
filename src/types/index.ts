export interface User {
  id: string;
  name: string;
  email: string;
  role: 'gerente_comercial' | 'equipe_cadastro' | 'cliente_externo';
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: CompanyStatus;
  processType: ProcessType;
  managerName: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  savedStatus?: 'completo' | 'incompleto';
  documentsPending?: number;
  documentsTotal?: number;
  requestedDocuments?: string[];
  requestDate?: Date;
  requestMessage?: string;
}

export interface Document {
  id: string;
  companyId: string;
  name: string;
  type: 'empresa' | 'socios' | 'financeira';
  category: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_replacement';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewerNotes?: string;
  reviewerId?: string;
}

export interface DocumentFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface DocumentWithFiles {
  id: string;
  companyId: string;
  name: string;
  type: 'empresa' | 'socios' | 'financeira';
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_replacement';
  files: DocumentFile[];
  reviewedAt?: Date;
  reviewerNotes?: string;
  reviewerId?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  type: 'empresa' | 'socios' | 'financeira';
  processType: ProcessType;
  required: boolean;
  description: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
  relatedEntity?: {
    type: 'company' | 'document' | 'process';
    id: string;
    name: string;
  };
  targetUser?: string;
}

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'needs_replacement';
export type CompanyStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'needs_review' | 'awaiting_review';
export type ProcessType = 'cadastro_cedente' | 'atualizacao_cedente' | 'risco_sacado' | 'cadastro_sacado';
