import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, MessageCircle, ExternalLink } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockOrders } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  pendente: {
    label: 'Aguardando aprovação',
    color: 'bg-warning/10 text-warning',
    icon: Clock,
  },
  em_andamento: {
    label: 'Em andamento',
    color: 'bg-info/10 text-info',
    icon: Clock,
  },
  revisao: {
    label: 'Em revisão',
    color: 'bg-warning/10 text-warning',
    icon: AlertCircle,
  },
  concluido: {
    label: 'Concluído',
    color: 'bg-success/10 text-success',
    icon: CheckCircle2,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-destructive/10 text-destructive',
    icon: AlertCircle,
  },
};

const orderSteps = [
  { key: 'pendente', label: 'Pedido enviado' },
  { key: 'em_andamento', label: 'Em produção' },
  { key: 'revisao', label: 'Revisão' },
  { key: 'concluido', label: 'Entregue' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const order = mockOrders.find((o) => o.id === id);

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
