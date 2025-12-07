import { useState, useMemo } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/services/SearchBar';
import { FilterBar, SortOption } from '@/components/services/FilterBar';
import { ServiceCard } from '@/components/services/ServiceCard';
import { mockServices } from '@/data/mockData';
import { ServiceCategory } from '@/types/marketplace';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxDeliveryDays, setMaxDeliveryDays] = useState(30);

  const filteredServices = useMemo(() => {
    let services = [...mockServices];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      services = services.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      services = services.filter((s) => s.category === selectedCategory);
    }

    // Filter by price
    services = services.filter(
      (s) => s.minPrice >= priceRange[0] && s.minPrice <= priceRange[1]
    );

    // Filter by delivery days
    services = services.filter((s) => s.minDeliveryDays <= maxDeliveryDays);

    // Sort
    switch (sortBy) {
      case 'best_selling':
        services.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'best_rated':
        services.sort((a, b) => b.creator.rating - a.creator.rating);
        break;
      case 'price_low':
        services.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price_high':
        services.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case 'fastest':
        services.sort((a, b) => a.minDeliveryDays - b.minDeliveryDays);
        break;
    }

    return services;
  }, [searchQuery, selectedCategory, sortBy, priceRange, maxDeliveryDays]);

  return (
    <MobileLayout>
      <Header 
        title="CreatorHub" 
        showNotifications 
      />
      
      <div className="space-y-4 pt-4">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
        />
        
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          maxDeliveryDays={maxDeliveryDays}
          onMaxDeliveryDaysChange={setMaxDeliveryDays}
        />

        <div className="px-4">
          <p className="text-sm text-muted-foreground mb-3">
            {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum serviço encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tente ajustar os filtros
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
