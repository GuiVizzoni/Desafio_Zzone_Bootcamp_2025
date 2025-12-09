import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockOrders } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  pendente: {
    label: 'Aguardando aprovação',
    color: 'bg-warning/10 text-warning border-warning/20',
    icon: Clock,
  },
  em_andamento: {
    label: 'Em andamento',
    color: 'bg-info/10 text-info border-info/20',
    icon: Clock,
  },
  revisao: {
    label: 'Em revisão',
    color: 'bg-warning/10 text-warning border-warning/20',
    icon: AlertCircle,
  },
  concluido: {
    label: 'Concluído',
    color: 'bg-success/10 text-success border-success/20',
    icon: CheckCircle2,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: AlertCircle,
  },
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('progress');

  // Se tem ID, mostra detalhes do pedido específico
  if (id) {
    return <OrderDetailView orderId={id} />;
  }

  // Caso contrário, mostra lista de pedidos (histórico)
  const inProgressOrders = mockOrders.filter((o) => o.status === 'em_andamento');
  const inReviewOrders = mockOrders.filter((o) => o.status === 'revisao');
  const completedOrders = mockOrders.filter((o) => o.status === 'concluido');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const openWhatsApp = (whatsapp?: string, orderId?: string) => {
    if (whatsapp) {
      const message = encodeURIComponent(`Olá! Sobre o pedido #${orderId}...`);
      window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
    }
  };

  const OrderCard = ({ order }: { order: typeof mockOrders[0] }) => {
    const StatusIcon = statusConfig[order.status].icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={order.service.portfolio[0]}
                    alt={order.service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {order.service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Pedido em {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={order.service.creator.avatar} />
                <AvatarFallback>{order.service.creator.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{order.service.creator.name}</span>
            </div>

            {/* Status & Price */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn('text-xs', statusConfig[order.status].color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[order.status].label}
              </Badge>
              <span className="font-semibold text-sm">{formatPrice(order.package.price)}</span>
            </div>

            {/* Actions */}
            {order.status !== 'concluido' && order.status !== 'cancelado' && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openWhatsApp(order.whatsappNumber, order.id)}
                >
                  <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                  Mensagem
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => window.location.href = `/order-tracking/${order.id}`}
                >
                  Ver detalhes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MobileLayout>
      <Header title="Histórico de pedidos" showBack />

      <div className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="progress" className="text-xs py-2 relative">
              Em andamento
              {inProgressOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-info text-white text-[10px] flex items-center justify-center">
                  {inProgressOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="review" className="text-xs py-2 relative">
              Em revisão
              {inReviewOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning text-white text-[10px] flex items-center justify-center">
                  {inReviewOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2">
              Concluídos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-4 space-y-3">
            {inProgressOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum pedido em andamento</p>
                </CardContent>
              </Card>
            ) : (
              inProgressOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="review" className="mt-4 space-y-3">
            {inReviewOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum pedido em revisão</p>
                </CardContent>
              </Card>
            ) : (
              inReviewOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum pedido concluído ainda</p>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}

// Componente para visualização de detalhes de um pedido específico
function OrderDetailView({ orderId }: { orderId: string }) {
  const order = mockOrders.find((o) => o.id === orderId);

  const orderSteps = [
    { key: 'pendente', label: 'Pedido enviado' },
    { key: 'em_andamento', label: 'Em produção' },
    { key: 'revisao', label: 'Revisão' },
    { key: 'concluido', label: 'Entregue' },
  ];

  if (!order) {
    return (
      <MobileLayout showNav={false}>
        <Header showBack title="Pedido não encontrado" />
        <div className="p-4 text-center">
          <p>Este pedido não existe.</p>
        </div>
      </MobileLayout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const currentStepIndex = orderSteps.findIndex((s) => s.key === order.status);
  const StatusIcon = statusConfig[order.status].icon;

  const openWhatsApp = () => {
    if (order.whatsappNumber) {
      const message = encodeURIComponent(
        `Olá! Gostaria de falar sobre meu pedido #${order.id} - ${order.service.title}`
      );
      window.open(`https://wa.me/${order.whatsappNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <MobileLayout>
      <Header showBack title="Acompanhar pedido" />

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('p-2 rounded-full', statusConfig[order.status].color)}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{statusConfig[order.status].label}</p>
                <p className="text-sm text-muted-foreground">
                  Pedido #{order.id}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="relative">
              <div className="absolute top-3 left-3 right-3 h-0.5 bg-border" />
              <div 
                className="absolute top-3 left-3 h-0.5 bg-primary transition-all"
                style={{ width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {orderSteps.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div 
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 bg-background',
                        index <= currentStepIndex 
                          ? 'border-primary text-primary' 
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      {index <= currentStepIndex ? (
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1.5 text-center max-w-[60px]">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={order.service.portfolio[0]} 
                  alt={order.service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">{order.service.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={order.service.creator.avatar} />
                    <AvatarFallback>{order.service.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{order.service.creator.name}</span>
                </div>
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Detalhes do pedido</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pacote</span>
                <span className="font-medium">{order.package.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data do pedido</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Previsão de entrega</span>
                <span>{formatDate(order.deliveryDate)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-sm font-medium mb-1">Descrição:</p>
              <p className="text-sm text-muted-foreground">{order.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Requisitos:</p>
              <p className="text-sm text-muted-foreground">{order.requirements}</p>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Contact */}
        {order.whatsappNumber && (
          <Button 
            variant="outline" 
            className="w-full h-12 gap-2"
            onClick={openWhatsApp}
          >
            <MessageCircle className="h-5 w-5 text-success" />
            Falar com o criador via WhatsApp
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
        )}
      </div>
    </MobileLayout>
  );
}
