import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calculator } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Tratamento específico para rate limiting
      if (err.message && err.message.includes('429')) {
        setError('Muitas tentativas. Aguarde 1 minuto e tente novamente.');
      } else if (err.message && err.message.includes('body stream')) {
        setError('Erro de conexão. Recarregue a página e tente novamente.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">SVRN Tax</h1>
            <p className="text-sm text-slate-400">Simulador Tributário</p>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm" data-testid="auth-card">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isLogin 
                ? 'Entre para continuar gerando relatórios' 
                : 'Comece seu teste grátis de 7 dias'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2" data-testid="auth-error">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  data-testid="email-input"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Senha</Label>
                <Input
                  id="password"
                  data-testid="password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-300">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    data-testid="confirm-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              )}

              <Button 
                type="submit"
                data-testid="auth-submit-button"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
              >
                {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                data-testid="toggle-auth-mode"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {isLogin ? (
                  <>Não tem uma conta? <span className="text-blue-400 font-semibold">Cadastre-se</span></>
                ) : (
                  <>Já tem uma conta? <span className="text-blue-400 font-semibold">Entrar</span></>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {!isLogin && (
          <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <p className="text-sm text-blue-200 text-center">
              ✨ Teste grátis de 7 dias • Sem cartão de crédito • Cancele quando quiser
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
