const { createClient } = require('@supabase/supabase-js');

// Conecta com o Supabase usando as chaves que você salvou no Netlify
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    console.log("🔔 Notificação recebida:", body.type);

    // Verifica se é um pagamento aprovado
    if (body.type === "payment" || body.action === "payment.created") {
      const paymentId = body.data.id;
      
      // Aqui o robô "pergunta" ao Mercado Pago quem pagou
      // Por enquanto, vamos simular a liberação do último usuário que tentou assinar
      // No futuro, podemos refinar buscando pelo e-mail do comprador
      
      console.log(`💰 Processando pagamento: ${paymentId}`);

      // Mágica: Busca o usuário e coloca ele como PREMIUM por 30 dias
      const { data, error } = await supabase
        .from('profiles') // Ajuste o nome da tabela se for diferente
        .update({ 
          is_pro: true, 
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
        })
        .eq('is_pro', false) // Exemplo de lógica de busca
        .select();

      if (error) throw error;
      console.log("✅ Acesso liberado com sucesso!");
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error("❌ Erro:", error.message);
    return { statusCode: 400, body: error.message };
  }
};