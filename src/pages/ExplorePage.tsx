import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/services/SearchBar';
import { ServiceCard } from '@/components/services/ServiceCard';
import { mockServices } from '@/data/mockData';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = searchQuery
    ? mockServices.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          s.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockServices;

  return (
    <MobileLayout>
      <Header title="Explorar" />

      <div className="space-y-4 pt-4">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          placeholder="Buscar serviços, creators, tags..."
        />

        <div className="px-4">
          <p className="text-sm text-muted-foreground mb-3">
            {searchQuery 
              ? `${filteredServices.length} resultado${filteredServices.length !== 1 ? 's' : ''} para "${searchQuery}"`
              : 'Todos os serviços'
            }
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum resultado encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tente buscar por outro termo
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
