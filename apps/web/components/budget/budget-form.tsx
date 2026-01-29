'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { budgetFormSchema, BudgetFormData } from '@/lib/validations/budget';
import { Season, Brand, SalesLocation } from '@/types';
import { cn } from '@/lib/utils';

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData> & { id?: string };
  seasons: Season[];
  brands: Brand[];
  locations: SalesLocation[];
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  comparison?: {
    id: string;
    totalBudget: number;
    season: { code: string; name: string };
  } | null;
}

// Legacy-style form row component
function FormRow({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <label className="w-40 text-sm font-medium text-foreground shrink-0">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export function BudgetForm({
  initialData,
  seasons,
  brands,
  locations,
  onSubmit,
  onCancel,
  isLoading = false,
  comparison,
}: BudgetFormProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      seasonId: initialData?.seasonId || '',
      brandId: initialData?.brandId || '',
      locationId: initialData?.locationId || '',
      totalBudget: initialData?.totalBudget || 0,
      seasonalBudget: initialData?.seasonalBudget || undefined,
      replenishmentBudget: initialData?.replenishmentBudget || undefined,
      currency: initialData?.currency || 'USD',
      comments: initialData?.comments || '',
    },
  });

  const watchTotalBudget = form.watch('totalBudget');
  const watchSeasonalBudget = form.watch('seasonalBudget');
  const watchReplenishmentBudget = form.watch('replenishmentBudget');

  // Calculate variance from previous season
  const variance = comparison
    ? ((watchTotalBudget - Number(comparison.totalBudget)) /
        Number(comparison.totalBudget)) *
      100
    : null;

  // Validate seasonal + replenishment = total
  const budgetSum = (watchSeasonalBudget || 0) + (watchReplenishmentBudget || 0);
  const hasBudgetMismatch =
    watchSeasonalBudget !== undefined &&
    watchReplenishmentBudget !== undefined &&
    Math.abs(budgetSum - watchTotalBudget) > 0.01;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Main Form - Legacy Style */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 space-y-1">
            {/* Brand */}
            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormRow label="Group Brand" required>
                  <Select
                    disabled={!!initialData?.id || isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 h-10">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormRow>
              )}
            />

            {/* Season */}
            <FormField
              control={form.control}
              name="seasonId"
              render={({ field }) => (
                <FormRow label="Season" required>
                  <Select
                    disabled={!!initialData?.id || isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 h-10">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {seasons.map((season) => (
                        <SelectItem key={season.id} value={season.id}>
                          {season.code} - {season.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormRow>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormRow label="Location" required>
                  <Select
                    disabled={!!initialData?.id || isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 h-10">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormRow>
              )}
            />

            {/* Total Budget */}
            <FormField
              control={form.control}
              name="totalBudget"
              render={({ field }) => (
                <FormRow label="Total Budget" required>
                  <CurrencyInput
                    value={field.value}
                    onChange={(val) => field.onChange(val || 0)}
                    placeholder="0.00"
                    disabled={isLoading}
                    className="bg-white border-gray-300 h-10"
                  />
                  <FormMessage />
                </FormRow>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormRow label="Currency">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 h-10">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormRow>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormRow label="Comment">
                  <Input
                    placeholder="Add comment..."
                    disabled={isLoading}
                    className="bg-white border-gray-300 h-10"
                    {...field}
                  />
                  <FormMessage />
                </FormRow>
              )}
            />
          </div>

          {/* Advanced Options - Collapsible */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span>Advanced Options</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", advancedOpen && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4 border-t border-gray-200 space-y-1">
                {/* Seasonal Budget */}
                <FormField
                  control={form.control}
                  name="seasonalBudget"
                  render={({ field }) => (
                    <FormRow label="Seasonal Budget">
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        disabled={isLoading}
                        className="bg-white border-gray-300 h-10"
                      />
                      <p className="text-xs text-gray-500 mt-1">Budget for seasonal collection</p>
                      <FormMessage />
                    </FormRow>
                  )}
                />

                {/* Replenishment Budget */}
                <FormField
                  control={form.control}
                  name="replenishmentBudget"
                  render={({ field }) => (
                    <FormRow label="Replenishment">
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        disabled={isLoading}
                        className="bg-white border-gray-300 h-10"
                      />
                      <p className="text-xs text-gray-500 mt-1">Budget for stock replenishment</p>
                      <FormMessage />
                    </FormRow>
                  )}
                />

                {/* Budget Mismatch Warning */}
                {hasBudgetMismatch && (
                  <div className="ml-44 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                    Note: Seasonal (${watchSeasonalBudget?.toLocaleString()}) +
                    Replenishment (${watchReplenishmentBudget?.toLocaleString()}) =
                    ${budgetSum.toLocaleString()} does not equal Total Budget ($
                    {watchTotalBudget.toLocaleString()})
                  </div>
                )}

                {/* Comparison with Previous Season */}
                {comparison && (
                  <div className="ml-44 mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Comparison with {comparison.season.code}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-blue-600">Previous:</span>{' '}
                        <span className="font-semibold">${Number(comparison.totalBudget).toLocaleString()}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div>
                        <span className="text-blue-600">New:</span>{' '}
                        <span className="font-semibold">${watchTotalBudget.toLocaleString()}</span>
                      </div>
                      <div className={cn(
                        "font-semibold",
                        variance && variance > 0 ? 'text-green-600' : variance && variance < 0 ? 'text-red-600' : ''
                      )}>
                        {variance !== null ? `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%` : '-'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions - Legacy Style */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 bg-[#601818] hover:bg-[#7a2020] text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : initialData?.id ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
