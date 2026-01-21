'use client';

import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  ChevronRight,
  X,
  Bell,
} from 'lucide-react';
import { useState } from 'react';

type AlertSeverity = 'critical' | 'warning' | 'success' | 'info';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: Date;
  actionLabel?: string;
  actionUrl?: string;
  dismissible?: boolean;
}

interface DAFCAlertsPanelProps {
  alerts: Alert[];
  title?: string;
  maxVisible?: number;
  onAlertClick?: (alert: Alert) => void;
  onDismiss?: (alertId: string) => void;
  className?: string;
}

const severityConfig: Record<AlertSeverity, {
  icon: typeof AlertTriangle;
  bgClass: string;
  borderClass: string;
  iconClass: string;
  glowClass: string;
  badgeClass: string;
}> = {
  critical: {
    icon: AlertCircle,
    bgClass: 'bg-red-500/10',
    borderClass: 'border-l-red-500',
    iconClass: 'text-red-500',
    glowClass: 'glow-critical',
    badgeClass: 'ind-badge-critical',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-l-amber-500',
    iconClass: 'text-amber-500',
    glowClass: 'glow-warning',
    badgeClass: 'ind-badge-warning',
  },
  success: {
    icon: CheckCircle,
    bgClass: 'bg-[hsl(152_73%_27%/0.1)]',
    borderClass: 'border-l-[hsl(152_73%_27%)]',
    iconClass: 'text-[hsl(152_73%_27%)]',
    glowClass: 'glow-success',
    badgeClass: 'ind-badge-success',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-l-blue-500',
    iconClass: 'text-blue-500',
    glowClass: 'glow-info',
    badgeClass: 'ind-badge-info',
  },
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const AlertItem = ({
  alert,
  onDismiss,
  onClick,
}: {
  alert: Alert;
  onDismiss?: () => void;
  onClick?: () => void;
}) => {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border-l-[3px] transition-all duration-200',
        config.bgClass,
        config.borderClass,
        onClick && 'cursor-pointer hover:bg-opacity-20'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          config.bgClass
        )}>
          <Icon className={cn('h-4 w-4', config.iconClass)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-brand font-semibold text-sm text-foreground">
              {alert.title}
            </h4>
            {alert.dismissible && onDismiss && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {alert.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(alert.timestamp)}
            </span>
            {alert.actionLabel && (
              <button className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(30_43%_72%)] hover:text-[hsl(30_40%_55%)] transition-colors flex items-center gap-0.5">
                {alert.actionLabel}
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function DAFCAlertsPanel({
  alerts,
  title = 'Active Alerts',
  maxVisible = 5,
  onAlertClick,
  onDismiss,
  className,
}: DAFCAlertsPanelProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort by severity (critical first) then by timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const visibleAlerts = showAll ? sortedAlerts : sortedAlerts.slice(0, maxVisible);
  const hasMore = sortedAlerts.length > maxVisible;

  // Count by severity
  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
    success: alerts.filter((a) => a.severity === 'success').length,
  };

  return (
    <div className={cn('dafc-card overflow-hidden', className)}>
      {/* Header */}
      <div className="dafc-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(30_43%_72%/0.15)] flex items-center justify-center">
              <Bell className="h-4.5 w-4.5 text-[hsl(30_43%_72%)]" />
            </div>
            <div>
              <h3 className="font-brand font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Severity counts */}
          <div className="flex items-center gap-2">
            {counts.critical > 0 && (
              <span className="ind-badge ind-badge-critical">{counts.critical}</span>
            )}
            {counts.warning > 0 && (
              <span className="ind-badge ind-badge-warning">{counts.warning}</span>
            )}
            {counts.info > 0 && (
              <span className="ind-badge ind-badge-info">{counts.info}</span>
            )}
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="dafc-card-content space-y-2">
        {visibleAlerts.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-8 w-8 text-[hsl(152_73%_27%)] mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          <>
            {visibleAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onDismiss={alert.dismissible && onDismiss ? () => onDismiss(alert.id) : undefined}
                onClick={onAlertClick ? () => onAlertClick(alert) : undefined}
              />
            ))}

            {hasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-2 text-center text-xs font-semibold uppercase tracking-wide text-[hsl(30_43%_72%)] hover:text-[hsl(30_40%_55%)] transition-colors"
              >
                {showAll ? 'Show Less' : `Show ${sortedAlerts.length - maxVisible} More`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DAFCAlertsPanel;
