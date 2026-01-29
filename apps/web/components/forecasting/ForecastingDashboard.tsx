'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Sparkles, Target, Play, AlertCircle } from 'lucide-react';
import type { ForecastResult } from '@/types/forecasting';
import { ForecastChart } from './ForecastChart';

interface Props {
  brandId: string;
  seasonId: string;
}

// Demo forecast data generator
function generateDemoForecast(weeks: number, t: ReturnType<typeof useTranslations>): ForecastResult {
  const baseValue = 50000 + Math.random() * 30000;
  const weeklyForecast = Array.from({ length: weeks }, (_, i) => {
    const seasonal = Math.sin((i / weeks) * Math.PI * 2) * 0.2;
    const trend = i * 500;
    const noise = (Math.random() - 0.5) * 5000;
    return Math.round(baseValue + trend + seasonal * baseValue + noise);
  });

  return {
    weeklyForecast,
    confidence: weeklyForecast.map(f => ({
      lower: Math.round(f * 0.85),
      upper: Math.round(f * 1.15)
    })),
    accuracy: Math.round(82 + Math.random() * 10),
    method: 'ENSEMBLE',
    insights: t.raw('insights') as string[],
  };
}

export function ForecastingDashboard({ brandId, seasonId }: Props) {
  const t = useTranslations('forecasting');
  const [weeksAhead, setWeeksAhead] = useState(12);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const forecast = generateDemoForecast(weeksAhead, t);
    setResult(forecast);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>{t('parameters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">{t('timeRange', { weeks: weeksAhead })}</label>
              <Slider value={[weeksAhead]} onValueChange={([v]) => setWeeksAhead(v)} min={4} max={24} step={2} />
            </div>
            <Button onClick={handleGenerate} disabled={isLoading}>
              <Play className="h-4 w-4 mr-2" />{isLoading ? t('generating') : t('generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('accuracy')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{result.accuracy}%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('method')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">{result.method}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('weeklyAvg')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">
                    {Math.round(result.weeklyForecast.reduce((a, b) => a + b, 0) / result.weeklyForecast.length).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('total')}</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.weeklyForecast.reduce((a, b) => a + b, 0).toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('chartTitle')}</CardTitle>
              <CardDescription>{t('chartDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastChart result={result} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-blue-500" />{t('aiInsights')}</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-blue-500">•</span>{insight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {!result && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-300" />
            {t('clickToGenerate')}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
