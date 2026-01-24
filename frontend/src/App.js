import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import CalculatorPage from "@/pages/CalculatorPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <CalculatorPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
    
    // Lucro Atual
    const currentProfit = currentSalePrice * margin;
    
    // Se mantiver o mesmo preço com nova alíquota
    const newProfitIfSamePrice = currentSalePrice - cost - (currentSalePrice * newTax);
    
    // Gap de Lucro
    const profitGap = currentProfit - newProfitIfSamePrice;
    
    // Preço Sugerido SVRN (para manter a margem original)
    const suggestedPrice = cost / (1 - margin - newTax);
    
    // Impacto percentual
    const profitImpact = ((profitGap / currentProfit) * 100);

    setResults({
      currentSalePrice: currentSalePrice.toFixed(2),
      currentProfit: currentProfit.toFixed(2),
      newProfitIfSamePrice: newProfitIfSamePrice.toFixed(2),
      profitGap: profitGap.toFixed(2),
      suggestedPrice: suggestedPrice.toFixed(2),
      profitImpact: profitImpact.toFixed(1),
      ivaRate: ivaRate[0]
    });
  };

  const generatePDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    
    // Header com branding
    doc.setFillColor(0, 71, 171); // Azul Royal
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('SVRN Tax Simulator', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Relatório de Impacto - Reforma Tributária 2026', 105, 30, { align: 'center' });
    
    // Informações do Produto
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Produto Analisado', 20, 55);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Nome: ${productName}`, 20, 65);
    doc.text(`Custo: R$ ${parseFloat(productCost).toFixed(2)}`, 20, 72);
    doc.text(`Margem de Lucro Atual: ${profitMargin}%`, 20, 79);
    doc.text(`Carga Tributária Atual: ${currentTaxRate}%`, 20, 86);
    doc.text(`Nova Alíquota IVA 2026: ${results.ivaRate}%`, 20, 93);
    
    // Tabela de Resultados
    doc.autoTable({
      startY: 105,
      head: [['Métrica', 'Valor']],
      body: [
        ['Preço de Venda Atual', `R$ ${results.currentSalePrice}`],
        ['Lucro Atual', `R$ ${results.currentProfit}`],
        ['Lucro com IVA (mesmo preço)', `R$ ${results.newProfitIfSamePrice}`],
        ['Gap de Lucro', `R$ ${results.profitGap}`],
        ['Impacto no Lucro', `${results.profitImpact}%`],
        ['', ''],
        ['PREÇO SUGERIDO SVRN', `R$ ${results.suggestedPrice}`]
      ],
      theme: 'striped',
      margin: { left: 20, right: 20 },
      headStyles: {
        fillColor: [0, 71, 171],
        fontSize: 12,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 11
      },
      columnStyles: {
        0: { cellWidth: 110 },
        1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: function(data) {
        if (data.row.index === 6 && data.section === 'body') {
          data.cell.styles.fillColor = [212, 175, 55]; // Dourado
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontSize = 13;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    
    // Rodapé com CTA
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(15, 15, 16); // Dark background
    doc.rect(0, pageHeight - 35, 210, 35, 'F');
    
    doc.setTextColor(212, 175, 55); // Dourado
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('SVRN Tech', 105, pageHeight - 22, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Agende sua Consultoria Tributária', 105, pageHeight - 13, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, pageHeight - 5, { align: 'center' });
    
    // Salvar PDF
    doc.save(`SVRN_Tax_Simulator_${productName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SVRN Tax Simulator</h1>
              <p className="text-sm text-slate-400">Reforma Tributária 2026 - Projeção de Impacto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm" data-testid="input-form-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                Dados do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="product-name" className="text-slate-300">Nome do Produto</Label>
                <Input
                  id="product-name"
                  data-testid="product-name-input"
                  placeholder="Ex: Tênis Esportivo Premium"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-cost" className="text-slate-300">Custo do Produto (R$)</Label>
                <Input
                  id="product-cost"
                  data-testid="product-cost-input"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productCost}
                  onChange={(e) => setProductCost(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profit-margin" className="text-slate-300">Margem de Lucro Atual (%)</Label>
                <Input
                  id="profit-margin"
                  data-testid="profit-margin-input"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-tax" className="text-slate-300">Carga Tributária Atual (%)</Label>
                <Input
                  id="current-tax"
                  data-testid="current-tax-input"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={currentTaxRate}
                  onChange={(e) => setCurrentTaxRate(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-300">Alíquota IVA 2026</Label>
                  <span className="text-2xl font-bold text-blue-400" data-testid="iva-rate-display">{ivaRate[0]}%</span>
                </div>
                <Slider
                  data-testid="iva-rate-slider"
                  value={ivaRate}
                  onValueChange={setIvaRate}
                  min={20}
                  max={35}
                  step={0.5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>20%</span>
                  <span>35%</span>
                </div>
              </div>

              <Button 
                data-testid="calculate-button"
                onClick={calculateResults}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-base"
              >
                Calcular Impacto
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results ? (
            <div className="space-y-4" data-testid="results-section">
              {/* Cenário Atual */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-base">Cenário Atual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Preço de Venda</span>
                    <span className="text-xl font-bold text-white" data-testid="current-sale-price">R$ {results.currentSalePrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Lucro Líquido</span>
                    <span className="text-xl font-bold text-green-400" data-testid="current-profit">R$ {results.currentProfit}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cenário 2026 */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    Cenário 2026 (Mantendo Preço)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Novo Lucro</span>
                    <span className="text-xl font-bold text-orange-400" data-testid="new-profit">R$ {results.newProfitIfSamePrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Gap de Lucro</span>
                    <span className="text-xl font-bold text-red-400" data-testid="profit-gap">- R$ {results.profitGap}</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                      <div>
                        <div className="text-xs text-slate-400">Impacto no Lucro</div>
                        <div className="text-lg font-bold text-red-400" data-testid="profit-impact">-{results.profitImpact}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recomendação SVRN */}
              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border-yellow-600/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Recomendação SVRN
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-sm text-yellow-200">Preço Sugerido para Manter Margem</div>
                    <div className="text-4xl font-bold text-yellow-400" data-testid="suggested-price">R$ {results.suggestedPrice}</div>
                    <div className="text-xs text-yellow-200/70">Mantém sua margem de {profitMargin}% mesmo com IVA de {results.ivaRate}%</div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Button */}
              <Button 
                data-testid="download-pdf-button"
                onClick={generatePDF}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold h-12 text-base"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Relatório PDF
              </Button>
            </div>
          ) : (
            <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm border-dashed" data-testid="placeholder-card">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <Calculator className="w-16 h-16 text-slate-700 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">Aguardando Cálculo</h3>
                <p className="text-sm text-slate-500">Preencha os dados do produto e clique em "Calcular Impacto"</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 SVRN Tech - Preparando empresários para a nova era tributária
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
