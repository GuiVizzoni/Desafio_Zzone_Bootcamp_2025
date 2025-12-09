import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { ServiceCard } from '@/components/services/ServiceCard';
import { mockServices } from '@/data/mockData';

export default function HomePage() {
  // Feed personalizado - mostra serviços baseados em relevância, popularidade e algoritmo
  const feedServices = [...mockServices].sort((a, b) => {
    // Algoritmo simples: combina rating, vendas e interesse
    const scoreA = (a.creator.rating * 20) + (a.salesCount * 0.5) + (a.interestedCount * 2);
    const scoreB = (b.creator.rating * 20) + (b.salesCount * 0.5) + (b.interestedCount * 2);
    return scoreB - scoreA;
  });

  return (
    <MobileLayout>
      <Header 
        title="CreatorHub" 
        showNotifications 
      />
      
      <div className="space-y-4 pt-4">
        <div className="px-4">
          <h2 className="text-xl font-display font-bold text-foreground mb-1">
            Descubra serviços
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Recomendados para você com base em popularidade, avaliações e tendências
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {feedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
