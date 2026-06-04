import fs from 'fs';
import path from 'path';

const SRC = path.join(process.cwd(), 'src');

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(tsx?)$/.test(ent.name)) files.push(p);
  }
  return files;
}

const rules = [
  [/from '\.\.\/\.\.\/\.\.\/context\/CandidateOnboardingContext'/g, "from '@/features/candidate/providers/CandidateOnboardingContext'"],
  [/from '\.\.\/\.\.\/context\/CandidateOnboardingContext'/g, "from '@/features/candidate/providers/CandidateOnboardingContext'"],
  [/from '\.\.\/context\/CandidateOnboardingContext'/g, "from '@/features/candidate/providers/CandidateOnboardingContext'"],
  [/from '\.\.\/\.\.\/\.\.\/services\/candidatePhoto'/g, "from '@/features/candidate/data/services/candidatePhoto'"],
  [/from '\.\.\/\.\.\/\.\.\/services\/onboardingDraft'/g, "from '@/features/candidate/data/services/onboardingDraft'"],
  [/from '\.\.\/services\/onboardingDraft'/g, "from '@/features/candidate/data/services/onboardingDraft'"],
  [/from '\.\.\/services\/subscriptionPending'/g, "from '@/features/employer/data/services/subscriptionPending'"],
  [/from '\.\.\/\.\.\/services\/employerSubscription'/g, "from '@/features/employer/data/services/employerSubscription'"],
  [/from '\.\.\/\.\.\/services\/candidateBrowse'/g, "from '@/features/employer/data/services/candidateBrowse'"],
  [/from '\.\.\/\.\.\/services\/subscriptionPending'/g, "from '@/features/employer/data/services/subscriptionPending'"],
  [/from '\.\.\/\.\.\/services\/authNavigation'/g, "from '@/features/auth/data/services/authNavigation'"],
  [/from '\.\.\/\.\.\/services\/twilioVerify'/g, "from '@/features/auth/data/services/twilioVerify'"],
  [/from '\.\.\/services\/notifications'/g, "from '@/core/services/notifications'"],
  [/from '\.\.\/\.\.\/services\/notifications'/g, "from '@/core/services/notifications'"],
  [/from '\.\.\/\.\.\/\.\.\/types\/candidateOnboarding'/g, "from '@/features/candidate/domain/types/candidateOnboarding'"],
  [/from '\.\.\/\.\.\/types\/candidateOnboarding'/g, "from '@/features/candidate/domain/types/candidateOnboarding'"],
  [/from '\.\.\/types\/candidateOnboarding'/g, "from '@/features/candidate/domain/types/candidateOnboarding'"],
  [/from '\.\.\/\.\.\/\.\.\/constants\/nationalities'/g, "from '@/shared/constants/nationalities'"],
  [/from '\.\.\/\.\.\/constants\/nationalities'/g, "from '@/shared/constants/nationalities'"],
  [/from '\.\.\/\.\.\/\.\.\/constants\/candidate'/g, "from '@/features/candidate/domain/constants/candidate'"],
  [/from '\.\.\/\.\.\/constants\/candidate'/g, "from '@/features/candidate/domain/constants/candidate'"],
  [/from '\.\.\/constants\/candidate'/g, "from '@/features/candidate/domain/constants/candidate'"],
  [/from '\.\.\/\.\.\/\.\.\/constants\/colors'/g, "from '@/core/theme/colors'"],
  [/from '\.\.\/\.\.\/constants\/colors'/g, "from '@/core/theme/colors'"],
  [/from '\.\.\/constants\/colors'/g, "from '@/core/theme/colors'"],
  [/from '\.\.\/\.\.\/\.\.\/constants\/typography'/g, "from '@/core/theme/typography'"],
  [/from '\.\.\/\.\.\/constants\/typography'/g, "from '@/core/theme/typography'"],
  [/from '\.\.\/constants\/typography'/g, "from '@/core/theme/typography'"],
  [/from '\.\/uaeLocations'/g, "from '@/shared/constants/uaeLocations'"],
  [/from '\.\.\/\.\.\/\.\.\/utils\/dateFormat'/g, "from '@/shared/utils/dateFormat'"],
  [/from '\.\.\/\.\.\/utils\/dateFormat'/g, "from '@/shared/utils/dateFormat'"],
  [/from '\.\.\/utils\/dateFormat'/g, "from '@/shared/utils/dateFormat'"],
  [/from '\.\.\/\.\.\/\.\.\/utils\/visa'/g, "from '@/shared/utils/visa'"],
  [/from '\.\.\/\.\.\/utils\/visa'/g, "from '@/shared/utils/visa'"],
  [/from '\.\.\/utils\/visa'/g, "from '@/shared/utils/visa'"],
  [/from '\.\.\/\.\.\/utils\/whatsapp'/g, "from '@/shared/utils/whatsapp'"],
  [/from '\.\.\/utils\/whatsapp'/g, "from '@/shared/utils/whatsapp'"],
  [/from '\.\.\/\.\.\/\.\.\/hooks\/useRtlStyles'/g, "from '@/core/hooks/useRtlStyles'"],
  [/from '\.\.\/\.\.\/hooks\/useRtlStyles'/g, "from '@/core/hooks/useRtlStyles'"],
  [/from '\.\.\/hooks\/useRtlStyles'/g, "from '@/core/hooks/useRtlStyles'"],
  [/from '\.\.\/\.\.\/\.\.\/lib\/supabase'/g, "from '@/core/lib/supabase'"],
  [/from '\.\.\/\.\.\/lib\/supabase'/g, "from '@/core/lib/supabase'"],
  [/from '\.\.\/lib\/supabase'/g, "from '@/core/lib/supabase'"],
  [/from '\.\.\/\.\.\/\.\.\/navigation\/types'/g, "from '@/core/navigation/types'"],
  [/from '\.\.\/\.\.\/navigation\/types'/g, "from '@/core/navigation/types'"],
  [/from '\.\.\/navigation\/types'/g, "from '@/core/navigation/types'"],
  [/from '\.\.\/\.\.\/\.\.\/i18n\/LocaleContext'/g, "from '@/core/i18n/LocaleContext'"],
  [/from '\.\.\/\.\.\/i18n\/LocaleContext'/g, "from '@/core/i18n/LocaleContext'"],
  [/from '\.\.\/i18n\/LocaleContext'/g, "from '@/core/i18n/LocaleContext'"],
  [/from '\.\.\/\.\.\/\.\.\/components\/CandidateOnboardingStep'/g, "from '@/features/candidate/presentation/components/CandidateOnboardingStep'"],
  [/from '\.\.\/\.\.\/\.\.\/components\/PhotoAvatarPicker'/g, "from '@/features/candidate/presentation/components/PhotoAvatarPicker'"],
  [/from '\.\.\/\.\.\/components\/CandidateBrowseCard'/g, "from '@/features/employer/presentation/components/CandidateBrowseCard'"],
  [/from '\.\.\/\.\.\/components\/LocationFilterSection'/g, "from '@/features/employer/presentation/components/LocationFilterSection'"],
  [/from '\.\.\/components\/SettingsPanel'/g, "from '@/features/settings/presentation/components/SettingsPanel'"],
  [/from '\.\.\/\.\.\/\.\.\/components\/([^']+)'/g, "from '@/shared/widgets/$1'"],
  [/from '\.\.\/\.\.\/components\/([^']+)'/g, "from '@/shared/widgets/$1'"],
  [/from '\.\.\/components\/([^']+)'/g, "from '@/shared/widgets/$1'"],
  [/from '\.\/InfoBanner'/g, "from '@/shared/widgets/InfoBanner'"],
  [/from '\.\/VisaChip'/g, "from '@/shared/widgets/VisaChip'"],
  [/from '\.\/FieldError'/g, "from '@/shared/widgets/FieldError'"],
  [/from '\.\/ContentWidth'/g, "from '@/shared/widgets/ContentWidth'"],
  [/from '\.\/PrimaryButton'/g, "from '@/shared/widgets/PrimaryButton'"],
  [/from '\.\/SecondaryButton'/g, "from '@/shared/widgets/SecondaryButton'"],
  [/from '\.\/OnboardingProgress'/g, "from '@/features/candidate/presentation/components/OnboardingProgress'"],
  [/from '\.\/OnboardingDraftBanner'/g, "from '@/features/candidate/presentation/components/OnboardingDraftBanner'"],
];

const screenImports = `import { SplashScreen } from '@/features/app/presentation/screens/SplashScreen';
import { PhoneOtpScreen } from '@/features/auth/presentation/screens/PhoneOtpScreen';
import { EmailOtpScreen } from '@/features/auth/presentation/screens/EmailOtpScreen';
import { RoleSelectionScreen } from '@/features/auth/presentation/screens/RoleSelectionScreen';
import { EmployerOnboardingScreen } from '@/features/employer/presentation/screens/EmployerOnboardingScreen';
import { EmployerShellScreen } from '@/features/employer/presentation/screens/EmployerShellScreen';
import { CandidateDetailScreen } from '@/features/employer/presentation/screens/CandidateDetailScreen';
import { SubscriptionScreen } from '@/features/employer/presentation/screens/SubscriptionScreen';
import { CandidateOnboardingScreen } from '@/features/candidate/presentation/screens/CandidateOnboardingScreen';
import { CandidateDashboardScreen } from '@/features/candidate/presentation/screens/CandidateDashboardScreen';
import { CandidateShellScreen } from '@/features/candidate/presentation/screens/CandidateShellScreen';
import { SettingsScreen } from '@/features/settings/presentation/screens/SettingsScreen';
import { useLocale } from '@/core/i18n/LocaleContext';`;

let changed = 0;
for (const file of walk(SRC)) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [re, rep] of rules) text = text.replace(re, rep);
  if (file.endsWith('RootNavigator.tsx')) {
    text = text.replace(
      /import { SplashScreen } from[\s\S]*?import { useLocale } from[^\n]+/,
      screenImports,
    );
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    changed++;
  }
}
console.log(`Updated ${changed} files`);
