"use client";

import React, { useState, useActionState, useEffect } from 'react';
import { Search, CheckCircle2, AlertCircle, Loader2, Building2, ShieldCheck, CreditCard, Target, Bell, Mail, Users, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { CPVSelector } from './CPVSelector';
import { CompetitorSelector } from './CompetitorSelector';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from './ui/Toast';
import { updateProfile, ProfileState } from '@/app/[locale]/(dashboard)/profile/actions';

interface ProfileFormProps {
  initialProfile: any;
}

const initialState: ProfileState = {
  error: null,
  success: false,
  message: null,
  errors: null,
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const [profile, setProfile] = useState<any>({
    ...initialProfile,
    cpv_codes: initialProfile?.cpv_codes || [],
    major_competitors: initialProfile?.major_competitors || []
  });

  const [lookupResult, setLookupResult] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setProfile({
        ...initialProfile,
        cpv_codes: initialProfile?.cpv_codes || [],
        major_competitors: initialProfile?.major_competitors || []
      });
    }
  }, [initialProfile]);

  const handleVatLookup = async () => {
    if (!profile.vat_id) return;
    setIsLookingUp(true);
    setLookupResult(null);
    try {
      const res = await fetch(`/api/lookup/company?vatId=${profile.vat_id}`);
      const data = await res.json();
      setLookupResult(data);
      if (data.found && data.company) {
        toast("success", t('vatFound') + `: ${data.company.name}`);
      } else if (!data.valid) {
        toast("error", t('vatInvalid'));
      }
    } catch (e) {
      toast("error", t('lookupFailed'));
    } finally {
      setIsLookingUp(false);
    }
  };

  const [notifPrefs, setNotifPrefs] = useState<{
    email_digest_enabled: boolean
    min_score_threshold: number
  }>({ email_digest_enabled: true, min_score_threshold: 60 });
  const [notifSaving, setNotifSaving] = useState(false);

  useEffect(() => {
    fetch('/api/notifications/preferences')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setNotifPrefs(data) })
      .catch(() => {})
  }, []);

  const saveNotifPrefs = async () => {
    setNotifSaving(true);
    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifPrefs),
      });
      if (res.ok) toast("success", t('notificationsSaved'));
      else toast("error", t('notificationsSaveFailed'));
    } catch {
      toast("error", t('notificationsSaveFailed'));
    } finally {
      setNotifSaving(false);
    }
  };

  useEffect(() => {
    if (state.success) {
      toast("success", t('updateSuccess'));
      router.refresh();
    } else if (state.error) {
      toast("error", state.error);
    }
  }, [state, t, router]);

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      if (!res.ok) throw new Error('failed');
      const { url } = await res.json();
      if (url && typeof url === 'string' && url.startsWith('https://billing.stripe.com/')) {
        window.location.href = url;
      }
    } catch {
      toast('error', t('portalError'));
    }
  };

  const handleUpgrade = async (tier: 'Pro' | 'Enterprise' = 'Pro', billingInterval: 'month' | 'year' = 'month') => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billingInterval }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const { url } = await response.json();
      if (url && /^https:\/\/(checkout\.)?stripe\.com\//.test(url)) {
        window.location.href = url;
      }
    } catch {
      toast("error", t('upgradeError'));
    }
  };

  const tierName = profile?.tier === 'Enterprise' || profile?.tier === 'Professional' ? 'Enterprise'
    : profile?.tier === 'Pro' || profile?.tier === 'Starter' ? 'Pro'
    : 'Explorer';

  const tierColor = tierName === 'Enterprise' ? 'indigo' : tierName === 'Pro' ? 'blue' : 'zinc';
  const tierBg = tierName === 'Enterprise' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : tierName === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-zinc-100 text-zinc-600 border-zinc-200';

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={profile.id} />

      {/* Hero Card — Company Identity */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shrink-0">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                {profile?.name || t('companyName')}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {profile?.vat_id && (
                  <span className="text-xs font-medium text-zinc-400">NIF {profile.vat_id}</span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tierBg}`}>
                  <CreditCard size={10} />
                  {tierName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(!profile?.tier || profile.tier === 'free' || profile.tier === 'Explorer') && (
              <>
                <Button variant="accent" type="button" size="sm" onClick={() => handleUpgrade('Pro')}>
                  {t('upgradeToPro')}
                </Button>
              </>
            )}
            {(profile?.tier === 'Pro' || profile?.tier === 'Starter') && (
              <Button variant="accent" type="button" size="sm" onClick={() => handleUpgrade('Enterprise')}>
                {t('upgradeToEnterprise')}
              </Button>
            )}
            {profile?.tier && profile.tier !== 'free' && profile.tier !== 'Explorer' && (
              <Button variant="ghost" type="button" size="sm" onClick={handleManageSubscription}>
                {t('manageSubscription')}
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-500 mb-6">
          {profile?.tier === 'Enterprise' || profile?.tier === 'Professional'
            ? t('enterpriseDesc')
            : profile?.tier === 'Pro' || profile?.tier === 'Starter'
            ? t('proDesc')
            : t('explorerDesc')}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-zinc-50 rounded-xl text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">CPV Codes</p>
            <p className="text-xl font-extrabold text-zinc-900">
              {(Array.isArray(profile?.cpv_codes) ? profile.cpv_codes : (profile?.cpv_codes?.split(',') || [])).filter(Boolean).length}
            </p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('competitors')}</p>
            <p className="text-xl font-extrabold text-zinc-900">{(profile?.major_competitors || []).length}</p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('minBudget')}</p>
            <p className="text-xl font-extrabold text-zinc-900">
              {profile?.min_budget ? `€${Number(profile.min_budget).toLocaleString()}` : '—'}
            </p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('maxBudget')}</p>
            <p className="text-xl font-extrabold text-zinc-900">
              {profile?.max_budget ? `€${Number(profile.max_budget).toLocaleString()}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Company Details */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <h3 className="text-[15px] font-bold text-zinc-900">{t('generalInfo')}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <Input
                  label={t('vatId')}
                  name="vat_id"
                  type="text"
                  value={profile?.vat_id || ""}
                  onChange={e => setProfile({ ...profile, vat_id: e.target.value })}
                  disabled={isPending || isLookingUp}
                  placeholder="e.g. 500123456"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleVatLookup}
                disabled={!profile?.vat_id || isLookingUp}
                className="sm:mb-0.5"
              >
                {isLookingUp ? (
                  <><Loader2 size={14} className="animate-spin mr-1.5" /> {t('vatValidating')}</>
                ) : (
                  <><Search size={14} className="mr-1.5" /> {t('vatLookup')}</>
                )}
              </Button>
            </div>

            {lookupResult && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {lookupResult.found ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-700">{lookupResult.company.name}</p>
                      <span className="text-[10px] font-medium text-emerald-600">{lookupResult.company.persona}</span>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 shrink-0"
                      onClick={() => {
                        setProfile({ ...profile, name: lookupResult.company.name });
                        toast("info", t('companyNameUpdated'));
                      }}
                    >
                      {t('useThisName')}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-700">
                        {lookupResult.valid ? t('vatNotFound') : t('vatInvalid')}
                      </p>
                      <p className="text-[10px] text-amber-600 mt-0.5">
                        {lookupResult.valid ? t('vatNotFoundDesc') : t('vatInvalidDesc')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Input
              label={t('companyName')}
              name="name"
              type="text"
              value={profile?.name || ""}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              disabled={isPending}
            />
            {state.errors?.name && <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>}

            <Input
              label={t('alertEmail')}
              name="email"
              type="email"
              value={profile?.email || ""}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              disabled={isPending}
            />
            {state.errors?.email && <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('minBudget')}
                name="minBudget"
                type="number"
                value={profile?.min_budget || ""}
                onChange={e => setProfile({ ...profile, min_budget: e.target.value })}
                disabled={isPending}
                placeholder={t('minBudgetPlaceholder')}
              />
              <Input
                label={t('maxBudget')}
                name="maxBudget"
                type="number"
                value={profile?.max_budget || ""}
                onChange={e => setProfile({ ...profile, max_budget: e.target.value })}
                disabled={isPending}
                placeholder={t('maxBudgetPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell size={16} />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900">{t('emailNotifications')}</h3>
            </div>

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t('dailyDigest')}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{t('dailyDigestDesc')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(p => ({ ...p, email_digest_enabled: !p.email_digest_enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shrink-0 ${
                    notifPrefs.email_digest_enabled ? 'bg-blue-600' : 'bg-zinc-200'
                  }`}
                  aria-checked={notifPrefs.email_digest_enabled}
                  role="switch"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      notifPrefs.email_digest_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {notifPrefs.email_digest_enabled && (
                <div className="ml-12 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {t('minMatchScore')}
                  </label>
                  <select
                    value={notifPrefs.min_score_threshold}
                    onChange={e => setNotifPrefs(p => ({ ...p, min_score_threshold: Number(e.target.value) }))}
                    className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={50}>{t('score50')}</option>
                    <option value={60}>{t('score60')}</option>
                    <option value={70}>{t('score70')}</option>
                    <option value={80}>{t('score80')}</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={saveNotifPrefs} disabled={notifSaving}>
                  {notifSaving ? t('saving') : t('saveNotifications')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matching Profile — Full Width */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target size={16} />
          </div>
          <h3 className="text-[15px] font-bold text-zinc-900">{t('matchingProfile')}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CPVSelector
              value={Array.isArray(profile.cpv_codes) ? profile.cpv_codes : (profile.cpv_codes ? profile.cpv_codes.split(',').map((s: string) => s.trim()) : [])}
              onChange={(val) => setProfile({ ...profile, cpv_codes: val })}
            />
            <input type="hidden" name="cpv_codes" value={Array.isArray(profile.cpv_codes) ? profile.cpv_codes.join(', ') : profile.cpv_codes} />
          </div>

          <div>
            <CompetitorSelector
              value={profile.major_competitors || []}
              onChange={(val) => setProfile({ ...profile, major_competitors: val })}
            />
            <input type="hidden" name="major_competitors" value={JSON.stringify(profile.major_competitors)} />
            <p className="text-[10px] text-zinc-400 mt-1.5 ml-0.5">{t('competitorsHint')}</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? t('updating') : t('saveChanges')}
        </Button>
      </div>
    </form>
  );
}
