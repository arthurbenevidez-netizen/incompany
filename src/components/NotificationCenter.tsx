import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Eye, AlertTriangle, CheckCircle, Info, XCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    read: false,
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
    read: true,
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
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 4); // Show only 4 most recent

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
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    return 'agora';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Central de Notificações</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} notificação{unreadCount > 1 ? 'ões' : ''} não lida{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Nenhuma notificação</p>
                <p className="text-xs text-muted-foreground">
                  Quando houver atualizações, elas aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                        !notification.read && "bg-primary/5 border border-primary/20"
                      )}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={cn(
                                "text-sm font-medium leading-tight",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              {notification.relatedEntity && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  {notification.relatedEntity.name}
                                </Badge>
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                              className="gap-1 h-7 px-2 mt-2"
                              onClick={() => setOpen(false)}
                            >
                              <Link to={notification.actionUrl}>
                                <Eye className="h-3 w-3" />
                                Ver detalhes
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < recentNotifications.length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="w-full justify-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Link to="/notificacoes">
              <Settings className="h-4 w-4" />
              Ver todas as notificações
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}