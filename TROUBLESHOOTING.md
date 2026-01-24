# ⚠️ TROUBLESHOOTING - Erros Comuns

## Erro: "Failed to execute 'json' on 'Response': body stream already read"

**Causa:** Este erro ocorre quando o Supabase recebe muitas requisições em pouco tempo (Rate Limiting - HTTP 429).

**Solução:**
1. Aguarde 60 segundos antes de tentar novamente
2. Recarregue a página (F5)
3. Tente fazer login/cadastro novamente

**Prevenção:**
- Evite clicar múltiplas vezes no botão de login/cadastro
- Aguarde a resposta do servidor antes de tentar novamente

## Erro: HTTP 429 - Too Many Requests

**Causa:** Supabase tem limite de requisições por minuto no plano gratuito.

**Limites do Supabase (Free Tier):**
- 50 requisições por minuto por IP
- 100 cadastros por hora

**Solução:**
1. Aguarde 1-2 minutos
2. Considere fazer upgrade para o plano Pro do Supabase se estiver em produção

## Email Confirmation Habilitado

Se após cadastro o usuário não consegue entrar:

1. Vá para Supabase Dashboard > Authentication > Settings
2. Desabilite "Enable email confirmations" para testes
3. Em produção, configure um provider de email (Resend, SendGrid, etc.)

## Profile não é criado automaticamente

**Verifique:**
1. O SQL foi executado corretamente? (consulte `/app/supabase_setup.sql`)
2. O trigger `on_auth_user_created` existe?
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
3. Verifique erros no Supabase Dashboard > Database > Logs

## Usuário criado mas não aparece profile

**Solução manual:**
```sql
-- Execute no Supabase SQL Editor
INSERT INTO public.profiles (id, email, created_at, is_pro_member)
SELECT id, email, created_at, false
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

## Rate Limit em Desenvolvimento

Durante desenvolvimento, você pode estar disparando muitas requisições. Para evitar:

1. **Desabilite email confirmation** (Settings > Auth)
2. **Não faça múltiplos signups** - Use sempre o mesmo usuário para testes
3. **Limpe o localStorage** se necessário:
   ```javascript
   localStorage.clear()
   ```

## Dicas para Produção

1. **Configure Email Provider:** Supabase precisa de um provider configurado
2. **Aumente Rate Limits:** Upgrade para Supabase Pro
3. **Implemente Retry Logic:** Em produção, adicione retry com backoff exponencial
4. **Monitore Logs:** Use Supabase Dashboard > Logs para debug

## Contato Supabase Support

Se problemas persistirem:
- Discord: https://discord.supabase.com
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com
