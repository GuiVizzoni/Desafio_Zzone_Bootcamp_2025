import { useState } from 'react';
import { DollarSign, CheckCircle2, Clock, Star, ChevronRight, MessageCircle, Check, X } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockOrders, mockDashboardStats } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusConfig = {
  pendente: { label: 'Pendente', color: 'bg-warning/10 text-warning border-warning/20' },
  em_andamento: { label: 'Em andamento', color: 'bg-info/10 text-info border-info/20' },
  revisao: { label: 'Revisão', color: 'bg-warning/10 text-warning border-warning/20' },
  concluido: { label: 'Concluído', color: 'bg-success/10 text-success border-success/20' },
  cancelado: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('queue');

  const pendingOrders = mockOrders.filter((o) => o.status === 'pendente');
  const inProgressOrders = mockOrders.filter((o) => o.status === 'em_andamento' || o.status === 'revisao');
  const completedOrders = mockOrders.filter((o) => o.status === 'concluido');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAccept = (orderId: string) => {
    toast({
      title: 'Pedido aceito!',
      description: 'O cliente será notificado.',
    });
  };

  const handleReject = (orderId: string) => {
    toast({
      title: 'Pedido recusado',
      description: 'O cliente será reembolsado.',
      variant: 'destructive',
    });
  };

  const handleRequestRevision = (orderId: string) => {
    toast({
      title: 'Revisão solicitada',
      description: 'O cliente precisa enviar mais detalhes.',
    });
  };

  const handleComplete = (orderId: string) => {
    toast({
      title: 'Pedido concluído!',
      description: 'O pagamento será liberado em breve.',
    });
  };

  const openWhatsApp = (whatsapp?: string, orderId?: string) => {
    if (whatsapp) {
      const message = encodeURIComponent(`Olá! Sobre o pedido #${orderId}...`);
      window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
    }
  };

  return (
    <MobileLayout>
      <Header title="Painel" showNotifications />

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium">Ganhos do mês</span>
              </div>
              <p className="font-display text-2xl font-bold">
                {formatPrice(mockDashboardStats.monthlyEarnings)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Finalizados</span>
              </div>
              <p className="font-display text-2xl font-bold">
                {mockDashboardStats.completedProjects}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Na fila</span>
              </div>
              <p className="font-display text-2xl font-bold">
                {mockDashboardStats.pendingProjects}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Star className="h-4 w-4" />
                <span className="text-xs font-medium">Avaliação</span>
              </div>
              <p className="font-display text-2xl font-bold">
                {mockDashboardStats.averageRating}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="queue" className="text-xs py-2 relative">
              Fila
              {pendingOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs py-2">
              Em andamento
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2">
              Concluídos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-4 space-y-3">
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum pedido na fila</p>
                </CardContent>
              </Card>
            ) : (
              pendingOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.buyer.avatar} />
                          <AvatarFallback>{order.buyer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{order.buyer.name}</p>
                          <p className="text-xs text-muted-foreground">#{order.id}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Pacote {order.package.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {order.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prazo: {order.duration}</span>
                      <span className="font-semibold text-primary">{formatPrice(order.totalPrice)}</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => handleReject(order.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Recusar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAccept(order.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aceitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-4 space-y-3">
            {inProgressOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>Nenhum projeto em andamento</p>
                </CardContent>
              </Card>
            ) : (
              inProgressOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.buyer.avatar} />
                          <AvatarFallback>{order.buyer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{order.buyer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Entrega: {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {order.requirements}
                    </p>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openWhatsApp(order.whatsappNumber, order.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRequestRevision(order.id)}
                      >
                        Solicitar revisão
                      </Button>
                      <Button 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => handleComplete(order.id)}
                      >
                        Concluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>Nenhum projeto concluído</p>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.buyer.avatar} />
                          <AvatarFallback>{order.buyer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{order.buyer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Pacote {order.package.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatPrice(order.totalPrice)}</p>
                        <p className="text-xs text-success">Pago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
