import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { ServiceCategory } from '@/types/marketplace';
import { categoryLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';

export type SortOption = 'relevance' | 'best_selling' | 'best_rated' | 'price_low' | 'price_high' | 'fastest';

interface FilterBarProps {
  selectedCategory: ServiceCategory | 'all';
  onCategoryChange: (category: ServiceCategory | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxDeliveryDays: number;
  onMaxDeliveryDaysChange: (days: number) => void;
}

const sortLabels: Record<SortOption, string> = {
  relevance: 'Relevância',
  best_selling: 'Mais vendidos',
  best_rated: 'Mais avaliados',
  price_low: 'Menor preço',
  price_high: 'Maior preço',
  fastest: 'Entrega mais rápida',
};

const categories: (ServiceCategory | 'all')[] = [
  'all',
  'edicao-reels',
  'roteirizacao',
  'trafego-pago',
  'edicao-post',
  'consultoria',
];

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  maxDeliveryDays,
  onMaxDeliveryDaysChange,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    priceRange[0] > 0 || priceRange[1] < 2000,
    maxDeliveryDays < 30,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              {sortLabels[sortBy]}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onSortChange(option)}
                className="flex items-center justify-between"
              >
                {sortLabels[option]}
                {sortBy === option && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  min={0}
                  max={2000}
                  step={50}
                  className="mt-2"
                />
              </div>

              {/* Delivery Days */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Prazo máximo de entrega: {maxDeliveryDays} dias
                </label>
                <Slider
                  value={[maxDeliveryDays]}
                  onValueChange={(value) => onMaxDeliveryDaysChange(value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={() => setIsOpen(false)}
              >
                Aplicar filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-8 whitespace-nowrap rounded-full',
              selectedCategory === category && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onCategoryChange(category)}
          >
            {category === 'all' ? 'Todos' : categoryLabels[category]}
          </Button>
        ))}
      </div>
    </div>
  );
}
