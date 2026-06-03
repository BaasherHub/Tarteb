import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';

import { CandidateOnboardingStep } from '../../../components/CandidateOnboardingStep';

import { FormField } from '../../../components/FormField';

import { DateField } from '../../../components/DateField';

import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';

import { useLocale } from '../../../i18n/LocaleContext';

import { supabase } from '../../../lib/supabase';

import { clearCandidateOnboardingDraft } from '../../../context/CandidateOnboardingContext';

import { resolveNationality } from '../../../constants/nationalities';
import { formatIsoDateLocal, parseIsoDateLocal } from '../../../utils/dateFormat';



type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;



export function Step4Availability({ navigation }: Props) {

  const { t } = useLocale();

  const { data, setStep } = useCandidateOnboarding();

  const [name, setName] = useState(data.name ?? '');

  const [availableFrom, setAvailableFrom] = useState<Date | null>(() =>
    data.availableFrom ? parseIsoDateLocal(data.availableFrom) : null,
  );

  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string | undefined>();

  const [dateError, setDateError] = useState<string | undefined>();



  const submit = async () => {

    if (!name.trim()) {

      setNameError(t.errFullName);

      return;

    }

    if (!availableFrom) {

      setDateError(t.errAvailableFrom);

      return;

    }

    setNameError(undefined);

    setDateError(undefined);

    setLoading(true);

    try {

      const userId = (await supabase.auth.getUser()).data.user?.id;

      if (!userId) throw new Error('Not signed in');



      const nationality =

        resolveNationality(data.nationality ?? '') ?? data.nationality?.trim() ?? '';

      const dateStr = formatIsoDateLocal(availableFrom);



      const payload = {

        user_id: userId,

        name: name.trim(),

        photo_url: data.photoUrl,

        role: data.role,

        visa_status: data.visaStatus,

        nationality,

        salary_expectation: data.salaryExpectation,

        available_from: dateStr,

        location: data.location,

        phone: data.phone,

        whatsapp: data.whatsapp,

        years_experience: data.yearsExperience ?? 0,

        languages: data.languages,

        uae_experience: data.uaeExperience,

        previous_employer: data.previousEmployer,

        is_active: true,

      };



      const { error } = await supabase

        .from('candidates')

        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;



      await clearCandidateOnboardingDraft();

      navigation.reset({ index: 0, routes: [{ name: 'CandidateShell' }] });

    } catch (e) {

      const msg = e instanceof Error ? e.message : t.errorGeneric;

      setNameError(msg);

    } finally {

      setLoading(false);

    }

  };



  return (

    <CandidateOnboardingStep

      scroll={false}

      primaryLabel={data.candidateId ? t.saveProfile : t.submitProfile}

      onPrimary={submit}

      primaryLoading={loading}

      backLabel={t.back}

      onBack={() => setStep(4)}

    >

      <FormField

        label={t.fullName}

        value={name}

        onChangeText={(v) => {

          setName(v);

          setNameError(undefined);

        }}

        placeholder={t.fullNamePlaceholder}

        error={nameError}

      />

      <DateField

        label={t.availableFrom}

        hint={t.availableFromHint}

        value={availableFrom}

        onChange={(date) => {

          setAvailableFrom(date);

          setDateError(undefined);

        }}

        error={dateError}

      />

    </CandidateOnboardingStep>

  );

}

