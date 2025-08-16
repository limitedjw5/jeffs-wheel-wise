import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Star,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { type MarketAnalysis } from '@/lib/adminServices';

interface MarketAnalysisDisplayProps {
  marketAnalysis: MarketAnalysis | null;
  inventoryReview: any;
  onGenerateAnalysis: () => void;
  onGenerateReview: () => void;
  loading: boolean;
}

const MarketAnalysisDisplay: React.FC<MarketAnalysisDisplayProps> = ({
  marketAnalysis,
  inventoryReview,
  onGenerateAnalysis,
  onGenerateReview,
  loading
}) => {
  const exportAnalysis = () => {
    if (!marketAnalysis && !inventoryReview) return;

    const data = {
      timestamp: new Date().toISOString(),
      marketAnalysis,
      inventoryReview
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Market Analytics</h2>
          <p className="text-muted-foreground">
            AI-powered insights and recommendations for your business
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onGenerateAnalysis} 
            disabled={loading}
            variant="outline"
          >
            <Brain className="w-4 h-4 mr-2" />
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate Market Analysis'}
          </Button>
          <Button 
            onClick={onGenerateReview} 
            disabled={loading}
            variant="outline"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate Inventory Review'}
          </Button>
          {(marketAnalysis || inventoryReview) && (
            <Button variant="outline" onClick={exportAnalysis}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Market Analysis Section */}
      {marketAnalysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-semibold">Market Analysis</h3>
            <Badge variant="secondary">
              <Calendar className="w-3 h-3 mr-1" />
              Generated Today
            </Badge>
          </div>

          {/* Market Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Market Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{marketAnalysis.summary}</p>
            </CardContent>
          </Card>

          {/* Trends and Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {marketAnalysis.trends.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-sm">{trend}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {marketAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Price Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Price Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {marketAnalysis.priceInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {marketAnalysis.lowStockAlert.length > 0 && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketAnalysis.lowStockAlert.slice(0, 6).map((car) => (
                    <div key={car.id} className="p-3 bg-white dark:bg-orange-900/20 rounded-lg">
                      <div className="font-medium">{car.make} {car.model}</div>
                      <div className="text-sm text-muted-foreground">{car.year} • ₦{car.price?.toLocaleString()}</div>
                      <Badge variant="outline" className="mt-1">{car.condition}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Performers */}
          {marketAnalysis.topPerformers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Top Performing Cars
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketAnalysis.topPerformers.map((car) => (
                    <div key={car.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{car.make} {car.model}</div>
                      <div className="text-sm text-muted-foreground">{car.year} • ₦{car.price?.toLocaleString()}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Featured</Badge>
                        <Badge variant="outline">{car.condition}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Inventory Review Section */}
      {inventoryReview && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-semibold">Inventory Review</h3>
            <Badge variant="secondary">
              <Calendar className="w-3 h-3 mr-1" />
              Generated Today
            </Badge>
          </div>

          {/* Health Score */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-green-600">
                  {inventoryReview.healthScore || 75}%
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${inventoryReview.healthScore || 75}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {inventoryReview.summary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slow Moving Items */}
            {inventoryReview.slowMoving && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Slow Moving Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {inventoryReview.slowMoving.map((item: string, index: number) => (
                      <li key={index} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Fast Moving Categories */}
            {inventoryReview.fastMoving && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Fast Moving Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {inventoryReview.fastMoving.map((item: string, index: number) => (
                      <li key={index} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {inventoryReview.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Alerts */}
          {inventoryReview.alerts && inventoryReview.alerts.length > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800 dark:text-red-200">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Urgent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {inventoryReview.alerts.map((alert: string, index: number) => (
                    <li key={index} className="text-sm text-red-800 dark:text-red-200">
                      {alert}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!marketAnalysis && !inventoryReview && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">AI Analytics Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Generate AI-powered market analysis and inventory reviews to get actionable insights for your business.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={onGenerateAnalysis}>
                <Brain className="w-4 h-4 mr-2" />
                Market Analysis
              </Button>
              <Button onClick={onGenerateReview} variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Inventory Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketAnalysisDisplay;