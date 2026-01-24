import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, TrendingUp } from 'lucide-react';

export function PaywallModal({ isOpen, onClose }) {
  const handleUpgrade = () => {
    window.open('#', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        data-testid="paywall-modal"
        className="bg-slate-900 border-slate-800 text-white max-w-md"
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center text-white">
            Seu Período de Teste Acabou
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center text-base">
            Para continuar gerando relatórios ilimitados e protegendo seu lucro, torne-se PRO.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Price */}
          <div className="text-center py-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Por apenas</div>
            <div className="text-4xl font-bold text-yellow-400">R$ 49,90</div>
            <div className="text-sm text-slate-400 mt-1">/mês</div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm">Relatórios ilimitados</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm">Simulações com múltiplos cenários</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm">Suporte prioritário</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm">Atualizações exclusivas da Reforma 2026</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            data-testid="upgrade-button"
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold h-12 text-base"
          >
            Assinar Agora por R$ 49,90/mês
          </Button>

          {/* Cancel text */}
          <p className="text-xs text-slate-500 text-center">
            Cancele a qualquer momento. Sem taxas ocultas.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
