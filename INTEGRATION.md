# Integração n8n e Supabase

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
VITE_SUPABASE_URL=https://brqokrchhjcrqcbjybch.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# n8n Webhook
VITE_N8N_WEBHOOK_URL=https://testeinbazz123.app.n8n.cloud/webhook-test/b55bbed0-22b1-44ef-9696-e910bb7ccaf4
```

### 2. Instalação de Dependências

```bash
npm install @supabase/supabase-js
```

## Estrutura

### n8n Webhook (`src/lib/n8n.ts`)

Sistema de tracking de eventos que envia dados para o n8n via webhook:

**Eventos Rastreados:**
- `service_view` - Quando um serviço é visualizado
- `service_interest` - Quando o usuário marca interesse (favorito)
- `checkout_started` - Quando o checkout é iniciado
- `order_created` - Quando um pedido é criado
- `search` - Quando uma busca é realizada
- `filter_applied` - Quando filtros são aplicados

**Uso:**
```typescript
import { trackServiceView, trackOrderCreated } from '@/lib/n8n';

// Track service view
trackServiceView(serviceId, userId);

// Track order
trackOrderCreated(orderId, serviceId, packageId, amount, userId);
```

### Supabase (`src/lib/supabase.ts`)

Cliente configurado para acessar o Supabase:

**Uso:**
```typescript
import { supabase } from '@/lib/supabase';

// Query example
const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('category', 'edicao-reels');
```

### Hook useSupabase (`src/hooks/useSupabase.ts`)

Hooks React para facilitar o uso do Supabase:

**useSupabase:**
```typescript
const { user, loading, supabase } = useSupabase();
```

**useSupabaseQuery:**
```typescript
const { data, loading, error } = useSupabaseQuery('services', (builder) =>
  builder.eq('category', 'edicao-reels')
);
```

## Eventos Implementados

### ServiceDetailPage
- ✅ Track ao visualizar serviço
- ✅ Track ao marcar interesse (favorito)

### CheckoutPage
- ✅ Track ao iniciar checkout
- ✅ Track ao criar pedido

### ExplorePage
- ✅ Track de buscas (com debounce de 500ms)
- ✅ Track de filtros aplicados

## Estrutura de Dados Enviada ao n8n

```json
{
  "event": "service_view",
  "data": {
    "serviceId": "1"
  },
  "timestamp": "2025-12-07T10:30:00.000Z",
  "userId": "optional-user-id"
}
```

## Próximos Passos

1. **Autenticação**: Implementar login com Supabase Auth
2. **Banco de Dados**: Criar tabelas no Supabase para serviços, pedidos, etc.
3. **Real-time**: Usar subscriptions do Supabase para updates em tempo real
4. **Analytics**: Dashboard de métricas baseado nos eventos do n8n
