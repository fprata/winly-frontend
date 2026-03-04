"use client";

import React, { useState, useActionState, useEffect } from 'react';
import { Building2, Brain, Bell, CreditCard, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { CPVSelector } from './CPVSelector';
import { CompetitorSelector } from './CompetitorSelector';
import { Card } from './ui/Card';
import { Input, Textarea } from './ui/Input';
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
        // Optional: Suggest updating company name
      } else if (!data.valid) {
        toast("error", t('vatInvalid'));
      }
    } catch (e) {
      toast("error", "Lookup failed");
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
      if (res.ok) toast("success", "Notification preferences saved");
      else toast("error", "Failed to save notification preferences");
    } catch {
      toast("error", "Failed to save notification preferences");
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

  const handleUpgrade = async (tier: string) => {
    if (tier === 'Enterprise') {
      toast("info", t('enterpriseContactAlert'));
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, priceId: 'price_12345' }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast("error", t('upgradeError'));
    }
  };

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={profile.id} />
      
      {/* Subscription Tier */}
      <Card>
        <div className="flex items-center gap-2 mb-5 text-gray-900">
          <CreditCard size={18} className="text-teal-600" />
          <h2 className="font-bold text-base">{t('subscriptionPlan')}</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">{t('currentPlan')}</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{profile?.tier || 'Explorer'}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.tier === 'Enterprise' ? t('enterpriseDesc') :
                profile?.tier === 'Business' ? t('businessDesc') :
                profile?.tier === 'Professional' ? t('professionalDesc') :
                t('explorerDesc')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(profile?.tier === 'Explorer' || !profile?.tier) && (
              <Button variant="secondary" type="button" onClick={() => handleUpgrade('Professional')}>
                {t('upgradeToProfessional')}
              </Button>
            )}
            {(profile?.tier === 'Explorer' || !profile?.tier || profile?.tier === 'Professional') && (
              <Button variant="secondary" type="button" onClick={() => handleUpgrade('Business')}>
                {t('upgradeToBusiness')}
              </Button>
            )}
            {profile?.tier !== 'Enterprise' && (
              <Button variant="accent" type="button" onClick={() => handleUpgrade('Enterprise')}>
                {t('upgradeToEnterprise')}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* General Info */}
      <Card>
        <div className="flex items-center gap-2 mb-5 text-gray-900">
          <Building2 size={18} className="text-teal-600" />
          <h2 className="font-bold text-base">{t('generalInfo')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-end">
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
              onClick={handleVatLookup}
              disabled={!profile?.vat_id || isLookingUp}
              className="md:mb-0.5"
            >
              {isLookingUp ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> {t('vatValidating')}</>
              ) : (
                <><Search size={16} className="mr-2" /> {t('vatLookup')}</>
              )}
            </Button>
          </div>

          {lookupResult && (
            <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {lookupResult.found ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-tight">{t('vatFound')}</p>
                    <h4 className="font-bold text-gray-900">{lookupResult.company.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200/50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        {lookupResult.company.persona}
                      </span>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => {
                      setProfile({ ...profile, name: lookupResult.company.name });
                      toast("info", "Company name updated from records");
                    }}
                  >
                    Use this name
                  </Button>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-tight">
                      {lookupResult.valid ? t('vatNotFound') : t('vatInvalid')}
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {lookupResult.valid 
                        ? "We couldn't find this company in our historical database. You can still save it to build your own history."
                        : "Please double-check the Tax Number format."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <Input
              label={t('companyName')}
              name="name"
              type="text"
              value={profile?.name || ""}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              disabled={isPending}
            />
            {state.errors?.name && <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>}
          </div>
          <div>
            <Input
              label={t('alertEmail')}
              name="email"
              type="email"
              value={profile?.email || ""}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              disabled={isPending}
            />
            {state.errors?.email && <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>}
          </div>
        </div>
      </Card>

      {/* AI Keywords */}
      <Card>
        <div className="flex items-center gap-2 mb-5 text-gray-900">
          <Brain size={18} className="text-teal-600" />
          <h2 className="font-bold text-base">{t('aiKeywords')}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Textarea
              label={t('yourServices')}
              name="services"
              rows={3}
              value={profile?.services || ""}
              onChange={e => setProfile({ ...profile, services: e.target.value })}
              placeholder={t('keywordsPlaceholder')}
              disabled={isPending}
            />
            {state.errors?.services && <p className="text-xs text-red-500 mt-1">{state.errors.services[0]}</p>}
          </div>

          <CPVSelector
            value={Array.isArray(profile.cpv_codes) ? profile.cpv_codes : (profile.cpv_codes ? profile.cpv_codes.split(',').map((s: string) => s.trim()) : [])}
            onChange={(val) => setProfile({ ...profile, cpv_codes: val })}
          />
          <input type="hidden" name="cpv_codes" value={Array.isArray(profile.cpv_codes) ? profile.cpv_codes.join(', ') : profile.cpv_codes} />

          <div>
            <CompetitorSelector
              value={profile.major_competitors || []}
              onChange={(val) => setProfile({ ...profile, major_competitors: val })}
            />
            <input type="hidden" name="major_competitors" value={JSON.stringify(profile.major_competitors)} />
            <p className="text-[11px] text-gray-400 mt-1.5 ml-0.5">{t('competitorsHint')}</p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-2 mb-5 text-gray-900">
          <Bell size={18} className="text-teal-600" />
          <h2 className="font-bold text-base">Email Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Daily match digest</p>
              <p className="text-xs text-gray-400 mt-0.5">Receive a daily summary of your top-matching tenders by email</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifPrefs(p => ({ ...p, email_digest_enabled: !p.email_digest_enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
                notifPrefs.email_digest_enabled ? 'bg-teal-600' : 'bg-gray-200'
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
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Minimum match score to include
              </label>
              <select
                value={notifPrefs.min_score_threshold}
                onChange={e => setNotifPrefs(p => ({ ...p, min_score_threshold: Number(e.target.value) }))}
                className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={50}>50+ (more matches)</option>
                <option value={60}>60+ (recommended)</option>
                <option value={70}>70+ (high quality only)</option>
                <option value={80}>80+ (only top matches)</option>
              </select>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={saveNotifPrefs} disabled={notifSaving}>
              {notifSaving ? 'Saving…' : 'Save notifications'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? t('updating') : t('saveChanges')}
        </Button>
      </div>
    </form>
  );
}
