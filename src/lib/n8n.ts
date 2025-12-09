const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

if (!n8nWebhookUrl) {
  console.warn('n8n webhook URL not configured');
}

export interface N8nEventData {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
}

/**
 * Envia um evento para o webhook n8n
 */
export async function sendN8nEvent(event: string, data: Record<string, any>, userId?: string): Promise<boolean> {
  if (!n8nWebhookUrl) {
    console.warn('n8n webhook URL not configured, skipping event:', event);
    return false;
  }

  const payload: N8nEventData = {
    event,
    data,
    timestamp: new Date().toISOString(),
    userId,
  };

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('n8n webhook error:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send n8n event:', error);
    return false;
  }
}

/**
 * Envia evento de visualização de serviço
 */
export function trackServiceView(serviceId: string, userId?: string) {
  return sendN8nEvent('service_view', { serviceId }, userId);
}

/**
 * Envia evento de interesse em serviço
 */
export function trackServiceInterest(serviceId: string, userId?: string) {
  return sendN8nEvent('service_interest', { serviceId }, userId);
}

/**
 * Envia evento de checkout iniciado
 */
export function trackCheckoutStarted(serviceId: string, packageId: string, userId?: string) {
  return sendN8nEvent('checkout_started', { serviceId, packageId }, userId);
}

/**
 * Envia evento de pedido criado
 */
export function trackOrderCreated(orderId: string, serviceId: string, packageId: string, amount: number, userId?: string) {
  return sendN8nEvent('order_created', { orderId, serviceId, packageId, amount }, userId);
}

/**
 * Envia evento de busca realizada
 */
export function trackSearch(query: string, resultsCount: number, userId?: string) {
  return sendN8nEvent('search', { query, resultsCount }, userId);
}

/**
 * Envia evento de filtro aplicado
 */
export function trackFilterApplied(filters: Record<string, any>, userId?: string) {
  return sendN8nEvent('filter_applied', { filters }, userId);
}
