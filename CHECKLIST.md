# Checklist de Configuração - Webhook n8n → Supabase

## ✅ Passo a Passo

### 1️⃣ Configurar Supabase

- [ ] Acessar https://supabase.com e fazer login
- [ ] Abrir projeto: brqokrchhjcrqcbjybch
- [ ] Ir em **SQL Editor**
- [ ] Copiar e executar o arquivo `supabase-setup.sql`
- [ ] Verificar se as tabelas foram criadas:
  - [ ] services
  - [ ] orders
  - [ ] events
- [ ] Ir em **Settings** → **API**
- [ ] Copiar **service_role key** (para usar no n8n)

### 2️⃣ Configurar n8n

- [ ] Acessar https://testeinbazz123.app.n8n.cloud
- [ ] Criar novo workflow: "CreatorHub - Service Management"
- [ ] Adicionar nodes na seguinte ordem:

#### Node 1: Webhook
- [ ] Tipo: Webhook
- [ ] Method: POST
- [ ] Path: webhook-test/b55bbed0-22b1-44ef-9696-e910bb7ccaf4
- [ ] Response: Respond Immediately
- [ ] Salvar e ativar

#### Node 2: Switch (Filtro de Eventos)
- [ ] Conectar ao Webhook
- [ ] Criar regras:
  - [ ] Rule 1: `{{ $json.event }}` equals `service_created`
  - [ ] Rule 2: `{{ $json.event }}` equals `order_created`
  - [ ] Rule 3: `{{ $json.event }}` equals `service_view`

#### Node 3: Supabase (para service_created)
- [ ] Conectar à saída 0 do Switch
- [ ] Adicionar credencial Supabase:
  - URL: `https://brqokrchhjcrqcbjybch.supabase.co`
  - Service Role Key: (colar a key copiada do Supabase)
- [ ] Resource: Row
- [ ] Operation: Insert
- [ ] Table: services
- [ ] Mapear campos:
  ```
  title: {{ $json.data.title }}
  description: {{ $json.data.description }}
  category: {{ $json.data.category }}
  level: {{ $json.data.level }}
  packages: {{ $json.data.packages }}
  ```

#### Node 4: Supabase Events (Analytics)
- [ ] Adicionar novo node Supabase
- [ ] Conectar a TODAS as saídas do Switch (paralelo)
- [ ] Operation: Insert
- [ ] Table: events
- [ ] Mapear:
  ```
  event_type: {{ $json.event }}
  event_data: {{ $json.data }}
  user_id: {{ $json.userId }}
  ```

- [ ] Salvar workflow
- [ ] Ativar workflow

### 3️⃣ Testar Configuração

#### Teste 1: Via Script
- [ ] Abrir `test-webhook.js`
- [ ] Abrir Console do navegador (F12)
- [ ] Copiar e colar o código
- [ ] Executar e verificar:
  - [ ] Console mostra "✅ Webhook funcionando!"
  - [ ] n8n → Executions mostra execução bem-sucedida
  - [ ] Supabase → Table Editor → services mostra novo registro

#### Teste 2: Via Aplicação
- [ ] Executar: `npm run dev`
- [ ] Acessar: http://localhost:5173/create-service
- [ ] Preencher formulário:
  - [ ] Título
  - [ ] Categoria
  - [ ] Nível
  - [ ] Descrição
  - [ ] Pelo menos 1 pacote completo
- [ ] Clicar "Publicar serviço"
- [ ] Verificar toast de sucesso
- [ ] Verificar Console (F12) para logs
- [ ] Verificar n8n Executions
- [ ] Verificar dados no Supabase

#### Teste 3: Via cURL
```bash
curl -X POST https://testeinbazz123.app.n8n.cloud/webhook-test/b55bbed0-22b1-44ef-9696-e910bb7ccaf4 \
  -H "Content-Type: application/json" \
  -d '{
    "event": "service_created",
    "data": {
      "title": "Teste via cURL",
      "description": "Teste",
      "category": "edicao-reels",
      "level": "profissional",
      "packages": [{"name":"Básico","price":100,"deliveryDays":3,"revisions":1,"features":["Test"]}]
    },
    "timestamp": "2025-12-07T10:00:00Z"
  }'
```
- [ ] Executar comando no terminal
- [ ] Verificar resposta
- [ ] Verificar n8n e Supabase

### 4️⃣ Monitoramento

#### n8n
- [ ] Acessar aba "Executions"
- [ ] Verificar execuções recentes
- [ ] Checar erros (se houver)
- [ ] Ver tempo de execução

#### Supabase
- [ ] Table Editor → services (ver registros)
- [ ] Table Editor → events (ver analytics)
- [ ] SQL Editor → executar queries de teste:
  ```sql
  SELECT * FROM services ORDER BY created_at DESC LIMIT 10;
  SELECT * FROM events ORDER BY created_at DESC LIMIT 50;
  SELECT event_type, COUNT(*) FROM events GROUP BY event_type;
  ```

#### Aplicação
- [ ] Verificar Network tab (F12)
- [ ] Ver requests para n8n webhook
- [ ] Verificar status codes (200 = OK)
- [ ] Checar tempo de resposta

### 5️⃣ Troubleshooting

Se algo não funcionar, verificar:

#### Webhook n8n não responde
- [ ] Workflow está ativado?
- [ ] URL do webhook está correta?
- [ ] n8n está online?

#### Dados não aparecem no Supabase
- [ ] Service Role Key está correta?
- [ ] Tabela 'services' existe?
- [ ] RLS policies estão configuradas?
- [ ] Ver logs de erro no n8n

#### Erro na aplicação
- [ ] Console do navegador mostra erro?
- [ ] Variáveis de ambiente (.env) estão corretas?
- [ ] npm install @supabase/supabase-js foi executado?

## 📊 Métricas para Verificar

Após configuração completa, você deve ter:

- [ ] ✅ Webhook respondendo (200 OK)
- [ ] ✅ Dados sendo inseridos no Supabase
- [ ] ✅ Events sendo registrados para analytics
- [ ] ✅ Aplicação criando serviços com sucesso
- [ ] ✅ Todos os eventos (view, interest, checkout, etc) funcionando

## 🎉 Próximos Passos

Depois que tudo estiver funcionando:

1. [ ] Adicionar autenticação (Supabase Auth)
2. [ ] Criar dashboard de analytics
3. [ ] Configurar email notifications via n8n
4. [ ] Adicionar webhooks bidirecionais
5. [ ] Implementar real-time subscriptions
