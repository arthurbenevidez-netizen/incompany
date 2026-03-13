import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, Send, Clock, Mail, Users, History, Bold, Italic, Underline, List, Link, Zap, CalendarClock, Eye, Building2, User, AtSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmailHistory {
  id: string;
  subject: string;
  system: string;
  profiles: string[];
  sentAt: Date;
  recipientCount: number;
  status: 'sent' | 'scheduled' | 'failed';
}

// Perfis categorizados por sistema
const profilesBySystem = {
  credito: [
    { id: 'ADMINISTRADOR_CONSIGNADO', label: 'Administrador Consignado' },
    { id: 'MESA_PROPOSTA', label: 'Mesa Proposta' },
    { id: 'MESA_CREDITO', label: 'Mesa de Crédito' },
    { id: 'MULTI', label: 'Multi' },
    { id: 'EMPRESA_ADMIN_CONSIGNADO', label: 'Empresa Admin Consignado' },
    { id: 'EMPRESA_OPERADOR_CONSIGNADO', label: 'Empresa Operador Consignado' },
    { id: 'EMPRESA_READONLY_CONSIGNADO', label: 'Empresa Readonly Consignado' },
  ],
  cadastro: [
    { id: 'ADMINISTRADOR_CADASTRO', label: 'Administrador Cadastro' },
    { id: 'CADASTRO', label: 'Cadastro' },
    { id: 'GERENTE_COMERCIAL', label: 'Gerente Comercial' },
    { id: 'DIRETORIA_COMERCIAL', label: 'Diretoria Comercial' },
    { id: 'REDATOR_COMITE', label: 'Redator Comitê' },
    { id: 'COMITE_CREDITO', label: 'Comitê de Crédito' },
  ]
};

const mockHistory: EmailHistory[] = [
  {
    id: '1',
    subject: 'Manutenção programada - 15/12',
    system: 'credito',
    profiles: ['ADMINISTRADOR_CONSIGNADO', 'MESA_CREDITO'],
    sentAt: new Date('2024-12-10T10:00:00'),
    recipientCount: 45,
    status: 'sent'
  },
  {
    id: '2',
    subject: 'Nova funcionalidade disponível',
    system: 'cadastro',
    profiles: ['ADMINISTRADOR_CADASTRO', 'CADASTRO'],
    sentAt: new Date('2024-12-08T14:30:00'),
    recipientCount: 32,
    status: 'sent'
  },
  {
    id: '3',
    subject: 'Atualização de segurança',
    system: 'credito',
    profiles: ['ADMINISTRADOR_CONSIGNADO'],
    sentAt: new Date('2024-12-20T09:00:00'),
    recipientCount: 12,
    status: 'scheduled'
  },
];

export default function ProgramacaoAvisosPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<'credito' | 'cadastro' | ''>('');
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [sendMode, setSendMode] = useState<'now' | 'scheduled'>('now');
  const [history] = useState<EmailHistory[]>(mockHistory);
  const [showPreview, setShowPreview] = useState(false);

  // Limpar perfis selecionados quando mudar o sistema
  useEffect(() => {
    setSelectedProfiles([]);
  }, [selectedSystem]);

  const currentProfiles = selectedSystem ? profilesBySystem[selectedSystem] : [];

  const toggleProfile = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(p => p !== profileId)
        : [...prev, profileId]
    );
  };

  const selectAllProfiles = () => {
    if (selectedProfiles.length === currentProfiles.length) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(currentProfiles.map(p => p.id));
    }
  };

  const canPreview = subject && body && selectedSystem && selectedProfiles.length > 0;

  const handlePreview = () => {
    if (!canPreview) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos para visualizar a prévia.",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
  };

  const handleSend = () => {
    if (!subject || !body || !selectedSystem || selectedProfiles.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    if (sendMode === 'scheduled' && (!scheduleDate || !scheduleTime)) {
      toast({
        title: "Data e hora obrigatórios",
        description: "Informe a data e hora para agendamento.",
        variant: "destructive"
      });
      return;
    }

    setShowPreview(false);
    
    toast({
      title: sendMode === 'scheduled' ? "E-mail agendado!" : "E-mail enviado!",
      description: sendMode === 'scheduled' 
        ? `O e-mail será enviado em ${scheduleDate} às ${scheduleTime}.`
        : "O e-mail foi enviado com sucesso para os destinatários selecionados.",
    });

    // Reset form
    setSubject('');
    setBody('');
    setSelectedSystem('');
    setSelectedProfiles([]);
    setScheduleDate('');
    setScheduleTime('');
    setSendMode('now');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Enviado</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Agendado</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Falhou</Badge>;
      default:
        return null;
    }
  };

  const getSystemLabel = (system: string) => {
    return system === 'credito' ? 'Sistema de Crédito' : 'Sistema de Cadastro';
  };

  const getProfileLabels = (profileIds: string[]) => {
    const allProfiles = [...profilesBySystem.credito, ...profilesBySystem.cadastro];
    return profileIds.map(id => allProfiles.find(p => p.id === id)?.label || id).join(', ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Programação de Avisos</h1>
        <p className="text-muted-foreground">
          Gerencie comunicações e avisos para os usuários do sistema
        </p>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose" className="gap-2">
            <Mail className="h-4 w-4" />
            Compor E-mail
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configurações do E-mail */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Compor Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    placeholder="Digite o assunto do e-mail..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Corpo do E-mail</Label>
                  <div className="border rounded-md">
                    <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-4 bg-border mx-1" />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <List className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Digite o conteúdo do e-mail..."
                      className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                </div>

                {/* Seção de Agendamento Destacada */}
                <Card className="border-2 border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarClock className="h-5 w-5 text-primary" />
                      Quando enviar?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup 
                      value={sendMode} 
                      onValueChange={(value) => setSendMode(value as 'now' | 'scheduled')}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label 
                        htmlFor="send-now" 
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          sendMode === 'now' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-muted-foreground/50'
                        }`}
                      >
                        <RadioGroupItem value="now" id="send-now" />
                        <div className="flex items-center gap-2">
                          <Zap className={`h-5 w-5 ${sendMode === 'now' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium">Enviar Agora</p>
                            <p className="text-xs text-muted-foreground">Disparo imediato</p>
                          </div>
                        </div>
                      </Label>
                      
                      <Label 
                        htmlFor="send-scheduled" 
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          sendMode === 'scheduled' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-muted-foreground/50'
                        }`}
                      >
                        <RadioGroupItem value="scheduled" id="send-scheduled" />
                        <div className="flex items-center gap-2">
                          <Clock className={`h-5 w-5 ${sendMode === 'scheduled' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium">Agendar</p>
                            <p className="text-xs text-muted-foreground">Escolha data e hora</p>
                          </div>
                        </div>
                      </Label>
                    </RadioGroup>

                    {sendMode === 'scheduled' && (
                      <div className="grid grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                          <Label htmlFor="schedule-date" className="text-sm">Data do Envio</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="schedule-date"
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="pl-10"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule-time" className="text-sm">Horário do Envio</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="schedule-time"
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        {scheduleDate && scheduleTime && (
                          <div className="col-span-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-sm text-center">
                              <span className="text-muted-foreground">O e-mail será enviado em </span>
                              <span className="font-semibold text-primary">
                                {new Date(scheduleDate).toLocaleDateString('pt-BR', { 
                                  weekday: 'long', 
                                  day: 'numeric', 
                                  month: 'long' 
                                })} às {scheduleTime}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Configurações de Destinatários */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5" />
                    Sistema de Destino
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={selectedSystem} 
                    onValueChange={(value) => setSelectedSystem(value as 'credito' | 'cadastro')}
                    className="space-y-2"
                  >
                    <Label 
                      htmlFor="system-credito" 
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSystem === 'credito' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <RadioGroupItem value="credito" id="system-credito" />
                      <span className="font-medium">Sistema de Crédito</span>
                    </Label>
                    
                    <Label 
                      htmlFor="system-cadastro" 
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSystem === 'cadastro' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <RadioGroupItem value="cadastro" id="system-cadastro" />
                      <span className="font-medium">Sistema de Cadastro</span>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-5 w-5" />
                      Perfis de Usuário
                    </CardTitle>
                    {selectedSystem && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={selectAllProfiles}
                        className="text-xs h-7"
                      >
                        {selectedProfiles.length === currentProfiles.length ? 'Desmarcar todos' : 'Selecionar todos'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!selectedSystem ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Selecione um sistema para ver os perfis disponíveis
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {currentProfiles.map((profile) => (
                          <div 
                            key={profile.id} 
                            className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                              selectedProfiles.includes(profile.id) ? 'bg-primary/5' : 'hover:bg-muted/50'
                            }`}
                          >
                            <Checkbox
                              id={profile.id}
                              checked={selectedProfiles.includes(profile.id)}
                              onCheckedChange={() => toggleProfile(profile.id)}
                            />
                            <Label htmlFor={profile.id} className="cursor-pointer text-sm flex-1">
                              {profile.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {selectedProfiles.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">
                            {selectedProfiles.length} perfil(is) selecionado(s):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfiles.map(id => (
                              <Badge key={id} variant="secondary" className="text-xs">
                                {currentProfiles.find(p => p.id === id)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview} 
                  className="flex-1 gap-2"
                  disabled={!canPreview}
                >
                  <Eye className="h-4 w-4" />
                  Pré-visualizar
                </Button>
                <Button onClick={handleSend} className="flex-1 gap-2" size="lg">
                  {sendMode === 'scheduled' ? (
                    <>
                      <CalendarClock className="h-4 w-4" />
                      Agendar
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de E-mails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Sistema</TableHead>
                    <TableHead>Perfis</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">{email.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getSystemLabel(email.system)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {getProfileLabels(email.profiles)}
                      </TableCell>
                      <TableCell>
                        {email.sentAt.toLocaleDateString('pt-BR')} às{' '}
                        {email.sentAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>{email.recipientCount}</TableCell>
                      <TableCell>{getStatusBadge(email.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Pré-visualização */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Pré-visualização do E-mail
            </DialogTitle>
            <DialogDescription>
              Confira como o e-mail será exibido para os destinatários
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Informações de envio */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Sistema: </span>
                  <span className="font-medium">{getSystemLabel(selectedSystem)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Destinatários: </span>
                  <span className="font-medium">{selectedProfiles.length} perfil(is)</span>
                </span>
              </div>
              {sendMode === 'scheduled' && scheduleDate && scheduleTime && (
                <div className="col-span-2 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Agendado para: </span>
                    <span className="font-medium">
                      {new Date(scheduleDate).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })} às {scheduleTime}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Perfis selecionados */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Perfis que receberão:</Label>
              <div className="flex flex-wrap gap-1">
                {selectedProfiles.map(id => (
                  <Badge key={id} variant="secondary" className="text-xs">
                    {currentProfiles.find(p => p.id === id)?.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Preview do E-mail */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              {/* Header do E-mail */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sistema de Notificações</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AtSign className="h-3 w-3" />
                      noreply@sistema.com.br
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Para:</span>
                  <span className="text-foreground">
                    {selectedProfiles.length === 1 
                      ? currentProfiles.find(p => p.id === selectedProfiles[0])?.label
                      : `${selectedProfiles.length} grupos de usuários`
                    }
                  </span>
                </div>
              </div>

              {/* Assunto */}
              <div className="p-4 border-b bg-background">
                <p className="font-semibold text-lg">{subject || 'Sem assunto'}</p>
              </div>

              {/* Corpo do E-mail */}
              <div className="p-6 bg-background min-h-[200px]">
                <div className="prose prose-sm max-w-none">
                  {body ? (
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Nenhum conteúdo</p>
                  )}
                </div>
              </div>

              {/* Footer do E-mail */}
              <div className="p-4 border-t bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground">
                  Este é um e-mail automático enviado pelo {getSystemLabel(selectedSystem)}.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Por favor, não responda a esta mensagem.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Voltar e Editar
            </Button>
            <Button onClick={handleSend} className="gap-2">
              {sendMode === 'scheduled' ? (
                <>
                  <CalendarClock className="h-4 w-4" />
                  Confirmar Agendamento
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Confirmar Envio
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
