'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Breadcrumb } from './breadcrumb';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('navigation');
  const tNotif = useTranslations('notifications');

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b bg-background px-3 md:px-4">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">{t('toggleMenu')}</span>
      </Button>

      {/* Breadcrumb */}
      <div className="flex-1">
        <Breadcrumb />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div className="hidden sm:block">
          <LanguageSwitcher variant="icon" />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                3
              </span>
              <span className="sr-only">{t('notifications')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-semibold">
              {t('notifications')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-sm">{tNotif('sample.budgetApproved')}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{tNotif('sample.budgetApprovedDesc')}</p>
                <span className="text-[10px] text-muted-foreground pl-4">{tNotif('sample.timeAgo.minutes', { count: 30 })}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="font-medium text-sm">{tNotif('sample.lowStock')}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{tNotif('sample.lowStockDesc')}</p>
                <span className="text-[10px] text-muted-foreground pl-4">{tNotif('sample.timeAgo.hours', { count: 1 })}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium text-sm">{tNotif('sample.otbComplete')}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">{tNotif('sample.otbCompleteDesc')}</p>
                <span className="text-[10px] text-muted-foreground pl-4">{tNotif('sample.timeAgo.hoursPlural', { count: 2 })}</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer justify-center">
              {tNotif('viewAll')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('toggleTheme')}</span>
        </Button>
      </div>
    </header>
  );
}
