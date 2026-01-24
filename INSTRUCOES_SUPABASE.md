# 🔐 INSTRUÇÕES PARA CONFIGURAR O SUPABASE

## PASSO 1: Executar SQL no Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Navegue até: **SQL Editor** (menu lateral)
3. Clique em **"New query"**
4. Copie e cole todo o conteúdo do arquivo `/app/supabase_setup.sql`
5. Clique em **"Run"** para executar o script

✅ **O que este script faz:**
- Cria a tabela `profiles` com campos: id, email, created_at, is_pro_member
- Configura Row Level Security (RLS) para segurança
- Cria um trigger automático que cria um profile sempre que um novo usuário se cadastra
- Define políticas de acesso (usuários só veem seus próprios dados)

## PASSO 2: Verificar a Configuração

Após executar o SQL, verifique:

1. Vá para **Table Editor** no menu lateral
2. Você deve ver a tabela `profiles` listada
3. Estrutura esperada:
   ```
   - id (uuid) - Primary Key
   - email (text)
   - created_at (timestamptz)
   - is_pro_member (boolean) - default false
   ```

## PASSO 3: Testar o Sistema

### Teste 1: Cadastro de Novo Usuário
1. Abra o app: http://localhost:3000
2. Você será redirecionado para `/login`
3. Clique em "Cadastre-se"
4. Preencha email e senha (mínimo 6 caracteres)
5. Clique em "Criar Conta"

**Resultado esperado:**
- Redirect automático para a calculadora (`/`)
- Badge "7 dias restantes" aparece no topo
- Profile criado automaticamente no Supabase

### Teste 2: Login com Usuário Existente
1. Faça logout (botão no canto superior direito)
2. Entre novamente com as mesmas credenciais
3. Você deve ser redirecionado para `/`

### Teste 3: Teste de Trial (7 dias)
1. Faça login
2. Preencha a calculadora e clique em "Calcular Impacto"
3. Clique em "Baixar Relatório PDF"

**Resultado esperado (DENTRO DO TRIAL):**
- PDF deve ser gerado e baixado normalmente

**Resultado esperado (APÓS 7 DIAS):**
- Modal de paywall aparece bloqueando o download
- Mensagem: "Seu Período de Teste Acabou"
- Botão "Assinar Agora por R$ 49,90/mês"

### Teste 4: Simular Usuário PRO
1. Vá para o Supabase > Table Editor > profiles
2. Encontre seu usuário
3. Edite o campo `is_pro_member` para `true`
4. Volte para o app e faça logout/login
5. Badge muda para "PRO Member"
6. PDF deve funcionar normalmente

## PASSO 4: Como Simular Trial Expirado (Teste)

Para testar o paywall SEM esperar 7 dias:

1. Vá para Supabase > Table Editor > profiles
2. Encontre seu usuário
3. Edite o campo `created_at` para uma data **8 dias atrás**
   - Exemplo: Se hoje é 24/01/2026, coloque 16/01/2026
4. Certifique-se que `is_pro_member` está `false`
5. Volte ao app e tente gerar PDF
6. O modal de paywall deve aparecer

## TROUBLESHOOTING

### ❌ "Profile not found" após signup
**Solução:** Verifique se o trigger foi criado corretamente:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### ❌ Não consigo fazer login
**Possíveis causas:**
1. Email confirmation habilitado no Supabase (desabilite em Settings > Auth)
2. Senha muito curta (mínimo 6 caracteres)
3. Credenciais incorretas

### ❌ PDF não gera (trial ativo)
**Verifique:**
1. Console do browser (F12) para erros JavaScript
2. Badge mostra dias corretos?
3. `created_at` está correto no banco?

## PRÓXIMOS PASSOS

1. **Link de Pagamento:** Edite `/app/frontend/src/components/PaywallModal.js`
   - Linha 9: Altere `'#'` para seu link de checkout (Stripe/Asaas)

2. **Ativar Usuário PRO:** Quando um pagamento for confirmado, atualize via webhook:
   ```sql
   UPDATE profiles SET is_pro_member = true WHERE email = 'usuario@example.com';
   ```

3. **Email de Confirmação (Opcional):**
   - Supabase > Settings > Auth
   - Ative "Enable email confirmations"
   - Configure template de email
