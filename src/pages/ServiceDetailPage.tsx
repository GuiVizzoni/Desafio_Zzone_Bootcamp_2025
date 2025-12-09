import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Shield, MessageCircle, Heart, Share2, ChevronRight } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { mockServices } from '@/data/mockData';
import { categoryLabels, levelLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { trackServiceView, trackServiceInterest } from '@/lib/n8n';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const service = mockServices.find((s) => s.id === id);

  // Track service view when page loads
  useEffect(() => {
    if (service) {
      trackServiceView(service.id);
    }
  }, [service]);

  const handleInterest = () => {
    setIsFavorite(!isFavorite);
    if (service && !isFavorite) {
      trackServiceInterest(service.id);
    }
  };

  if (!service) {
    return (
      <MobileLayout>
        <Header showBack title="Serviço não encontrado" />
        <div className="p-4 text-center">
          <p>Este serviço não existe.</p>
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

  const currentPackage = service.packages[selectedPackage];

  return (
    <MobileLayout showNav={false}>
      <Header 
        showBack 
        rightContent={
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={handleInterest}
            >
              <Heart className={cn('h-5 w-5', isFavorite && 'fill-destructive text-destructive')} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        }
      />

      <div className="pb-24">
        {/* Portfolio Gallery */}
        <div className="relative aspect-video bg-muted">
          <img 
            src={service.portfolio[0]} 
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
            1/{service.portfolio.length}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Category & Level */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{categoryLabels[service.category]}</Badge>
            <Badge variant="outline" className="border-primary text-primary">
              {levelLabels[service.creator.level]}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="font-display text-xl font-semibold leading-tight">
            {service.title}
          </h1>

          {/* Creator Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                <AvatarImage src={service.creator.avatar} />
                <AvatarFallback>{service.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{service.creator.name}</span>
                  {service.creator.verified && (
                    <svg className="h-4 w-4 text-primary fill-current" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{service.creator.segment}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-1.5" />
              Contato
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 py-3 border-y border-border">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-semibold">{service.creator.rating}</span>
              <span className="text-sm text-muted-foreground">({service.creator.reviewCount} avaliações)</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-sm">{service.salesCount} vendas</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {service.description}
          </p>

          {/* Packages */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold">Pacotes</h2>
            <Tabs 
              value={selectedPackage.toString()} 
              onValueChange={(v) => setSelectedPackage(parseInt(v))}
            >
              <TabsList className="w-full grid grid-cols-3 h-auto p-1">
                {service.packages.map((pkg, index) => (
                  <TabsTrigger 
                    key={pkg.id} 
                    value={index.toString()}
                    className="text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {pkg.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {service.packages.map((pkg, index) => (
                <TabsContent key={pkg.id} value={index.toString()} className="mt-3">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{pkg.name}</p>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        </div>
                        <p className="font-display text-xl font-bold text-primary">
                          {formatPrice(pkg.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{pkg.deliveryDays} dias</span>
                        </div>
                        <div className="text-muted-foreground">
                          {pkg.revisions} {pkg.revisions === 1 ? 'revisão' : 'revisões'}
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <svg className="h-4 w-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Portfolio Grid */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold">Portfólio</h2>
            <div className="grid grid-cols-3 gap-2">
              {service.portfolio.map((img, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Pacote {currentPackage.name}</p>
            <p className="font-display text-xl font-bold text-primary">
              {formatPrice(currentPackage.price)}
            </p>
          </div>
          <Button 
            className="flex-1 h-12 rounded-xl font-semibold"
            onClick={() => navigate(`/checkout/${service.id}?package=${selectedPackage}`)}
          >
            Continuar
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
