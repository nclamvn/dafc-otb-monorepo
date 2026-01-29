'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, RefreshCw, ShoppingCart, Loader2 } from 'lucide-react';
import { MOCStatusGrid } from './MOCStatusGrid';
import { ReplenishmentAlertList } from './ReplenishmentAlertList';
import type { ReplenishmentDashboardData, MOCData, ReplenishmentAlert } from '@/types/replenishment';

interface Props {
  brandId: string;
}

// Demo data generators
function generateDemoMOCData(): MOCData[] {
  return [
    {
      categoryId: 'cat-1',
      categoryName: 'Giày chạy bộ',
      currentStock: 450,
      monthlyRate: 180,
      currentMOC: 2.5,
      targetMOC: 3.0,
      minMOC: 2.0,
      maxMOC: 4.0,
      status: 'WARNING',
    },
    {
      categoryId: 'cat-2',
      categoryName: 'Giày lifestyle',
      currentStock: 820,
      monthlyRate: 200,
      currentMOC: 4.1,
      targetMOC: 3.5,
      minMOC: 2.5,
      maxMOC: 4.0,
      status: 'OVERSTOCK',
    },
    {
      categoryId: 'cat-3',
      categoryName: 'Áo thun',
      currentStock: 320,
      monthlyRate: 280,
      currentMOC: 1.1,
      targetMOC: 2.5,
      minMOC: 1.5,
      maxMOC: 3.5,
      status: 'CRITICAL',
    },
    {
      categoryId: 'cat-4',
      categoryName: 'Quần thể thao',
      currentStock: 580,
      monthlyRate: 160,
      currentMOC: 3.6,
      targetMOC: 3.0,
      minMOC: 2.0,
      maxMOC: 4.0,
      status: 'HEALTHY',
    },
    {
      categoryId: 'cat-5',
      categoryName: 'Phụ kiện',
      currentStock: 420,
      monthlyRate: 140,
      currentMOC: 3.0,
      targetMOC: 3.0,
      minMOC: 2.0,
      maxMOC: 4.0,
      status: 'HEALTHY',
    },
  ];
}

function generateDemoAlerts(): ReplenishmentAlert[] {
  return [
    {
      id: 'alert-1',
      brandId: 'brand-1',
      categoryId: 'cat-3',
      categoryName: 'Áo thun',
      alertType: 'BELOW_MIN_MOC',
      severity: 'CRITICAL',
      currentMOC: 1.1,
      targetMOC: 2.5,
      currentStock: 320,
      monthlyRate: 280,
      suggestedOrderQty: 392,
      suggestedOrderValue: 156800000,
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alert-2',
      brandId: 'brand-1',
      categoryId: 'cat-1',
      categoryName: 'Giày chạy bộ',
      alertType: 'APPROACHING_MIN',
      severity: 'WARNING',
      currentMOC: 2.5,
      targetMOC: 3.0,
      currentStock: 450,
      monthlyRate: 180,
      suggestedOrderQty: 90,
      suggestedOrderValue: 135000000,
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alert-3',
      brandId: 'brand-1',
      categoryId: 'cat-2',
      categoryName: 'Giày lifestyle',
      alertType: 'ABOVE_MAX_MOC',
      severity: 'INFO',
      currentMOC: 4.1,
      targetMOC: 3.5,
      currentStock: 820,
      monthlyRate: 200,
      suggestedOrderQty: 0,
      suggestedOrderValue: 0,
      isAcknowledged: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

function generateDemoDashboard(): ReplenishmentDashboardData {
  const mocData = generateDemoMOCData();
  const alerts = generateDemoAlerts();

  return {
    summary: {
      totalCategories: mocData.length,
      criticalCount: mocData.filter(m => m.status === 'CRITICAL').length,
      warningCount: mocData.filter(m => m.status === 'WARNING').length,
      healthyCount: mocData.filter(m => m.status === 'HEALTHY').length,
    },
    mocByCategory: mocData,
    alerts,
    pendingOrders: [],
  };
}

export function ReplenishmentDashboard({ brandId }: Props) {
  const t = useTranslations('replenishment');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [dashboard, setDashboard] = useState<ReplenishmentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Load demo data on mount
  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setDashboard(generateDemoDashboard());
      setIsLoading(false);
    };
    loadDashboard();
  }, [brandId]);

  const handleCheckNeeds = async () => {
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Refresh data with potentially new alerts
    setDashboard(generateDemoDashboard());
    setIsChecking(false);
  };

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Clear selected alerts after creating order
    setSelectedAlerts([]);
    setIsCreatingOrder(false);
  };

  const handleAcknowledge = (alertId: string) => {
    if (dashboard) {
      setDashboard({
        ...dashboard,
        alerts: dashboard.alerts.map(alert =>
          alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
        ),
      });
    }
  };

  const summary = dashboard?.summary || { totalCategories: 0, criticalCount: 0, warningCount: 0, healthyCount: 0 };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCheckNeeds} disabled={isChecking}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? t('checking') : t('checkDemand')}
          </Button>
          {selectedAlerts.length > 0 && (
            <Button onClick={handleCreateOrder} disabled={isCreatingOrder}>
              {isCreatingOrder ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('creating')}</>
              ) : (
                <><ShoppingCart className="h-4 w-4 mr-2" />{t('createOrder')} ({selectedAlerts.length})</>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t('categories')}</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summary.totalCategories}</div></CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-700">{t('critical')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold text-red-700">{summary.criticalCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-700">{t('warning')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-700">{summary.warningCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-green-700">{t('normal')}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-700">{summary.healthyCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="moc">
        <TabsList>
          <TabsTrigger value="moc">{t('mocStatus')}</TabsTrigger>
          <TabsTrigger value="alerts">
            {t('alerts')}{dashboard?.alerts?.length ? <Badge variant="destructive" className="ml-2">{dashboard.alerts.length}</Badge> : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="moc" className="mt-4">
          <MOCStatusGrid data={dashboard?.mocByCategory || []} />
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <ReplenishmentAlertList
            alerts={dashboard?.alerts || []}
            selectedAlerts={selectedAlerts}
            onSelectChange={setSelectedAlerts}
            onAcknowledge={handleAcknowledge}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
