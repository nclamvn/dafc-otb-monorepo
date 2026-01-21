'use client';

import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ShoppingCart,
  Package,
  Target,
  Percent,
  BarChart3,
  Users,
  Building2,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  ShoppingCart,
  Package,
  Target,
  Percent,
  BarChart3,
  TrendingUp,
  Users,
  Building2,
};

export type DAFCIconName = keyof typeof iconMap;

interface DAFCKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: DAFCIconName;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'gold' | 'green' | 'default';
  sparklineData?: number[];
  status?: 'success' | 'warning' | 'critical' | 'info';
  className?: string;
}

function MiniSparkline({ data, variant }: { data: number[]; variant: 'gold' | 'green' | 'default' }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 28;
  const width = 70;
  const stepX = width / (data.length - 1);

  const points = data
    .map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = variant === 'gold'
    ? 'hsl(30 43% 72%)'
    : variant === 'green'
    ? 'hsl(152 73% 27%)'
    : 'hsl(30 43% 72%)';

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <defs>
        <linearGradient id={`sparkline-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={`url(#sparkline-grad-${variant})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function DAFCKPICard({
  title,
  value,
  subtitle,
  icon = 'DollarSign',
  trend,
  variant = 'default',
  sparklineData,
  status,
  className,
}: DAFCKPICardProps) {
  const Icon = iconMap[icon] || DollarSign;

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  const trendColorClass = trend
    ? trend.value > 0
      ? 'text-dafc-green'
      : trend.value < 0
      ? 'text-red-500'
      : 'text-muted-foreground'
    : '';

  const statusGlowClass = status
    ? {
        success: 'glow-success',
        warning: 'glow-warning',
        critical: 'glow-critical',
        info: 'glow-info',
      }[status]
    : '';

  const borderClass = variant === 'gold'
    ? 'border-t-[3px] border-t-[hsl(30_43%_72%)]'
    : variant === 'green'
    ? 'border-t-[3px] border-t-[hsl(152_73%_27%)]'
    : '';

  return (
    <div
      className={cn(
        'dafc-card relative overflow-hidden transition-all duration-200 hover:shadow-md',
        borderClass,
        statusGlowClass,
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: variant === 'gold'
            ? 'linear-gradient(135deg, hsl(30 43% 72%) 0%, transparent 50%)'
            : variant === 'green'
            ? 'linear-gradient(135deg, hsl(152 73% 27%) 0%, transparent 50%)'
            : 'linear-gradient(135deg, hsl(30 43% 72%) 0%, transparent 50%)'
        }}
      />

      <div className="dafc-card-content relative">
        <div className="flex items-start justify-between gap-4">
          {/* Left content */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Label */}
            <p className="text-xs font-brand font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>

            {/* Value */}
            <div className="flex items-baseline gap-2">
              <span className="font-data text-2xl font-bold tabular-nums text-foreground">
                {value}
              </span>
              {trend && TrendIcon && (
                <span className={cn(
                  'dafc-badge text-[10px] py-0.5 px-2',
                  trend.value > 0 ? 'dafc-badge-green' : trend.value < 0 ? 'bg-red-500/15 text-red-500 border-red-500/30' : 'dafc-badge-gold'
                )}>
                  <TrendIcon className="h-3 w-3" />
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}

            {/* Trend label */}
            {trend?.label && (
              <p className="text-[10px] text-muted-foreground/70">{trend.label}</p>
            )}
          </div>

          {/* Right content - Icon and Sparkline */}
          <div className="flex flex-col items-end gap-2">
            {/* Icon with DAFC styling */}
            <div
              className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center',
                variant === 'gold'
                  ? 'bg-[hsl(30_43%_72%/0.15)]'
                  : variant === 'green'
                  ? 'bg-[hsl(152_73%_27%/0.15)]'
                  : 'bg-[hsl(30_43%_72%/0.1)]'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  variant === 'gold'
                    ? 'text-[hsl(30_43%_72%)]'
                    : variant === 'green'
                    ? 'text-[hsl(152_73%_27%)]'
                    : 'text-[hsl(30_43%_72%)]'
                )}
              />
            </div>

            {/* Sparkline */}
            {sparklineData && (
              <MiniSparkline data={sparklineData} variant={variant} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DAFCKPICard;
