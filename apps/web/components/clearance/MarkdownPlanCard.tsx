'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Target, TrendingDown, Zap, ArrowRight, Loader2 } from 'lucide-react';
import type { MarkdownPlan, MarkdownPlanStatus } from '@/types/clearance';

const STATUS_COLORS: Record<MarkdownPlanStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_KEYS: Record<MarkdownPlanStatus, string> = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pendingApproval',
  APPROVED: 'approved',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

interface Props {
  plan: MarkdownPlan;
  onOptimize: () => void;
  isOptimizing?: boolean;
}

export function MarkdownPlanCard({ plan, onOptimize, isOptimizing }: Props) {
  const t = useTranslations('clearance');
  const tCommon = useTranslations('common');
  const statusColor = STATUS_COLORS[plan.status];
  const statusKey = STATUS_KEYS[plan.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{plan.planName}</CardTitle>
          <Badge className={statusColor}>{t(`status.${statusKey}`)}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          {format(new Date(plan.planStartDate), 'MMM d')} - {format(new Date(plan.planEndDate), 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Target ST: {plan.targetSellThroughPct}%
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-orange-500" />
            Max MD: {plan.maxMarkdownPct}%
          </div>
        </div>

        <div className="flex gap-1">
          {plan.phases.map((phase) => (
            <div key={phase.id} className="flex-1 bg-blue-100 rounded px-2 py-1 text-xs text-center">
              {phase.markdownPct}%
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {plan.status === 'DRAFT' && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onOptimize} disabled={isOptimizing}>
              {isOptimizing ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" />{t('optimizing')}</>
              ) : (
                <><Zap className="h-4 w-4 mr-1" />{t('optimize')}</>
              )}
            </Button>
          )}
          <Link href={`/clearance/${plan.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              {tCommon('view')}<ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
