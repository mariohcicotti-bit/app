const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const body = JSON.parse(event.body);
    
    // Filtra para agir apenas quando for notificação de pagamento
    if (body.type === "payment" || body.action === "payment.created") {
      
      const dataExpiracao = new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + 30);

      const { data, error } = await supabase
        .from('profiles') 
        .update({ 
          is_pro_member: true, // Nome da sua coluna de acesso
          premium_until: dataExpiracao.toISOString() // Nome da coluna que você criou agora
        })
.eq('email', body.payer ? body.payer.email : body.user_id)
.select();

      if (error) throw error;
      console.log("✅ Sucesso! Acesso liberado no Supabase.");
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error("❌ Erro no processamento:", error.message);
    return { statusCode: 400, body: error.message };
  }
};