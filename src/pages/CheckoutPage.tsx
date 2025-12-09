import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockServices } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { trackCheckoutStarted, trackOrderCreated } from '@/lib/n8n';

export default function CheckoutPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const packageIndex = parseInt(searchParams.get('package') || '0');
  const service = mockServices.find((s) => s.id === id);
  const selectedPackage = service?.packages[packageIndex];

  const [description, setDescription] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [requirements, setRequirements] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Track checkout started
  useEffect(() => {
    if (service && selectedPackage) {
      trackCheckoutStarted(service.id, selectedPackage.id);
    }
  }, [service, selectedPackage]);

  if (!service) {
    return (
      <MobileLayout showNav={false}>
        <Header showBack title="Erro" />
        <div className="p-4 text-center">
          <p>Serviço não encontrado.</p>
        </div>
      </MobileLayout>
    );
  }

  if (!selectedPackage) {
    return (
      <MobileLayout showNav={false}>
        <Header showBack title="Erro" />
        <div className="p-4 text-center">
          <p>Pacote não encontrado.</p>
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

  const handleSubmit = () => {
    if (!description || !projectDuration || !requirements) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    // Generate order ID
    const orderId = `o${Date.now()}`;
    
    // Track order creation
    trackOrderCreated(
      orderId,
      service.id,
      selectedPackage.id,
      selectedPackage.price
    );

    toast({
      title: 'Pedido enviado!',
      description: 'Você será redirecionado para acompanhar seu pedido.',
    });

    setTimeout(() => {
      navigate(`/order-tracking/${orderId}`);
    }, 1500);
  };

  return (
    <MobileLayout showNav={false}>
      <Header showBack title="Finalizar pedido" />

      <div className="p-4 space-y-4 pb-32">
        {/* Order Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={service.portfolio[0]} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">{service.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={service.creator.avatar} />
                    <AvatarFallback>{service.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{service.creator.name}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Pacote {selectedPackage.name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedPackage.deliveryDays}d
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Form */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold">Detalhes do projeto</h2>

          <div className="space-y-2">
            <Label htmlFor="description">Descreva seu projeto *</Label>
            <Textarea
              id="description"
              placeholder="Explique o que você precisa, qual o objetivo do conteúdo, referências visuais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração estimada do projeto *</Label>
            <Select value={projectDuration} onValueChange={setProjectDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1 a 3 dias</SelectItem>
                <SelectItem value="4-7">4 a 7 dias</SelectItem>
                <SelectItem value="8-14">8 a 14 dias</SelectItem>
                <SelectItem value="15-30">15 a 30 dias</SelectItem>
                <SelectItem value="30+">Mais de 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requisitos específicos *</Label>
            <Textarea
              id="requirements"
              placeholder="Cores, estilo, formato, plataforma de destino, arquivos que você enviará..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp para contato (opcional)</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        {/* Package Features */}
        <Card className="bg-accent/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">O que está incluso:</h3>
            <ul className="space-y-2">
              {selectedPackage.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  {feature}
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                {selectedPackage.revisions} {selectedPackage.revisions === 1 ? 'revisão' : 'revisões'}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <Shield className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Pagamento seguro. O valor só é liberado após a entrega.
          </p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold text-primary">
              {formatPrice(selectedPackage.price)}
            </span>
          </div>
          <Button 
            className="w-full h-12 rounded-xl font-semibold gap-2"
            onClick={handleSubmit}
          >
            <CreditCard className="h-4 w-4" />
            Confirmar e pagar
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
