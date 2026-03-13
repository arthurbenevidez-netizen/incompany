import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Pencil, Trash2, Search, Monitor, Lock } from "lucide-react";

type Sistema = "credito" | "cadastro";

interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

type TipoPerfil = "interno" | "externo";

interface Profile {
  id: string;
  name: string;
  sistema: Sistema;
  tipo: TipoPerfil;
  permissions: string[];
  createdAt: Date;
}

const permissionsCredito: Permission[] = [
  { id: "cred_dashboard", label: "Visualizar Dashboard", description: "Acesso ao painel principal", category: "Dashboard" },
  { id: "cred_propostas_criar", label: "Criar Propostas", description: "Criar novas propostas de crédito", category: "Propostas" },
  { id: "cred_propostas_editar", label: "Editar Propostas", description: "Editar propostas existentes", category: "Propostas" },
  { id: "cred_propostas_aprovar", label: "Aprovar Propostas", description: "Aprovar ou rejeitar propostas", category: "Propostas" },
  { id: "cred_propostas_visualizar", label: "Visualizar Propostas", description: "Visualizar detalhes das propostas", category: "Propostas" },
  { id: "cred_empresas_gerenciar", label: "Gerenciar Empresas", description: "Adicionar e editar empresas", category: "Empresas" },
  { id: "cred_empresas_visualizar", label: "Visualizar Empresas", description: "Visualizar dados das empresas", category: "Empresas" },
  { id: "cred_relatorios", label: "Gerar Relatórios", description: "Acesso a relatórios do sistema", category: "Relatórios" },
  { id: "cred_usuarios", label: "Gerenciar Usuários", description: "Administrar usuários do sistema", category: "Administração" },
  { id: "cred_config", label: "Configurações do Sistema", description: "Alterar configurações gerais", category: "Administração" },
];

const permissionsCadastro: Permission[] = [
  { id: "cad_dashboard", label: "Visualizar Dashboard", description: "Acesso ao painel principal", category: "Dashboard" },
  { id: "cad_cadastro_criar", label: "Criar Cadastros", description: "Iniciar novos cadastros", category: "Cadastro" },
  { id: "cad_cadastro_editar", label: "Editar Cadastros", description: "Editar cadastros existentes", category: "Cadastro" },
  { id: "cad_cadastro_aprovar", label: "Aprovar Cadastros", description: "Aprovar ou rejeitar cadastros", category: "Cadastro" },
  { id: "cad_documentos_upload", label: "Upload de Documentos", description: "Enviar documentos ao sistema", category: "Documentos" },
  { id: "cad_documentos_revisar", label: "Revisar Documentos", description: "Revisar e validar documentos", category: "Documentos" },
  { id: "cad_carteira", label: "Gerenciar Carteira", description: "Acesso à carteira comercial", category: "Carteira" },
  { id: "cad_comite", label: "Acesso ao Comitê", description: "Participar do comitê de crédito", category: "Comitê" },
  { id: "cad_relatorios", label: "Gerar Relatórios", description: "Acesso a relatórios do sistema", category: "Relatórios" },
  { id: "cad_config", label: "Configurações do Sistema", description: "Alterar configurações gerais", category: "Administração" },
];

const initialProfiles: Profile[] = [
  { id: "1", name: "ADMINISTRADOR_CONSIGNADO", sistema: "credito", tipo: "interno", permissions: permissionsCredito.map(p => p.id), createdAt: new Date("2025-01-10") },
  { id: "2", name: "MESA_PROPOSTA", sistema: "credito", tipo: "interno", permissions: ["cred_dashboard", "cred_propostas_criar", "cred_propostas_editar", "cred_propostas_visualizar"], createdAt: new Date("2025-01-10") },
  { id: "3", name: "MESA_CREDITO", sistema: "credito", tipo: "interno", permissions: ["cred_dashboard", "cred_propostas_aprovar", "cred_propostas_visualizar", "cred_relatorios"], createdAt: new Date("2025-01-10") },
  { id: "4", name: "MULTI", sistema: "credito", tipo: "interno", permissions: ["cred_dashboard", "cred_propostas_visualizar", "cred_empresas_visualizar"], createdAt: new Date("2025-02-01") },
  { id: "5", name: "EMPRESA_ADMIN_CONSIGNADO", sistema: "credito", tipo: "externo", permissions: ["cred_dashboard", "cred_empresas_gerenciar", "cred_empresas_visualizar", "cred_propostas_visualizar"], createdAt: new Date("2025-02-01") },
  { id: "6", name: "EMPRESA_OPERADOR_CONSIGNADO", sistema: "credito", tipo: "externo", permissions: ["cred_dashboard", "cred_propostas_criar", "cred_empresas_visualizar"], createdAt: new Date("2025-02-01") },
  { id: "7", name: "EMPRESA_READONLY_CONSIGNADO", sistema: "credito", tipo: "externo", permissions: ["cred_dashboard", "cred_propostas_visualizar", "cred_empresas_visualizar"], createdAt: new Date("2025-02-01") },
  { id: "8", name: "ADMINISTRADOR_CADASTRO", sistema: "cadastro", tipo: "interno", permissions: permissionsCadastro.map(p => p.id), createdAt: new Date("2025-01-10") },
  { id: "9", name: "CADASTRO", sistema: "cadastro", tipo: "interno", permissions: ["cad_dashboard", "cad_cadastro_criar", "cad_cadastro_editar", "cad_documentos_upload", "cad_documentos_revisar"], createdAt: new Date("2025-01-10") },
  { id: "10", name: "GERENTE_COMERCIAL", sistema: "cadastro", tipo: "interno", permissions: ["cad_dashboard", "cad_carteira", "cad_cadastro_criar", "cad_relatorios"], createdAt: new Date("2025-01-10") },
  { id: "11", name: "DIRETORIA_COMERCIAL", sistema: "cadastro", tipo: "interno", permissions: ["cad_dashboard", "cad_carteira", "cad_relatorios", "cad_comite"], createdAt: new Date("2025-01-10") },
  { id: "12", name: "REDATOR_COMITE", sistema: "cadastro", tipo: "interno", permissions: ["cad_dashboard", "cad_comite", "cad_cadastro_aprovar", "cad_documentos_revisar"], createdAt: new Date("2025-02-01") },
  { id: "13", name: "COMITE_CREDITO", sistema: "cadastro", tipo: "interno", permissions: ["cad_dashboard", "cad_comite", "cad_cadastro_aprovar", "cad_relatorios"], createdAt: new Date("2025-02-01") },
];

const GestaoPerfilPage = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [search, setSearch] = useState("");
  const [filterSistema, setFilterSistema] = useState<"todos" | Sistema>("todos");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [formName, setFormName] = useState("");
  const [formSistema, setFormSistema] = useState<Sistema>("credito");
  const [formTipo, setFormTipo] = useState<TipoPerfil>("interno");
  const [formPermissions, setFormPermissions] = useState<string[]>([]);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null);

  const getPermissions = (sistema: Sistema) =>
    sistema === "credito" ? permissionsCredito : permissionsCadastro;

  const groupedPermissions = (sistema: Sistema) => {
    const perms = getPermissions(sistema);
    return perms.reduce<Record<string, Permission[]>>((acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    }, {});
  };

  const openCreateDialog = () => {
    setEditingProfile(null);
    setFormName("");
    setFormSistema("credito");
    setFormTipo("interno");
    setFormPermissions([]);
    setDialogOpen(true);
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
    setFormName(profile.name);
    setFormSistema(profile.sistema);
    setFormTipo(profile.tipo);
    setFormPermissions([...profile.permissions]);
    setDialogOpen(true);
  };

  const togglePermission = (id: string) => {
    setFormPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleAllCategory = (category: string) => {
    const perms = getPermissions(formSistema).filter(p => p.category === category);
    const allSelected = perms.every(p => formPermissions.includes(p.id));
    if (allSelected) {
      setFormPermissions(prev => prev.filter(id => !perms.some(p => p.id === id)));
    } else {
      setFormPermissions(prev => [...new Set([...prev, ...perms.map(p => p.id)])]);
    }
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({ title: "Nome obrigatório", description: "Informe um nome para o perfil.", variant: "destructive" });
      return;
    }
    if (formPermissions.length === 0) {
      toast({ title: "Permissões obrigatórias", description: "Selecione ao menos uma permissão.", variant: "destructive" });
      return;
    }

    if (editingProfile) {
      setProfiles(prev => prev.map(p => p.id === editingProfile.id ? { ...p, name: formName, tipo: formTipo, permissions: formPermissions } : p));
      toast({ title: "Perfil atualizado", description: `O perfil "${formName}" foi atualizado com sucesso.` });
    } else {
      const newProfile: Profile = {
        id: String(Date.now()),
        name: formName.toUpperCase().replace(/\s+/g, "_"),
        sistema: formSistema,
        tipo: formTipo,
        permissions: formPermissions,
        createdAt: new Date(),
      };
      setProfiles(prev => [...prev, newProfile]);
      toast({ title: "Perfil criado", description: `O perfil "${newProfile.name}" foi criado com sucesso.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deletingProfile) return;
    setProfiles(prev => prev.filter(p => p.id !== deletingProfile.id));
    toast({ title: "Perfil excluído", description: `O perfil "${deletingProfile.name}" foi removido.` });
    setDeleteDialogOpen(false);
    setDeletingProfile(null);
  };

  const filteredProfiles = profiles.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchSistema = filterSistema === "todos" || p.sistema === filterSistema;
    return matchSearch && matchSistema;
  });

  const creditoProfiles = filteredProfiles.filter(p => p.sistema === "credito");
  const cadastroProfiles = filteredProfiles.filter(p => p.sistema === "cadastro");

  const renderProfileTable = (items: Profile[], sistemaLabel: string) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{sistemaLabel}</CardTitle>
          <Badge variant="secondary" className="ml-auto">{items.length} perfis</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground p-6 text-center">Nenhum perfil encontrado.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Perfil</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(profile => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{profile.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.tipo === "interno" ? "default" : "outline"} className="text-xs">
                      {profile.tipo === "interno" ? "Perfil Interno" : "Perfil Externo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {profile.permissions.length} permissões
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(profile)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { setDeletingProfile(profile); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Perfis</h1>
          <p className="text-muted-foreground text-sm">Crie e gerencie perfis e permissões dos sistemas.</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar perfil..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterSistema} onValueChange={(v) => setFilterSistema(v as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por sistema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os sistemas</SelectItem>
            <SelectItem value="credito">Sistema de Crédito</SelectItem>
            <SelectItem value="cadastro">Sistema de Cadastro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Profile Tables by System */}
      <div className="space-y-6">
        {(filterSistema === "todos" || filterSistema === "credito") && renderProfileTable(creditoProfiles, "Sistema de Crédito")}
        {(filterSistema === "todos" || filterSistema === "cadastro") && renderProfileTable(cadastroProfiles, "Sistema de Cadastro")}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editingProfile ? "Editar Perfil" : "Novo Perfil"}</DialogTitle>
            <DialogDescription>
              {editingProfile ? "Altere o nome e as permissões do perfil." : "Defina o nome, sistema e permissões do novo perfil."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 pr-4">
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Perfil</Label>
                  <Input
                    placeholder="Ex: ANALISTA_CREDITO"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sistema</Label>
                  <Select
                    value={formSistema}
                    onValueChange={(v) => {
                      setFormSistema(v as Sistema);
                      setFormPermissions([]);
                    }}
                    disabled={!!editingProfile}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credito">Sistema de Crédito</SelectItem>
                      <SelectItem value="cadastro">Sistema de Cadastro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Perfil</Label>
                  <Select value={formTipo} onValueChange={(v) => setFormTipo(v as TipoPerfil)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interno">Perfil Interno</SelectItem>
                      <SelectItem value="externo">Perfil Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Permissões</Label>
                <span className="text-xs text-muted-foreground">{formPermissions.length} selecionadas</span>
              </div>

              <div className="border rounded-lg p-4 space-y-5">
                {Object.entries(groupedPermissions(formSistema)).map(([category, perms]) => {
                  const allSelected = perms.every(p => formPermissions.includes(p.id));
                  const someSelected = perms.some(p => formPermissions.includes(p.id));
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={allSelected}
                          ref={el => {
                            if (el) (el as any).indeterminate = someSelected && !allSelected;
                          }}
                          onCheckedChange={() => toggleAllCategory(category)}
                        />
                        <span className="text-sm font-semibold text-foreground">{category}</span>
                        <Badge variant="outline" className="text-xs">{perms.length}</Badge>
                      </div>
                      <div className="ml-6 space-y-1.5">
                        {perms.map(perm => (
                          <label key={perm.id} className="flex items-start gap-2 cursor-pointer group">
                            <Checkbox
                              checked={formPermissions.includes(perm.id)}
                              onCheckedChange={() => togglePermission(perm.id)}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm group-hover:text-primary transition-colors">{perm.label}</span>
                              <p className="text-xs text-muted-foreground">{perm.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingProfile ? "Salvar Alterações" : "Criar Perfil"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Perfil</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o perfil <strong>{deletingProfile?.name}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoPerfilPage;
