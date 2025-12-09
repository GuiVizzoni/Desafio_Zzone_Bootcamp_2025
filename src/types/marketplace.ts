export type ServiceCategory = 
  | 'edicao-reels'
  | 'roteirizacao'
  | 'trafego-pago'
  | 'edicao-post'
  | 'consultoria';

export type ServiceLevel = 'nivel1' | 'nivel2' | 'nivel3';

export type OrderStatus = 'pendente' | 'em_andamento' | 'revisao' | 'concluido' | 'cancelado';

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  segment: string;
  level: ServiceLevel;
  verified: boolean;
  completedProjects: number;
  responseTime: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  creator: Creator;
  packages: ServicePackage[];
  portfolio: string[];
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  minDeliveryDays: number;
  salesCount: number;
  interestedCount: number;
  tags: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  service: Service;
  package: ServicePackage;
  buyer: {
    id: string;
    name: string;
    avatar: string;
  };
  description: string;
  duration: string;
  requirements: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  deliveryDate: string;
  whatsappNumber?: string;
}

export interface DashboardStats {
  monthlyEarnings: number;
  completedProjects: number;
  pendingProjects: number;
  averageRating: number;
}
