# Guia de Configuração n8n → Supabase

## 1. Estrutura da Tabela no Supabase

Primeiro, crie a tabela `services` no Supabase:

```sql
-- Criar tabela de serviços
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  packages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_level ON services(level);
CREATE INDEX idx_services_created_at ON services(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read access" ON services
  FOR SELECT USING (true);

-- Política para permitir inserção autenticada (ou via service role)
CREATE POLICY "Allow authenticated insert" ON services
  FOR INSERT WITH CHECK (true);
```

## 2. Configuração do Workflow n8n

### Passo 1: Criar Novo Workflow

1. Acesse seu n8n: https://testeinbazz123.app.n8n.cloud
2. Clique em "New Workflow"
3. Dê um nome: "CreatorHub - Service Management"

### Passo 2: Adicionar Webhook Trigger

1. Adicione o node **Webhook**
2. Configurações:
   - **HTTP Method**: POST
   - **Path**: `webhook-test/b55bbed0-22b1-44ef-9696-e910bb7ccaf4`
   - **Authentication**: None (ou configure se preferir)
   - **Response Mode**: "Respond Immediately"
   - **Response Code**: 200

### Passo 3: Adicionar Node de Filtro (Switch)

1. Adicione o node **Switch**
2. Conecte ao Webhook
3. Configure os casos:
   - **Mode**: Rules
   - **Rule 1**: `{{ $json.event }} equals service_created`
   - **Rule 2**: `{{ $json.event }} equals order_created`
   - **Rule 3**: `{{ $json.event }} equals service_view`
   - etc.

### Passo 4: Adicionar Supabase Node (para service_created)

1. Adicione o node **Supabase**
2. Conecte à saída "0" do Switch (service_created)
3. Configurações:
   - **Credential**: Adicione suas credenciais do Supabase
     - URL: `https://brqokrchhjcrqcbjybch.supabase.co`
     - Service Role Key: (encontre no Supabase Dashboard → Settings → API)
   - **Resource**: Row
   - **Operation**: Insert
   - **Table**: services
   - **Data to Send**: Define Below
   - **Columns**:
     ```
     title: {{ $json.data.title }}
     description: {{ $json.data.description }}
     category: {{ $json.data.category }}
     level: {{ $json.data.level }}
     packages: {{ $json.data.packages }}
     ```

### Passo 5: Adicionar Node de Analytics (Opcional)

1. Adicione um node **HTTP Request** ou **Google Sheets**
2. Use para tracking/analytics dos eventos
3. Conecte em paralelo com o Supabase node

### Passo 6: Adicionar Notificação (Opcional)

1. Adicione node **Slack** ou **Email**
2. Configure para notificar quando novo serviço for criado
3. Mensagem exemplo:
   ```
   Novo serviço criado! 🎉
   Título: {{ $json.data.title }}
   Categoria: {{ $json.data.category }}
   ```

## 3. Estrutura Completa do Workflow

```
Webhook
  ↓
Switch (por tipo de evento)
  ↓
  ├─ service_created
  │   ↓
  │   ├─ Supabase Insert
  │   ├─ Analytics (opcional)
  │   └─ Notificação (opcional)
  │
  ├─ order_created
  │   ↓
  │   └─ Supabase Insert (tabela orders)
  │
  ├─ service_view
  │   ↓
  │   └─ Analytics/Tracking
  │
  └─ default
      ↓
      └─ Log/Debug
```

## 4. Testar o Webhook

### Teste via cURL:

```bash
curl -X POST https://testeinbazz123.app.n8n.cloud/webhook-test/b55bbed0-22b1-44ef-9696-e910bb7ccaf4 \
  -H "Content-Type: application/json" \
  -d '{
    "event": "service_created",
    "data": {
      "title": "Teste de Serviço",
      "description": "Descrição de teste",
      "category": "edicao-reels",
      "level": "profissional",
      "packages": [
        {
          "name": "Básico",
          "description": "Pacote básico",
          "price": 100,
          "deliveryDays": 3,
          "revisions": 1,
          "features": ["Feature 1", "Feature 2"]
        }
      ]
    },
    "timestamp": "2025-12-07T10:00:00.000Z"
  }'
```

### Teste na Aplicação:

1. Execute o projeto: `npm run dev`
2. Navegue para `/create-service`
3. Preencha o formulário
4. Clique em "Publicar serviço"
5. Verifique:
   - Console do navegador (logs)
   - n8n executions (histórico de execuções)
   - Supabase Table Editor (dados inseridos)

## 5. Monitoramento

### No n8n:
- Acesse "Executions" para ver histórico
- Verifique erros e sucessos
- Analise tempo de execução

### No Supabase:
- Table Editor → services (ver dados)
- SQL Editor → queries personalizadas
- Logs → monitorar erros

### Na Aplicação:
- Console do navegador (F12)
- Network tab → ver requests
- Verificar toast notifications

## 6. Eventos Disponíveis

A aplicação já envia os seguintes eventos:

- `service_created` - Novo serviço criado
- `service_view` - Serviço visualizado
- `service_interest` - Interesse em serviço (favorito)
- `checkout_started` - Checkout iniciado
- `order_created` - Pedido criado
- `search` - Busca realizada
- `filter_applied` - Filtros aplicados

## 7. Próximos Passos

1. **Autenticação**: Adicionar `userId` aos eventos
2. **Webhooks Bidirecionais**: n8n → App (notificações)
3. **Real-time**: Supabase subscriptions
4. **Analytics Dashboard**: Visualizar métricas
5. **Automações**: Email marketing, follow-ups, etc.
