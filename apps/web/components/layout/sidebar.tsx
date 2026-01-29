'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Package,
  Database,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  FolderTree,
  MapPin,
  Users,
  CheckSquare,
  BarChart3,
  Target,
  Brain,
  Calculator,
  GitCompare,
  Sparkles,
  FileText,
  Bot,
  Lightbulb,
  Wand2,
  Bell,
  CalendarDays,
  TrendingDown,
  Boxes,
  LineChart,
  LogOut,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { User, CreditCard, HelpCircle } from 'lucide-react';

// Core navigation items - matches legacy app (Main section)
const coreNavigation = [
  { key: 'budget', href: '/budget', icon: DollarSign },           // Financial Budget
  { key: 'otb', href: '/otb-analysis', icon: TrendingUp },        // OTB Analysis
  { key: 'sku', href: '/sku-proposal', icon: Package },           // SKU Proposal
];

// Extended navigation items (new features, hidden in "More" section)
const extendedNavigation = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },         // Dashboard Overview
  { key: 'wssi', href: '/wssi', icon: CalendarDays },             // WSSI Planning
  { key: 'approvals', href: '/approvals', icon: CheckSquare },    // Approvals
  { key: 'settings', href: '/settings', icon: Settings },         // Settings
];

const masterDataItems = [
  { key: 'brands', href: '/master-data/brands', icon: Building2 },
  { key: 'categories', href: '/master-data/categories', icon: FolderTree },
  { key: 'locations', href: '/master-data/locations', icon: MapPin },
  { key: 'users', href: '/master-data/users', icon: Users },
];

const analyticsItems = [
  { key: 'overview', href: '/analytics', icon: BarChart3 },
  { key: 'kpiDashboard', href: '/analytics/kpi', icon: Target },
  { key: 'forecast', href: '/analytics/forecast', icon: Brain },
  { key: 'simulator', href: '/analytics/simulator', icon: Calculator },
  { key: 'comparison', href: '/analytics/comparison', icon: GitCompare },
  { key: 'insights', href: '/analytics/insights', icon: Sparkles },
  { key: 'customReport', href: '/analytics/reports', icon: FileText },
];

const aiItems = [
  { key: 'aiAssistant', href: '/ai-assistant', icon: Bot },
  { key: 'suggestions', href: '/ai-suggestions', icon: Lightbulb },
  { key: 'autoPlan', href: '/ai-auto-plan', icon: Wand2 },
  { key: 'predictiveAlerts', href: '/predictive-alerts', icon: Bell },
];

const operationsItems = [
  { key: 'clearance', href: '/clearance', icon: TrendingDown },
  { key: 'replenishment', href: '/replenishment', icon: Boxes },
  { key: 'forecasting', href: '/forecasting', icon: LineChart },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations('navigation');
  const tMasterData = useTranslations('masterData');
  const tAnalytics = useTranslations('analytics');
  const tSettings = useTranslations('settings');
  const tAuth = useTranslations('auth');
  const tUi = useTranslations('ui');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [masterDataOpen, setMasterDataOpen] = useState(
    pathname.startsWith('/master-data')
  );
  const [analyticsOpen, setAnalyticsOpen] = useState(
    pathname.startsWith('/analytics')
  );
  const [aiOpen, setAiOpen] = useState(
    pathname.startsWith('/ai-') || pathname === '/predictive-alerts'
  );
  const [operationsOpen, setOperationsOpen] = useState(
    pathname === '/clearance' || pathname === '/replenishment' || pathname === '/forecasting'
  );

  // State for extended/more menu
  const [moreOpen, setMoreOpen] = useState(
    pathname === '/' || pathname === '/wssi' || pathname === '/approvals' || pathname.startsWith('/settings')
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300",
        "bg-[#601818] border-r border-[#7a2020]", // Legacy maroon background
        collapsed ? "w-[72px]" : "w-[260px]"
      )}>
        {/* Logo & Close Button - Legacy Style */}
        <div className={cn(
          "h-14 flex items-center border-b border-[#7a2020]",
          collapsed ? "px-2 justify-center" : "px-4 justify-between"
        )}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleCollapse}
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-[#D7B797] hover:bg-[#7a2020] transition-all duration-150"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {tUi('expand')}
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-2">
                {/* Crown Icon + DAFC-OTB Title */}
                <span className="text-[#D7B797] text-xl">👑</span>
                <span className="text-white font-bold text-lg tracking-wide">DAFC-OTB</span>
              </Link>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="flex items-center justify-center w-8 h-8 rounded text-[#D7B797] hover:bg-[#7a2020] transition-all duration-150"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation - Legacy Style */}
        <nav className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}>
          {/* Main Section Label */}
          {!collapsed && (
            <div className="px-2 mb-2">
              <span className="text-white/80 text-sm font-medium">Main</span>
            </div>
          )}

          {/* Core Navigation - Legacy 3 items */}
          <ul className="space-y-1">
            {coreNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded text-base font-medium transition-all duration-150',
                    collapsed ? 'px-2.5 py-2 justify-center' : 'px-3 py-2',
                    isActive
                      ? 'bg-[#7a2020] text-[#D7B797]'
                      : 'text-[#D7B797] hover:bg-[#7a2020]/50'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{t(item.key)}</span>}
                </Link>
              );

              return (
                <li key={item.key}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        {t(item.key)}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}

            {/* Divider */}
            <li className="my-3 border-t border-[#7a2020]" />

            {/* Extended/More Navigation - New features */}
            {!collapsed && (
              <li>
                <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center gap-3 px-3 py-2 rounded text-base font-medium text-[#D7B797]/70 hover:bg-[#7a2020]/50 transition-all duration-150">
                      <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{tUi('more')}</span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-0.5 pl-2">
                    {extendedNavigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'bg-[#7a2020] text-[#D7B797]'
                              : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50 hover:text-[#D7B797]'
                          )}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span>{t(item.key)}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </li>
            )}

            {/* Master Data Collapsible - Legacy Style */}
            <li>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/master-data/brands"
                      className={cn(
                        'flex items-center justify-center px-2.5 py-2 rounded text-base font-medium transition-all duration-150',
                        pathname.startsWith('/master-data')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <Database className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {t('masterData')}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Collapsible open={masterDataOpen} onOpenChange={setMasterDataOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 rounded text-base font-medium transition-all duration-150',
                        pathname.startsWith('/master-data')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <Database className="h-5 w-5" />
                      <span className="flex-1 text-left">{t('masterData')}</span>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', masterDataOpen && 'rotate-180')} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-0.5 pl-2">
                    {masterDataItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'bg-[#7a2020] text-[#D7B797]'
                              : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50 hover:text-[#D7B797]'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{tMasterData(item.key)}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </li>

            {/* Analytics Collapsible - Legacy Style */}
            <li>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/analytics"
                      className={cn(
                        'flex items-center justify-center px-2.5 py-2 rounded text-base font-medium transition-all duration-150',
                        pathname.startsWith('/analytics')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <BarChart3 className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {t('analytics')}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 rounded text-base font-medium transition-all duration-150',
                        pathname.startsWith('/analytics')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="flex-1 text-left">{t('analytics')}</span>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', analyticsOpen && 'rotate-180')} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-0.5 pl-2">
                    {analyticsItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'bg-[#7a2020] text-[#D7B797]'
                              : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50 hover:text-[#D7B797]'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{tAnalytics(item.key)}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </li>

            {/* AI Features Collapsible - Legacy Style */}
            <li>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/ai-assistant"
                      className={cn(
                        'flex items-center justify-center px-2.5 py-2 rounded text-base font-medium transition-all duration-150',
                        (pathname.startsWith('/ai-') || pathname === '/predictive-alerts')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <Bot className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    AI
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 rounded text-base font-medium transition-all duration-150',
                        (pathname.startsWith('/ai-') || pathname === '/predictive-alerts')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <Bot className="h-5 w-5" />
                      <span className="flex-1 text-left">AI</span>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', aiOpen && 'rotate-180')} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-0.5 pl-2">
                    {aiItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'bg-[#7a2020] text-[#D7B797]'
                              : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50 hover:text-[#D7B797]'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{t(item.key)}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </li>

            {/* Operations Collapsible - Legacy Style */}
            <li>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/clearance"
                      className={cn(
                        'flex items-center justify-center px-2.5 py-2 rounded text-base font-medium transition-all duration-150',
                        (pathname === '/clearance' || pathname === '/replenishment' || pathname === '/forecasting')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <TrendingDown className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {t('operations')}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Collapsible open={operationsOpen} onOpenChange={setOperationsOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 rounded text-base font-medium transition-all duration-150',
                        (pathname === '/clearance' || pathname === '/replenishment' || pathname === '/forecasting')
                          ? 'bg-[#7a2020] text-[#D7B797]'
                          : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50'
                      )}
                    >
                      <TrendingDown className="h-5 w-5" />
                      <span className="flex-1 text-left">{t('operations')}</span>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', operationsOpen && 'rotate-180')} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-0.5 pl-2">
                    {operationsItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'bg-[#7a2020] text-[#D7B797]'
                              : 'text-[#D7B797]/70 hover:bg-[#7a2020]/50 hover:text-[#D7B797]'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{t(item.key)}</span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </li>
          </ul>
        </nav>

        {/* User Section at Bottom - Legacy Style */}
        {session?.user && (
          <div className={cn(
            "border-t border-[#7a2020] p-3",
            collapsed ? "flex justify-center" : ""
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {collapsed ? (
                  <button className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#D7B797] text-[#601818] font-semibold">
                        {session.user.name ? getInitials(session.user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                ) : (
                  <button className="flex items-center gap-3 w-full p-2 rounded hover:bg-[#7a2020]/50 transition-colors cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#D7B797] text-[#601818] font-semibold text-base">
                        {session.user.name ? getInitials(session.user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-base font-medium truncate text-white">{session.user.name}</p>
                      <p className="text-sm truncate text-[#D7B797]/70">{session.user.email}</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-[#D7B797]/70" />
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64"
                align="start"
                side={collapsed ? "right" : "top"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="font-normal py-2.5 px-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-semibold leading-none">{session.user.name}</p>
                    <p className="text-sm leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="py-2.5 px-3 text-base">
                  <Link href="/settings/profile" className="cursor-pointer">
                    <User className="mr-2.5 h-5 w-5" />
                    <span>{tSettings('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2.5 px-3 text-base">
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2.5 h-5 w-5" />
                    <span>{tSettings('title')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2.5 px-3 text-base">
                  <Link href="/settings/billing" className="cursor-pointer">
                    <CreditCard className="mr-2.5 h-5 w-5" />
                    <span>{tSettings('billing')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2.5 px-3 text-base">
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="mr-2.5 h-5 w-5" />
                    <span>{t('help')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5 px-3 text-base"
                >
                  <LogOut className="mr-2.5 h-5 w-5" />
                  <span>{tAuth('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
