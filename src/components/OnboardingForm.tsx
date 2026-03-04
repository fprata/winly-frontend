"use client";

import React, { useState, useActionState } from 'react';
import { updateProfile, OnboardingState } from '@/app/[locale]/(onboarding)/onboarding/actions';
import { CPVSelector } from './CPVSelector';
import { CompetitorSelector } from './CompetitorSelector';
import { useTranslations } from 'next-intl';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

const initialState: OnboardingState = {
  error: null,
  success: false,
  message: null,
  errors: null,
}

export function OnboardingForm() {
  const t = useTranslations('profile');
  const [cpvCodes, setCpvCodes] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {state.error}
        </div>
      )}

      <div>
        <Input
          label={t('companyName')}
          id="companyName"
          name="companyName"
          type="text"
          required
          placeholder={t('companyNamePlaceholder')}
          disabled={isPending}
        />
        {state.errors?.companyName && (
          <p className="text-xs text-red-500 mt-1">{state.errors.companyName[0]}</p>
        )}
      </div>

      <div>
        <Textarea
          label={t('yourServices')}
          id="services"
          name="services"
          rows={3}
          required
          placeholder={t('keywordsPlaceholder')}
          disabled={isPending}
        />
        {state.errors?.services && (
          <p className="text-xs text-red-500 mt-1">{state.errors.services[0]}</p>
        )}
      </div>

      <div>
        <Input
          label={t('technologies')}
          id="techStack"
          name="techStack"
          type="text"
          placeholder={t('techStackPlaceholder')}
          disabled={isPending}
        />
        {state.errors?.techStack && (
          <p className="text-xs text-red-500 mt-1">{state.errors.techStack[0]}</p>
        )}
      </div>

      <CPVSelector value={cpvCodes} onChange={setCpvCodes} />
      <input type="hidden" name="cpv_codes" value={cpvCodes.join(', ')} />

      <CompetitorSelector value={competitors} onChange={setCompetitors} />
      <input type="hidden" name="major_competitors" value={JSON.stringify(competitors)} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            label={t('minBudget')}
            id="minBudget"
            name="minBudget"
            type="number"
            placeholder={t('minBudgetPlaceholder')}
            disabled={isPending}
          />
          {state.errors?.minBudget && (
            <p className="text-xs text-red-500 mt-1">{state.errors.minBudget[0]}</p>
          )}
        </div>
        <div>
          <Input
            label={t('maxBudget')}
            id="maxBudget"
            name="maxBudget"
            type="number"
            placeholder={t('maxBudgetPlaceholder')}
            disabled={isPending}
          />
          {state.errors?.maxBudget && (
            <p className="text-xs text-red-500 mt-1">{state.errors.maxBudget[0]}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="mt-3 w-full">
        {isPending ? t('saving') || 'Saving...' : t('saveAndContinue')}
      </Button>
    </form>
  );
}
