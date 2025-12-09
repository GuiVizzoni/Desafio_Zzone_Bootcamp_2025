// Script de teste do webhook n8n
// Execute no console do navegador (F12)

async function testWebhook() {
  const webhookUrl = 'https://testeinbazz123.app.n8n.cloud/webhook-test/b55bbed0-22b1-44ef-9696-e910bb7ccaf4';
  
  const testData = {
    event: 'service_created',
    data: {
      title: 'Teste de Serviço via Console',
      description: 'Este é um serviço de teste criado para validar o webhook n8n',
      category: 'edicao-reels',
      level: 'profissional',
      packages: [
        {
          name: 'Básico',
          description: 'Pacote básico de teste',
          price: 99.90,
          deliveryDays: 3,
          revisions: 1,
          features: ['Feature 1', 'Feature 2', 'Feature 3']
        },
        {
          name: 'Padrão',
          description: 'Pacote padrão de teste',
          price: 199.90,
          deliveryDays: 2,
          revisions: 2,
          features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
        }
      ]
    },
    timestamp: new Date().toISOString(),
    userId: 'test-user-123'
  };

  console.log('🚀 Enviando teste para webhook...');
  console.log('Dados:', testData);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('✅ Status:', response.status);
    
    const result = await response.text();
    console.log('📦 Resposta:', result);

    if (response.ok) {
      console.log('✅ Webhook funcionando! Verifique o n8n e o Supabase.');
    } else {
      console.error('❌ Erro no webhook:', response.statusText);
    }

    return response;
  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
    return null;
  }
}

// Executar teste
testWebhook();
