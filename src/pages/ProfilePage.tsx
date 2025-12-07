import { Settings, Edit2, Star, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockServices } from '@/data/mockData';
import { levelLabels } from '@/data/mockData';

export default function ProfilePage() {
  // Using first creator as mock profile
  const profile = mockServices[0].creator;
  const myServices = mockServices.filter((s) => s.creator.id === profile.id);

  return (
    <MobileLayout>
      <Header 
        title="Meu Perfil" 
        rightContent={
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-5 w-5" />
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-lg">{profile.name}</h2>
                  {profile.verified && (
                    <svg className="h-5 w-5 text-primary fill-current" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{profile.segment}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="border-primary text-primary">
                    {levelLabels[profile.level]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-warning mb-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-display font-bold">{profile.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Avaliação</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="font-display font-bold">{profile.completedProjects}</span>
                </div>
                <p className="text-xs text-muted-foreground">Projetos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-display font-bold">{profile.responseTime}</span>
                </div>
                <p className="text-xs text-muted-foreground">Resposta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Services */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Meus serviços</h3>
            <Link to="/create-service">
              <Button variant="outline" size="sm">
                Novo serviço
              </Button>
            </Link>
          </div>

          {myServices.map((service) => (
            <Link key={service.id} to={`/service/${service.id}`}>
              <Card className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={service.portfolio[0]} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{service.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {service.salesCount} vendas
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span className="text-xs">{service.creator.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-primary mt-1">
                        a partir de R$ {service.minPrice}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 self-center" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          {[
            { label: 'Histórico de pedidos', path: '/orders' },
            { label: 'Pagamentos', path: '/payments' },
            { label: 'Configurações', path: '/settings' },
            { label: 'Ajuda', path: '/help' },
          ].map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
