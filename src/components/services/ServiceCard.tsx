import { Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Service } from '@/types/marketplace';
import { categoryLabels, levelLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Link 
      to={`/service/${service.id}`}
      className="block bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden animate-fade-in"
    >
      {/* Portfolio Preview */}
      <div className="relative aspect-[4/3] bg-muted">
        <img 
          src={service.portfolio[0]} 
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
            {categoryLabels[service.category]}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{service.interestedCount}</span>
        </div>
      </div>

      <div className="p-3">
        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={service.creator.avatar} />
            <AvatarFallback>{service.creator.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{service.creator.name}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs font-medium px-1.5 py-0.5',
                  service.creator.level === 'nivel3' && 'bg-[#fff7e6] border-[#f3d27a] text-[#c08a00]', // ouro
                  service.creator.level === 'nivel2' && 'bg-[#f7f7f7] border-[#d8d8d8] text-[#7f7f7f]', // prata
                  service.creator.level === 'nivel1' && 'bg-[#fff5ec] border-[#f1c8a0] text-[#c07232]', // bronze
                )}
              >
                {levelLabels[service.creator.level]}
              </Badge>
              {service.creator.verified && (
                <svg className="h-3.5 w-3.5 text-orange-500 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-0.5">{service.creator.segment}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="text-sm font-medium">{service.creator.rating}</span>
            <span className="text-xs text-muted-foreground">({service.creator.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-medium text-sm line-clamp-2 mb-1 min-h-[1.5rem]">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
          {service.description}
        </p>

        {/* Price & Delivery */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Entrega em</span>
            <p className="font-medium text-sm">
              {service.minDeliveryDays}-{service.minDeliveryDays + 1} dias
            </p>
          </div>
          <div className="text-left">
            <span className="text-xs text-muted-foreground">a partir de</span>
            <p className="font-display font-bold text-lg text-orange-600">
              {formatPrice(service.minPrice)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
