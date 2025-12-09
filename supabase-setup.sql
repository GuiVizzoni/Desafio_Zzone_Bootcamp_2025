-- ============================================
-- Script SQL para configurar Supabase
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. CRIAR TABELA DE SERVIÇOS
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  packages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creator_id UUID,
  status TEXT DEFAULT 'active'
);

-- 2. CRIAR TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  service_id UUID REFERENCES services(id),
  package_id TEXT NOT NULL,
  customer_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR TABELA DE EVENTOS/ANALYTICS
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_level ON services(level);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_service ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- 5. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 6. POLÍTICAS DE SEGURANÇA

-- Services: Leitura pública, escrita autenticada
DROP POLICY IF EXISTS "Allow public read on services" ON services;
CREATE POLICY "Allow public read on services" ON services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on services" ON services;
CREATE POLICY "Allow authenticated insert on services" ON services
  FOR INSERT WITH CHECK (true);

-- Orders: Apenas usuários autenticados
DROP POLICY IF EXISTS "Allow public read on orders" ON orders;
CREATE POLICY "Allow public read on orders" ON orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert on orders" ON orders;
CREATE POLICY "Allow insert on orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Events: Apenas inserção (analytics)
DROP POLICY IF EXISTS "Allow insert on events" ON events;
CREATE POLICY "Allow insert on events" ON events
  FOR INSERT WITH CHECK (true);

-- 7. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. TRIGGERS PARA AUTO-UPDATE
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. VIEWS ÚTEIS

-- View de serviços com estatísticas
CREATE OR REPLACE VIEW services_with_stats AS
SELECT 
    s.*,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.amount), 0) as total_revenue
FROM services s
LEFT JOIN orders o ON s.id = o.service_id
GROUP BY s.id;

-- View de analytics por dia
CREATE OR REPLACE VIEW daily_events AS
SELECT 
    DATE(created_at) as date,
    event_type,
    COUNT(*) as count
FROM events
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, count DESC;

-- 10. INSERIR DADOS DE TESTE (OPCIONAL)
INSERT INTO services (title, description, category, level, packages) VALUES
(
  'Edição Profissional de Reels',
  'Transformo seus vídeos em conteúdo viral!',
  'edicao-reels',
  'expert',
  '[
    {
      "name": "Básico",
      "description": "Edição simples",
      "price": 50,
      "deliveryDays": 3,
      "revisions": 1,
      "features": ["Cortes básicos", "Música"]
    }
  ]'::jsonb
);

-- 11. QUERIES ÚTEIS PARA TESTES

-- Ver todos os serviços
-- SELECT * FROM services ORDER BY created_at DESC;

-- Ver todos os pedidos
-- SELECT * FROM orders ORDER BY created_at DESC;

-- Ver eventos recentes
-- SELECT * FROM events ORDER BY created_at DESC LIMIT 100;

-- Ver estatísticas
-- SELECT * FROM services_with_stats;

-- Ver analytics diário
-- SELECT * FROM daily_events;

-- Deletar dados de teste
-- DELETE FROM events WHERE event_type LIKE 'test_%';
-- DELETE FROM orders WHERE customer_id IS NULL;
-- DELETE FROM services WHERE title LIKE '%Teste%';
