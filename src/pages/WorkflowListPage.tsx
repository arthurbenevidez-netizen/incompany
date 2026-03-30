import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Building2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ProcessType } from "@/types";
import { getProcessTypeIconComponent } from "@/utils/processTypeUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type WorkflowStatus = "aguardando" | "em_andamento" | "aprovado" | "reprovado";

interface WorkflowItem {
  id: string;
  status: WorkflowStatus;
  processType: ProcessType;
  etapa: string;
  responsavel: string;
  cnpj: string;
  razaoSocial: string;
  ultimaAtualizacao: string;
  isGroup?: boolean;
  groupCompanies?: string[];
}

const etapas = [
  "Recrutamento", "Formalização", "Comercial", "Diretoria Comercial",
  "Comitê Redator", "Comitê de Crédito", "Cadastro e Emissão", "Habilitação"
];

const mockWorkflowItems: WorkflowItem[] = [
  { id: "1", status: "aguardando", processType: "cadastro_cedente", etapa: "Comitê de Crédito", responsavel: "Gerente Teste", cnpj: "29.184.494/0001-93", razaoSocial: "teste rating", ultimaAtualizacao: "11/03/2026" },
  { id: "2", status: "aguardando", processType: "cadastro_cedente", etapa: "Formalização", responsavel: "Gerente Teste", cnpj: "38.365.065/0001-03", razaoSocial: "Teste 30/04", ultimaAtualizacao: "11/03/2026" },
  { id: "3", status: "aguardando", processType: "cadastro_cedente", etapa: "Comitê de Crédito", responsavel: "Gerente Teste", cnpj: "24.547.952/0001-98", razaoSocial: "24.547.952/0001-98", ultimaAtualizacao: "10/03/2026" },
  { id: "4", status: "aguardando", processType: "atualizacao_cedente", etapa: "Cadastro e Emissão", responsavel: "Andreza Oliveira", cnpj: "92.331.252/0001-11", razaoSocial: "teste", ultimaAtualizacao: "11/02/2026" },
  { id: "5", status: "em_andamento", processType: "risco_sacado", etapa: "Comercial", responsavel: "Andreza Oliveira", cnpj: "61.540.433/0001-24", razaoSocial: "Teste sem cache", ultimaAtualizacao: "22/01/2026" },
  { id: "6", status: "aguardando", processType: "atualizacao_cedente", etapa: "Cadastro e Emissão", responsavel: "Gerente Teste", cnpj: "87.229.121/0001-98", razaoSocial: "TAC1502.2", ultimaAtualizacao: "21/01/2026" },
  { id: "7", status: "aguardando", processType: "cadastro_cedente", etapa: "Cadastro e Emissão", responsavel: "Arthur Benevides", cnpj: "40.517.033/0001-28", razaoSocial: "40.517.033/0001-28 teste de email", ultimaAtualizacao: "21/01/2026" },
  { id: "8", status: "em_andamento", processType: "risco_sacado", etapa: "Comercial", responsavel: "Gerente Teste", cnpj: "39.734.872/0001-19", razaoSocial: "teste sacado", ultimaAtualizacao: "21/01/2026" },
  { id: "9", status: "aguardando", processType: "risco_sacado", etapa: "Habilitação", responsavel: "Gerente Teste", cnpj: "13.494.721/0001-47", razaoSocial: "13.494.721/0001-47", ultimaAtualizacao: "21/01/2026" },
  { id: "10", status: "aguardando", processType: "cadastro_cedente", etapa: "Formalização", responsavel: "Gerente Teste", cnpj: "34.974.588/0001-04", razaoSocial: "Teste IA WORKER", ultimaAtualizacao: "20/01/2026" },
  // Group examples
  { id: "grp-1", status: "em_andamento", processType: "cadastro_cedente", etapa: "Diretoria Comercial", responsavel: "João Silva", cnpj: "12.345.678/0001-90", razaoSocial: "Grupo Alpha Holdings", ultimaAtualizacao: "27/03/2026", isGroup: true, groupCompanies: ["Indústria ABC S.A.", "ABC Logística LTDA"] },
  { id: "grp-2", status: "em_andamento", processType: "cadastro_cedente", etapa: "Comercial", responsavel: "Maria Santos", cnpj: "55.666.777/0001-88", razaoSocial: "Grupo Beta Participações", ultimaAtualizacao: "29/03/2026", isGroup: true, groupCompanies: ["Beta Comércio LTDA", "Beta Serviços S.A.", "Beta Tech LTDA"] },
];

const getProcessTypeLabel = (type: ProcessType) => {
  switch (type) {
    case 'cadastro_cedente': return 'Cedente';
    case 'atualizacao_cedente': return 'Atualização de Cedente';
    case 'risco_sacado': return 'Risco Sacado';
    case 'cadastro_sacado': return 'Cadastro de Sacado';
  }
};

const getStatusBadge = (status: WorkflowStatus) => {
  switch (status) {
    case 'aguardando':
      return <Badge className="bg-primary text-primary-foreground">Aguardando</Badge>;
    case 'em_andamento':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">Em Andamento</Badge>;
    case 'aprovado':
      return <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">Aprovado</Badge>;
    case 'reprovado':
      return <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">Reprovado</Badge>;
  }
};

type SortField = 'status' | 'processType' | 'etapa' | 'responsavel' | 'cnpj' | 'razaoSocial' | 'ultimaAtualizacao';
type SortDir = 'asc' | 'desc';

export default function WorkflowListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [etapaFilter, setEtapaFilter] = useState<string>("todos");
  const [orderFilter, setOrderFilter] = useState<string>("recentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-muted-foreground/50" />;
    return sortDir === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
      : <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />;
  };

  let filtered = mockWorkflowItems.filter(item => {
    if (statusFilter !== "todos" && item.status !== statusFilter) return false;
    if (etapaFilter !== "todos" && item.etapa !== etapaFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (!item.razaoSocial.toLowerCase().includes(s) && !item.cnpj.includes(s)) return false;
    }
    return true;
  });

  // Default ordering
  if (orderFilter === "recentes") {
    // Already in order from mock
  } else if (orderFilter === "antigos") {
    filtered = [...filtered].reverse();
  }

  // Column sorting
  if (sortField) {
    filtered = [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      return aVal.localeCompare(bVal) * dir;
    });
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <nav className="text-sm text-muted-foreground">Home &gt; Workflows</nav>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="aguardando">Aguardando</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="reprovado">Reprovado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={etapaFilter} onValueChange={(v) => { setEtapaFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a etapa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as etapas</SelectItem>
            {etapas.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={orderFilter} onValueChange={setOrderFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Atualizados recentemente</SelectItem>
            <SelectItem value="antigos">Mais antigos primeiro</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por Razão Social ou CNPJ"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('status')}>
                    Status <SortIcon field="status" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('razaoSocial')}>
                    Razão Social <SortIcon field="razaoSocial" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('cnpj')}>
                    CNPJ <SortIcon field="cnpj" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('responsavel')}>
                    Responsável <SortIcon field="responsavel" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('processType')}>
                    Processo <SortIcon field="processType" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('etapa')}>
                    Etapa <SortIcon field="etapa" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center hover:text-foreground transition-colors" onClick={() => handleSort('ultimaAtualizacao')}>
                    Última Atualização <SortIcon field="ultimaAtualizacao" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Nenhum workflow encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map(item => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/workflow/${item.id}`)}
                  >
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.razaoSocial}</TableCell>
                    <TableCell className="font-mono text-sm">{item.cnpj}</TableCell>
                    <TableCell className="font-medium">{item.responsavel}</TableCell>
                    <TableCell>{getProcessTypeLabel(item.processType)}</TableCell>
                    <TableCell>{item.etapa}</TableCell>
                    <TableCell className="text-right">{item.ultimaAtualizacao}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Itens por página:</span>
          <span className="text-sm font-medium">{itemsPerPage}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className="w-9"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
