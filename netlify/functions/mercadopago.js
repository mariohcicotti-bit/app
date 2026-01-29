exports.handler = async (event, context) => {
  // 1. Segurança: Só aceita mensagens via POST (padrão do Mercado Pago)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. Traduz a mensagem que chegou (vem em JSON)
    const body = JSON.parse(event.body);

    // 3. Verifica o que chegou e mostra no Log (Painel do Netlify)
    console.log("🔔 ALERTA: O Mercado Pago bateu na porta!");
    console.log("Tipo de aviso:", body.type || "Desconhecido");
    
    // Se for pagamento, mostra o ID
    if (body.data && body.data.id) {
        console.log("💰 ID do Pagamento:", body.data.id);
    }
    
    // Mostra a mensagem completa para a gente analisar
    console.log("📦 Conteúdo completo:", JSON.stringify(body, null, 2));

    // AQUI ENTRARÁ A MÁGICA DE LIBERAR O ACESSO (FASE 2)
    // Vamos configurar o banco de dados aqui depois.

    // 4. Responde "OK" (200) para o Mercado Pago saber que recebemos
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error("❌ Deu ruim ao processar:", error);
    return { statusCode: 400, body: "Erro no formato da mensagem" };
  }
};