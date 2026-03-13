import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Eye, Clock, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Cadastro Aprovado",
    message: "O cadastro da empresa Tech Solutions LTDA foi aprovado com sucesso.",
    createdAt: new Date("2024-01-20T10:30:00"),
    read: false,
    actionUrl: "/empresa/1",
    relatedEntity: {
      type: "company",
      id: "1",
      name: "Tech Solutions LTDA"
    }
  },
  {
    id: "2", 
    type: "warning",
    title: "Documentação Pendente",
    message: "A empresa Inovação Corp está com 3 documentos pendentes de análise.",
    createdAt: new Date("2024-01-20T09:15:00"),
    read: false,
    actionUrl: "/empresa/2",
    relatedEntity: {
      type: "company",
      id: "2", 
      name: "Inovação Corp"
    }
  },
  {
    id: "3",
    type: "info",
    title: "Novo Cadastro Iniciado", 
    message: "StartupTech iniciou o processo de cadastro cedente.",
    createdAt: new Date("2024-01-19T16:45:00"),
    read: true,
    actionUrl: "/empresa/3",
    relatedEntity: {
      type: "company",
      id: "3",
      name: "StartupTech"
    }
  },
  {
    id: "4",
    type: "error",
    title: "Documento Rejeitado",
    message: "O contrato social da empresa MegaCorp foi rejeitado. Necessária substituição.",
    createdAt: new Date("2024-01-19T14:20:00"),
    read: false,
    actionUrl: "/empresa/4",
    relatedEntity: {
      type: "document",
      id: "doc-1",
      name: "Contrato Social - MegaCorp"
    }
  },
  {
    id: "5",
    type: "warning", 
    title: "Prazo de Análise",
    message: "O processo de risco sacado da Logística Express está próximo do prazo limite.",
    createdAt: new Date("2024-01-19T11:30:00"),
    read: true,
    actionUrl: "/empresa/5",
    relatedEntity: {
      type: "process",
      id: "proc-1", 
      name: "Risco Sacado - Logística Express"
    }
  },
  {
    id: "6",
    type: "info",
    title: "Convite Enviado",
    message: "Convite por email foi enviado para FinanceiraXYZ completar o cadastro.",
    createdAt: new Date("2024-01-18T13:00:00"),
    read: true,
    actionUrl: "/empresa/6",
    relatedEntity: {
      type: "company",
      id: "6",
      name: "FinanceiraXYZ"
    }
  }
];

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-success bg-success/5';
      case 'warning':
        return 'border-l-warning bg-warning/5';
      case 'error':
        return 'border-l-destructive bg-destructive/5';
      default:
        return 'border-l-info bg-info/5';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
    if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    }
    return 'Agora mesmo';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            Acompanhe atualizações de processos e documentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
          <Badge variant="secondary" className="gap-1">
            <Bell className="h-3 w-3" />
            {unreadCount} não lidas
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Não lidas ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">
                  {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {filter === 'unread' 
                    ? 'Todas as notificações foram lidas'
                    : 'Quando houver atualizações nos processos, elas aparecerão aqui'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={cn(
                    "border-l-4 transition-all hover:shadow-md cursor-pointer",
                    getNotificationStyle(notification.type),
                    !notification.read && "ring-1 ring-primary/20"
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={cn(
                              "font-medium text-sm",
                              !notification.read && "text-foreground font-semibold"
                            )}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            
                            {notification.relatedEntity && (
                              <div className="flex items-center gap-1 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {notification.relatedEntity.name}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        {notification.actionUrl && (
                          <div className="mt-3 pt-2 border-t border-border">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                              className="gap-2 h-8 px-2"
                            >
                              <Link to={notification.actionUrl}>
                                <Eye className="h-3 w-3" />
                                Ver detalhes
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}