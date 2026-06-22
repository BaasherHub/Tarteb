import { formatSalaryAmount } from '@/shared/utils/salary';

export type Lang = 'en' | 'ar';

export interface Strings {
  appName: string;
  splashTagline: string;
  welcomeToTarteb: string;
  otpHelper: string;
  sendOtp: string;
  continueWithoutOtp: string;
  verify: string;
  otpCode: string;
  enterPhone: string;
  changePhone: string;
  changeRole: string;
  resendOtp: string;
  codeSentTo: string;
  signInWithEmail: string;
  selectRole: string;
  selectRoleSubtitle: string;
  changeLanguage: string;
  changeLanguageHint: string;
  roleSelectionKicker: string;
  signingUpAsRole: (role: string) => string;
  roleCandidate: string;
  roleEmployer: string;
  roleCandidateSubtitle: string;
  roleEmployerSubtitle: string;
  roleCandidateBullets: readonly string[];
  roleEmployerBullets: readonly string[];
  roleCandidatePriceFree: string;
  roleCandidateSectionLabel: string;
  roleSelectionTrust: string;
  roleCompareTitle: string;
  roleCompareIntro: string;
  roleCompareFeature: string;
  roleCompareShow: string;
  roleCompareHide: string;
  roleComparisonRows: readonly {
    feature: string;
    candidate: string;
    employer: string;
  }[];
  photoEmptyHeadline: string;
  photoEmptySub: string;
  photoBenefits: readonly string[];
  dashboardPhotoNag: string;
  dashboardPhotoNagAction: string;
  hiredBanner: string;
  hiredAlertTitle: string;
  hiredAlertMessage: string;
  hiredAlertConfirm: string;
  markHiredLabel: string;
  markHiredA11y: string;
  employerOnboardingKicker: string;
  employerOnboardingIntro: string;
  employerOnboardingStep1Title: string;
  employerOnboardingStep2Title: string;
  employerOnboardingStep1Intro: string;
  employerOnboardingStep2Intro: string;
  previousEmployerPlaceholder: string;
  browse: string;
  myUnlocks: string;
  currentSalaryLocked: string;
  unlockContact: string;
  contactUnlocked: string;
  contactUnlockedNoDetails: string;
  settings: string;
  settingsSectionAccount: string;
  settingsSectionPreferences: string;
  settingsSectionHelp: string;
  settingsSectionAccountType: string;
  settingsLanguageHint: string;
  settingsRtlReloadHint: string;
  settingsEditProfile: string;
  settingsEditCompany: string;
  candidateProfileTitle: string;
  settingsOpensInBrowser: string;
  settingsLogoutConfirmTitle: string;
  settingsLogoutConfirmMessage: string;
  settingsLogoutConfirm: string;
  settingsPhoneLabel: string;
  settingsNameLabel: string;
  settingsMemberSince: string;
  uaePassTitle: string;
  uaePassSub: string;
  uaePassSoon: string;
  continue: string;
  cancel: string;
  confirm: string;
  loading: string;
  errorTitle: string;
  errorGeneric: string;
  noCandidates: string;
  noCandidatesHint: string;
  resetFilters: string;
  employerOnboarding: string;
  companyName: string;
  contactName: string;
  startBrowsing: string;
  stepOf: (c: number, t: number) => string;
  camera: string;
  gallery: string;
  errPhotoRequired: string;
  jobRole: string;
  visaStatus: string;
  nationality: string;
  location: string;
  monthlySalary: string;
  currentSalary: string;
  expectedSalary: string;
  salarySectionTitle: string;
  contactsSectionTitle: string;
  phoneNumber: string;
  whatsappOptional: string;
  yearsExperience: string;
  languages: string;
  uaeExperience: string;
  yes: string;
  no: string;
  previousEmployer: string;
  fullName: string;
  fullNameOnId: string;
  experienceBucketLabel: (years: number) => string;
  languageLabel: (lang: string) => string;
  visaStatusLabel: (status: string) => string;
  homeAlsoOpenTo: string;
  experienceSelectOne: string;
  languagesSelectAll: string;
  onboardingOptionalSection: string;
  errPhotoGoBackStep1: string;
  errNameGoBackStep3: string;
  errSalaryVisaGoBackStep4: string;
  availableFromOptional: string;
  availableFromOptionalHint: string;
  availableFrom: string;
  submitProfile: string;
  saveProfile: string;
  required: string;
  requiredField: string;
  fieldOptionalSuffix: string;
  whatsapp: string;
  onboardingStep1Title: string;
  onboardingStepPhotoTitle: string;
  onboardingStepPhotoIntro: string;
  onboardingStepRoleTitle: string;
  onboardingStepLocationTitle: string;
  onboardingStepLocationIntro: string;
  onboardingStepSalaryVisaTitle: string;
  onboardingStepSalaryVisaIntro: string;
  onboardingStepExperienceTitle: string;
  onboardingStepExperienceIntro: string;
  errLocationArea: string;
  onboardingPhotoIntro: string;
  profileCompletionHeadline: (percent: number) => string;
  profileCompletionNext: (milestone: string) => string;
  profileCompleteHeadline: string;
  profileCompleteCelebration: string;
  employerProfileCompletionHeadline: (percent: number) => string;
  employerProfileCompleteCelebration: string;
  profileCompletionCta: string;
  saveCompanyProfile: string;
  employerEditKicker: string;
  employerOnboardingEditIntro: string;
  employerOnboardingEditStep1Intro: string;
  whatsappSupportMessage: string;
  profileMilestoneLabel: (id: string) => string;
  profilePaused: string;
  profileViews: string;
  profileLive: string;
  profileActive: string;
  homeOverviewSection: string;
  homeYourProfile: string;
  homeProfileViews: (count: number) => string;
  homeGotHired: string;
  homeLocationLabel: string;
  homeExperienceLabel: string;
  homeLanguagesLabel: string;
  homeLanguagesMore: (extra: number) => string;
  homeExpectedSalaryLabel: string;
  homeCurrentSalaryLabel: string;
  homeCurrentSalaryPrivate: string;
  cvSectionTitle: string;
  cvSectionHint: string;
  cvUpload: string;
  cvReplace: string;
  cvAttached: string;
  cvView: string;
  cvViewA11y: string;
  cvRemoveTitle: string;
  cvRemoveMessage: string;
  cvRemoveConfirm: string;
  cvInvalidFile: string;
  cvUploadFailed: string;
  cvOpenFailed: string;
  cvBadge: string;
  cvEmployerHint: string;
  editProfile: string;
  filters: string;
  candidatePickRole: string;
  candidatePickRoleHint: string;
  jobRoleSearchPlaceholder: string;
  jobRoleCategories: string;
  jobRoleAllCategories: string;
  allJobRoles: string;
  jobRoleNoMatch: string;
  jobRoleNoMatchDetail: (opts: {
    query?: string;
    categoryLabel?: string;
  }) => string;
  jobRoleClearSearch: string;
  jobRoleClearCategory: string;
  roleSelected: string;
  candidatePrimaryRoleTitle: string;
  candidatePrimaryRoleHint: string;
  candidatePrimaryRoleEditNote: string;
  candidateAdditionalRolesTitle: string;
  candidateAdditionalRolesHint: string;
  candidateAdditionalRolesScreenTitle: string;
  candidateAdditionalRolesScreenIntro: string;
  candidateAdditionalRolesCta: string;
  candidateAdditionalRolesEdit: string;
  candidateAdditionalRolesCount: (n: number, max: number) => string;
  candidatePrimaryRoleBadge: string;
  candidateSecondaryRoleBadge: string;
  candidateAlsoOpenTo: string;
  roleSelectedPrimary: string;
  candidateAdditionalRolesEmpty: string;
  jobRoleAdditionalCap: string;
  removeRole: (role: string) => string;
  employerPrimaryRoleBadge: string;
  employerSecondaryRoleBadge: string;
  employerAlsoOpenTo: string;
  employerMatchPrimaryShort: string;
  employerMatchSecondaryShort: (role: string) => string;
  employerRoleFilterLegend: string;
  employerRoleFilterLegendDismiss: string;
  browsePickRole: string;
  browsePickRoleHint: string;
  browseRefine: string;
  browseBackToRoles: string;
  candidatesForRole: (role: string) => string;
  filterOptionalHint: string;
  filterSalaryRange: string;
  filterExperience: string;
  browseFilterLanguages: string;
  filterUaeExp: string;
  filterAny: string;
  salaryMinLabel: string;
  salaryMaxLabel: string;
  salaryMinPlaceholder: string;
  salaryMaxPlaceholder: string;
  addEmirateOnly: (emirate: string) => string;
  otpPlaceholder: string;
  filterRoles: string;
  filterVisa: string;
  apply: string;
  reset: string;
  filtered: string;
  availableNow: string;
  enterEmail: string;
  email: string;
  searchPlaceholder: string;
  unlockedBadge: string;
  salaryPerMonth: (amount: string) => string;
  currentSalaryPerMonth: (amount: string) => string;
  expectedSalaryPerMonth: (amount: string) => string;
  call: string;
  whatsApp: string;
  noUnlocksYet: string;
  noUnlocksHint: string;
  devOtpBanner: string;
  selectLocation: string;
  supportWhatsApp: string;
  logout: string;
  english: string;
  arabic: string;
  nationalityLabel: string;
  experienceLabel: string;
  permissionRequired: string;
  emailPlaceholder: string;
  back: string;
  nationalityPlaceholder: string;
  locationEmirate: string;
  locationArea: string;
  locationAreaHint: string;
  employerLocationAreaHint: string;
  locationAreaPlaceholder: string;
  locationNoMatch: string;
  locationSelected: string;
  locationFilterHint: string;
  salaryPlaceholder: string;
  phonePlaceholder: string;
  phonePlaceholderSpaced: string;
  phoneSelectCountry: string;
  errPhoneInvalidArabRegion: string;
  errPhoneInvalid: string;
  otpSending: string;
  otpVerified: string;
  otpVerifiedEmail: string;
  otpSuccessSubtitle: string;
  otpVerifying: string;
  whatsappEmptyPlaceholder: string;
  whatsappOptionalHint: string;
  fullNamePlaceholder: string;
  companyPlaceholder: string;
  contactPlaceholder: string;
  datePlaceholder: string;
  availableFromHint: string;
  signInWithPhone: string;
  changeEmail: string;
  pickDate: string;
  photoHint: string;
  tapToAddPhoto: string;
  popularRoles: string;
  moreRoles: string;
  moreLanguages: string;
  showMoreLanguages: string;
  hideMoreLanguages: string;
  home: string;
  roleConfirmTitle: string;
  roleConfirmMessage: string;
  roleConfirmAction: (role: string) => string;
  roleSelectDifferent: string;
  contactUnlocks: string;
  contactUnlocksHint: string;
  contactUnlocksEmpty: string;
  errRole: string;
  errVisa: string;
  errNationality: string;
  errNationalityPick: string;
  errLocation: string;
  errAvailableFrom: string;
  errSalary: string;
  errCurrentSalary: string;
  errExpectedSalary: string;
  errPhone: string;
  errExperience: string;
  errLanguages: string;
  errUae: string;
  errFullName: string;
  errCompany: string;
  errCompanyTaken: string;
  errContact: string;
  errEmail: string;
  errEmailInvalid: string;
  draftSaved: string;
  draftSavedBanner: string;
  discardDraft: string;
  discardDraftLink: string;
  yourRole: string;
  wrongRoleHelp: string;
  contactSupportRole: string;
  language: string;
  accountNotice: string;
  popularLanguages: string;
  activeAgo: (days: number) => string;
  tradeLicense: string;
  tradeLicensePlaceholder: string;
  tradeLicenseHint: string;
  a11ySelected: string;
  a11yNotSelected: string;
  a11yChipToggle: string;
  a11yOpensCandidateProfile: string;
  a11yFilterModal: string;
  a11yApplyFilters: string;
  a11yResetFilters: string;
  a11yLoadingList: string;
  a11yRefineHint: string;
  a11yBackHint: string;
  a11yFieldInvalid: string;
  a11ySignInEmail: string;
  errorLoadList: string;
  offlineCachedHint: string;
  retry: string;
  loadingMore: string;
  errorBoundaryTitle: string;
  errorBoundaryMessage: string;
  notificationPermissionTitle: string;
  notificationPermissionMessage: string;
  employerNotificationPermissionMessage: string;
  employerProfileCompletionCta: string;
  employerProfileCompleteHeadline: string;
  notificationAllow: string;
  notificationNotNow: string;
  toastUnlockSuccess: string;
  toastNewUnlock: string;
  toastProfileViewed: string;
  a11yDismissToast: string;
  privacyPolicy: string;
  privacyPolicyUpdated: string;
}

const en: Strings = {
  appName: 'Tarteb',
  splashTagline: 'Hire staff and find work in the UAE',
  welcomeToTarteb: 'Welcome to Tarteb',
  otpHelper: "We'll send a 6-digit code",
  sendOtp: 'Send OTP',
  continueWithoutOtp: 'Continue',
  verify: 'Verify',
  otpCode: 'OTP code',
  enterPhone: 'Enter your phone number',
  changePhone: 'Change phone number',
  changeRole: 'Change role',
  resendOtp: 'Resend code',
  codeSentTo: 'Code sent to',
  signInWithEmail: 'Sign in with email instead',
  selectRole: 'Start hiring verified staff',
  selectRoleSubtitle:
    'Browse candidates by role, unlock phone and WhatsApp contacts, and hire across the UAE.',
  changeLanguage: 'Change language',
  changeLanguageHint: 'Wrong language? Tap Change language above.',
  roleSelectionKicker: 'For employers',
  roleSelectionTrust:
    'Your choice is saved securely. Contact support if you selected the wrong account type.',
  roleCompareTitle: 'Compare account types',
  roleCompareIntro:
    'Review the differences below. You cannot switch between job seeker and employer in the app without support.',
  roleCompareFeature: 'What you get',
  roleCompareShow: 'Compare account types',
  roleCompareHide: 'Hide comparison',
  roleComparisonRows: [
    {
      feature: 'Your goal',
      candidate: 'Find work in the UAE',
      employer: 'Hire staff for your business',
    },
    {
      feature: 'You create',
      candidate: 'A personal job profile',
      employer: 'A company hiring profile',
    },
    {
      feature: 'Others see',
      candidate: 'Employers browse you',
      employer: 'Candidates you unlock',
    },
    {
      feature: 'Cost',
      candidate: 'Free for job seekers',
      employer: 'Free to unlock contacts',
    },
    {
      feature: 'Change type later',
      candidate: 'Contact support only',
      employer: 'Contact support only',
    },
  ],
  photoEmptyHeadline: 'Your photo is required',
  photoEmptySub:
    'Employers decide in seconds. A clear face photo is the strongest trust signal on Tarteb.',
  photoBenefits: [
    'Up to 5× more profile views',
    'Employers contact candidates with photos first',
    'Shows you are serious about finding work',
  ],
  dashboardPhotoNag:
    'Add a clear face photo so employers trust your profile. Profiles without photos are rarely contacted.',
  dashboardPhotoNagAction: 'Add photo now',
  employerOnboardingKicker: 'Employer setup',
  employerOnboardingIntro:
    'Tell us about your business so candidates know who is hiring. Fields marked required must be completed.',
  employerOnboardingStep1Title: 'Company',
  employerOnboardingStep2Title: 'Contact & location',
  employerOnboardingStep1Intro:
    'Add your company name to continue. Trade license is optional.',
  employerOnboardingStep2Intro:
    'How can candidates and our team reach you?',
  hiredBanner: 'You are marked as hired — your profile is hidden from employers',
  hiredAlertTitle: 'Got hired?',
  hiredAlertMessage:
    'Congratulations! Your profile will be hidden from employers so you are not contacted for new roles.',
  hiredAlertConfirm: 'Yes, I got hired',
  markHiredLabel: 'I got hired — hide my profile',
  markHiredA11y: 'Mark profile as hired',
  previousEmployerPlaceholder: '',
  signingUpAsRole: (role) => `Creating your account as ${role}`,
  roleCandidate: 'Job seeker',
  roleEmployer: 'Employer',
  roleCandidateSubtitle: 'I am looking for work in the UAE',
  roleEmployerSubtitle: 'I am hiring for my business',
  roleCandidateBullets: [
    'Build a profile employers can discover',
    'Set salary, visa, and availability',
    'Get notified when employers view you',
  ],
  roleEmployerBullets: [
    'Browse verified job seekers by role',
    'Unlock phone and WhatsApp contacts',
    'Free while we grow our candidate network',
  ],
  roleCandidatePriceFree: 'Free for job seekers',
  roleCandidateSectionLabel: 'Looking for work instead?',
  browse: 'Browse',
  myUnlocks: 'Unlocks',
  currentSalaryLocked: 'Unlock to see current salary',
  unlockContact: 'Unlock contact',
  contactUnlocked: 'Contact unlocked!',
  contactUnlockedNoDetails:
    'Contact unlocked, but this candidate has not added a phone or WhatsApp number yet.',
  settings: 'Settings',
  settingsSectionAccount: 'Account',
  settingsSectionPreferences: 'Preferences',
  settingsSectionHelp: 'Help & legal',
  settingsSectionAccountType: 'Account type',
  settingsLanguageHint: 'App language',
  settingsRtlReloadHint: 'If the layout looks wrong, close and reopen the app.',
  settingsEditProfile: 'Edit profile',
  settingsEditCompany: 'Edit company profile',
  candidateProfileTitle: 'Candidate profile',
  settingsOpensInBrowser: 'Opens in browser',
  settingsLogoutConfirmTitle: 'Sign out?',
  settingsLogoutConfirmMessage: 'You will need your phone number to sign in again.',
  settingsLogoutConfirm: 'Sign out',
  settingsPhoneLabel: 'Phone',
  settingsNameLabel: 'Name',
  settingsMemberSince: 'Member since',
  uaePassTitle: 'UAE Pass verification',
  uaePassSub: 'Verify your identity with UAE Pass',
  uaePassSoon: 'Soon',
  continue: 'Continue',
  cancel: 'Cancel',
  confirm: 'Confirm',
  loading: 'Loading...',
  errorTitle: 'Something went wrong',
  errorGeneric: 'Something went wrong. Try again.',
  noCandidates: 'No candidates match your filters',
  noCandidatesHint: 'Try resetting filters or check back later for new profiles.',
  resetFilters: 'Reset filters',
  employerOnboarding: 'Company details',
  companyName: 'Company name',
  contactName: 'Contact name',
  startBrowsing: 'Start browsing',
  stepOf: (c, t) => `Step ${c} of ${t}`,
  camera: 'Camera',
  gallery: 'Gallery',
  errPhotoRequired: 'Add a clear face photo to continue. Use Camera or Gallery.',
  jobRole: 'Job role',
  visaStatus: 'Visa status',
  nationality: 'Nationality',
  location: 'Location',
  monthlySalary: 'Monthly salary (AED)',
  currentSalary: 'Current salary',
  expectedSalary: 'Expected salary',
  salarySectionTitle: 'Salary',
  contactsSectionTitle: 'Contact',
  phoneNumber: 'Phone number',
  whatsappOptional: 'WhatsApp (optional)',
  yearsExperience: 'Years of experience',
  languages: 'Languages',
  uaeExperience: 'Worked in UAE before?',
  yes: 'Yes',
  no: 'No',
  previousEmployer: 'Previous company',
  fullName: 'Full name',
  fullNameOnId: 'Full name (as on ID)',
  experienceBucketLabel: (years) => {
    if (years === 0) return 'No experience';
    if (years === 1) return '1 year';
    if (years === 2 || years === 3) return '2–3 years';
    if (years === 4) return '4–5 years';
    if (years >= 5) return '5+ years';
    return `${years} years`;
  },
  languageLabel: (lang) => {
    const labels: Record<string, string> = {
      English: 'English',
      Arabic: 'Arabic',
      Hindi: 'Hindi',
      Urdu: 'Urdu',
      Tagalog: 'Tagalog',
      Bengali: 'Bengali',
      Malayalam: 'Malayalam',
      Tamil: 'Tamil',
      Nepali: 'Nepali',
      Sinhala: 'Sinhala',
      Punjabi: 'Punjabi',
      Pashto: 'Pashto',
      French: 'French',
      Russian: 'Russian',
      Mandarin: 'Mandarin',
    };
    return labels[lang] ?? lang;
  },
  visaStatusLabel: (status) => {
    const labels: Record<string, string> = {
      'Employment Visa': 'Employment visa',
      'Visit Visa': 'Visit visa',
      'Own Visa': 'Own visa',
      'Cancelled Visa': 'Cancelled visa',
    };
    return labels[status] ?? status;
  },
  homeAlsoOpenTo: 'Also open to',
  experienceSelectOne: 'Choose one',
  languagesSelectAll: 'Choose all that apply',
  onboardingOptionalSection: 'Optional',
  errPhotoGoBackStep1: 'Add your photo — tap Back to go to step 1.',
  errNameGoBackStep3: 'Add your full name — tap Back to Location & contact.',
  errSalaryVisaGoBackStep4: 'Complete salary and visa — tap Back to the previous step.',
  availableFromOptional: 'Available from (optional)',
  availableFromOptionalHint: 'Leave blank if you can start anytime.',
  availableFrom: 'Available from',
  submitProfile: 'Submit profile',
  saveProfile: 'Save profile',
  required: 'Please fill all required fields',
  requiredField: 'Required',
  fieldOptionalSuffix: '(optional)',
  whatsapp: 'WhatsApp',
  onboardingStep1Title: 'Photo & job role',
  onboardingStepPhotoTitle: 'Your profile photo',
  onboardingStepPhotoIntro:
    'A clear face photo helps employers trust your profile and contact you faster.',
  onboardingStepRoleTitle: 'Your job role',
  onboardingStepLocationTitle: 'Location & contact',
  onboardingStepLocationIntro:
    'Your name, where you live, and how employers can reach you.',
  onboardingStepSalaryVisaTitle: 'Salary & visa',
  onboardingStepSalaryVisaIntro:
    'Helps employers match roles to your situation. Shared when you apply.',
  onboardingStepExperienceTitle: 'Experience',
  onboardingStepExperienceIntro:
    'Tell employers about your background and when you can start.',
  onboardingPhotoIntro:
    'Employers see your photo first. Use a clear face picture in good light.',
  profileCompletionHeadline: (percent) => `Profile ${percent}% complete`,
  profileCompletionNext: (milestone) => `Next: ${milestone}`,
  profileCompleteHeadline: 'Profile complete',
  profileCompleteCelebration:
    'Your profile is complete. Employers can discover you with full trust signals.',
  employerProfileCompletionHeadline: (percent) => `Company profile ${percent}% complete`,
  employerProfileCompleteCelebration:
    'Your company profile is complete. Browse candidates and unlock contacts when you find a match.',
  profileCompletionCta: 'Improve profile →',
  saveCompanyProfile: 'Save company profile',
  employerEditKicker: 'Edit company',
  employerOnboardingEditIntro: 'Update your business details. Changes apply immediately.',
  employerOnboardingEditStep1Intro:
    'Update your company name or trade license.',
  whatsappSupportMessage: 'Hi, I need support with Tarteb.',
  profileMilestoneLabel: (id) => {
    const labels: Record<string, string> = {
      photo: 'Add your profile photo',
      role: 'Select your job role',
      visa: 'Add visa status',
      nationality: 'Add nationality',
      location: 'Add your location',
      salary: 'Add current and expected salary',
      phone: 'Add phone number',
      name: 'Add your full name',
      available: 'Set availability date',
      experience: 'Add experience & languages',
      alsoRoles: 'Add roles you are also open to',
      company: 'Add company name',
      contact: 'Add contact person',
      email: 'Add business email',
    };
    return labels[id] ?? '';
  },
  profilePaused: 'Your profile is paused — employers cannot see you',
  profileViews: 'Profile views',
  profileLive: 'Your profile is live — employers can find you',
  profileActive: 'Profile active',
  homeOverviewSection: 'Overview',
  homeYourProfile: 'Your profile',
  homeProfileViews: (count) =>
    count === 1 ? '1 profile view' : `${count} profile views`,
  homeGotHired: 'I got a job',
  homeLocationLabel: 'Location',
  homeExperienceLabel: 'Experience',
  homeLanguagesLabel: 'Languages',
  homeLanguagesMore: (extra) => `+${extra} more`,
  homeExpectedSalaryLabel: 'Expected salary',
  homeCurrentSalaryLabel: 'Current salary',
  homeCurrentSalaryPrivate: 'Only visible to you until an employer unlocks you',
  cvSectionTitle: 'CV / resume',
  cvSectionHint: 'Optional. PDF or Word, up to 5 MB. Employers see it after they unlock you.',
  cvUpload: 'Upload CV',
  cvReplace: 'Replace',
  cvAttached: 'CV attached',
  cvView: 'View CV',
  cvViewA11y: 'Open your CV',
  cvRemoveTitle: 'Remove CV?',
  cvRemoveMessage: 'Employers who already unlocked you may have saved a copy.',
  cvRemoveConfirm: 'Remove',
  cvInvalidFile: 'Use a PDF or Word file under 8 MB.',
  cvUploadFailed: 'Could not upload CV. Try again.',
  cvOpenFailed: 'Could not open CV. Try again.',
  cvBadge: 'CV',
  cvEmployerHint: 'Unlock contact to view or download their CV.',
  editProfile: 'Edit',
  candidateAdditionalRolesEdit: 'Edit extra roles',
  filters: 'Filters',
  candidatePickRole: 'Your job role',
  candidatePickRoleHint: 'Choose the job you want most. You can add more roles from your profile later.',
  candidatePrimaryRoleTitle: 'Primary job role',
  candidatePrimaryRoleHint: 'This is the role employers see first.',
  candidatePrimaryRoleEditNote: 'To change your primary role, use Edit profile.',
  candidateAdditionalRolesTitle: 'Also open to',
  candidateAdditionalRolesHint:
    'Add up to 2 more roles. Employers can find you when they search for these jobs.',
  candidateAdditionalRolesScreenTitle: 'Also open to',
  candidateAdditionalRolesScreenIntro:
    'Get discovered for more jobs. You can change these anytime.',
  candidateAdditionalRolesCta: 'Add or edit extra roles',
  candidateAdditionalRolesCount: (n, max) =>
    `${n} of ${max} extra roles added — tap to edit`,
  candidatePrimaryRoleBadge: 'Primary',
  candidateSecondaryRoleBadge: 'Also',
  candidateAlsoOpenTo: 'Also open to',
  roleSelectedPrimary: 'Primary role',
  employerPrimaryRoleBadge: 'Primary',
  employerSecondaryRoleBadge: 'Secondary',
  employerAlsoOpenTo: 'Also open to',
  candidateAdditionalRolesEmpty: 'None added yet',
  jobRoleAdditionalCap: 'Maximum 2 additional roles. Remove one to add another.',
  removeRole: (role) => `Remove ${role}`,
  employerMatchPrimaryShort: 'Matches your filter (primary role)',
  employerMatchSecondaryShort: (role) => `Also open to ${role}`,
  employerRoleFilterLegend:
    'Primary = main job on profile. Secondary = also open to. Both count when they match your filter.',
  employerRoleFilterLegendDismiss: 'Got it',
  jobRoleSearchPlaceholder: '',
  jobRoleCategories: 'Browse by category',
  jobRoleAllCategories: 'All categories',
  allJobRoles: 'All roles',
  jobRoleNoMatch: 'No roles found.',
  jobRoleNoMatchDetail: ({ query, categoryLabel }) => {
    if (query && categoryLabel) {
      return `No roles in ${categoryLabel} match “${query}”. Try All categories or change your search.`;
    }
    if (query) {
      return `No roles match “${query}”. Check spelling or try another term.`;
    }
    if (categoryLabel) {
      return `No roles in ${categoryLabel}. Try All categories.`;
    }
    return 'No roles found.';
  },
  jobRoleClearSearch: 'Clear search',
  jobRoleClearCategory: 'Clear category',
  roleSelected: 'Selected',
  browsePickRole: 'What role are you hiring for?',
  browsePickRoleHint:
    'Choose a job title to see matching candidates. Refine with filters only if you need to.',
  browseRefine: 'Refine',
  browseBackToRoles: 'All roles',
  candidatesForRole: (role) => `Hiring for: ${role}`,
  filterOptionalHint: 'All filters are optional — leave blank to see everyone in this role.',
  filterSalaryRange: 'Salary range (AED / month)',
  filterExperience: 'Experience',
  browseFilterLanguages: 'Languages spoken',
  filterUaeExp: 'Worked in UAE before',
  filterAny: 'Any',
  salaryMinLabel: 'Minimum',
  salaryMaxLabel: 'Maximum',
  salaryMinPlaceholder: '',
  salaryMaxPlaceholder: '',
  addEmirateOnly: (emirate) => `All of ${emirate}`,
  otpPlaceholder: '',
  filterRoles: 'Job role',
  filterVisa: 'Visa status',
  apply: 'Apply',
  reset: 'Reset',
  filtered: 'Filtered',
  availableNow: 'Available now',
  enterEmail: 'Email address',
  email: 'Email',
  searchPlaceholder: '',
  unlockedBadge: 'Unlocked',
  salaryPerMonth: (amount) => { const s = formatSalaryAmount(amount); return s ? `AED ${s}/mo` : ''; },
  currentSalaryPerMonth: (amount) => { const s = formatSalaryAmount(amount); return s ? `Current: AED ${s}/mo` : ''; },
  expectedSalaryPerMonth: (amount) => { const s = formatSalaryAmount(amount); return s ? `Expected: AED ${s}/mo` : ''; },
  call: 'Call',
  whatsApp: 'WhatsApp',
  noUnlocksYet: 'No unlocks yet',
  noUnlocksHint: 'Browse candidates and unlock contacts when you are ready to hire.',
  devOtpBanner: 'Test mode: OTP disabled — no SMS cost',
  selectLocation: 'Select location',
  supportWhatsApp: 'Support (WhatsApp)',
  logout: 'Logout',
  english: 'English',
  arabic: 'العربية',
  nationalityLabel: 'Nationality',
  experienceLabel: 'Experience',
  permissionRequired: 'Camera or photo library permission is required',
  emailPlaceholder: '',
  back: 'Back',
  nationalityPlaceholder: '',
  locationEmirate: 'Emirate',
  locationArea: 'Area or district',
  locationAreaHint: 'Optional — helps employers find people near their business.',
  employerLocationAreaHint:
    'Optional — helps candidates see where your business is based.',
  locationAreaPlaceholder: '',
  locationNoMatch: 'No matching area — try another spelling or pick the emirate only.',
  locationSelected: 'Selected',
  locationFilterHint: 'Filter by emirate or a specific district',
  salaryPlaceholder: '',
  phonePlaceholder: '',
  phonePlaceholderSpaced: '',
  phoneSelectCountry: 'Select country',
  errPhoneInvalidArabRegion: 'Enter a valid mobile number.',
  errPhoneInvalid:
    'Enter a valid UAE mobile: +971 5X XXX XXXX (9 digits after +971).',
  whatsappEmptyPlaceholder: '',
  fullNamePlaceholder: '',
  companyPlaceholder: '',
  contactPlaceholder: '',
  datePlaceholder: '',
  availableFromHint: 'When you can start working',
  signInWithPhone: 'Sign in with phone instead',
  changeEmail: 'Change email',
  pickDate: 'Pick availability date',
  photoHint: 'Face the camera, good lighting, no sunglasses or filters.',
  tapToAddPhoto: 'Tap to add photo',
  popularRoles: 'Popular roles',
  moreRoles: 'More roles',
  moreLanguages: 'More languages',
  showMoreLanguages: 'More languages',
  hideMoreLanguages: 'Show fewer',
  home: 'Profile',
  roleConfirmTitle: 'Confirm account type',
  roleConfirmMessage:
    'You cannot switch between job seeker and employer in the app. Our support team can help if you chose the wrong type.',
  roleConfirmAction: (role) => `Continue as ${role}`,
  roleSelectDifferent: 'Choose a different type',
  contactUnlocks: 'Contact unlocks',
  contactUnlocksHint: 'Employers who unlocked your phone or WhatsApp',
  contactUnlocksEmpty: 'No unlocks yet — keep your profile active.',
  errRole: 'Select a job role',
  errVisa: 'Select your visa status',
  errNationality: 'Enter your nationality',
  errNationalityPick: 'Choose a nationality from the list',
  errLocation: 'Select your location',
  errLocationArea: 'Pick your district from the list',
  errAvailableFrom: 'Select when you are available to start',
  errSalary: 'Enter expected monthly salary',
  errCurrentSalary: 'Enter your current monthly salary',
  errExpectedSalary: 'Enter your expected monthly salary',
  errPhone: 'Enter your phone number',
  errExperience: 'Select years of experience',
  errLanguages: 'Select at least one language',
  errUae: 'Tell us if you worked in the UAE',
  errFullName: 'Enter your full name',
  errCompany: 'Enter company name',
  errCompanyTaken: 'This company name is already registered. Use your official business name.',
  errContact: 'Enter contact name',
  errEmail: 'Enter your email',
  errEmailInvalid: 'Enter a valid email address',
  draftSaved: 'Your progress is saved — you can leave and continue later.',
  draftSavedBanner: 'Draft saved',
  discardDraft: 'Discard saved progress',
  discardDraftLink: 'Discard',
  yourRole: 'Your account type',
  wrongRoleHelp:
    'Role cannot be changed in the app. If you chose Candidate or Employer by mistake, contact us on WhatsApp.',
  contactSupportRole: 'Contact support about my role',
  language: 'Language',
  accountNotice:
    'Your account is linked to this phone number. Use the same number when you return to sign in.',
  popularLanguages: 'Common languages',
  activeAgo: (days) =>
    days === 0 ? 'Active today' : days === 1 ? 'Active yesterday' : days < 7 ? `Active ${days}d ago` : days < 30 ? `Active ${Math.floor(days / 7)}w ago` : `Active ${Math.floor(days / 30)}mo ago`,
  tradeLicense: 'Trade license number',
  tradeLicensePlaceholder: '',
  tradeLicenseHint: 'Optional but helps candidates trust your business.',
  a11ySelected: 'Selected',
  a11yNotSelected: 'Not selected',
  a11yChipToggle: 'Double tap to toggle',
  a11yOpensCandidateProfile: 'Opens candidate profile',
  a11yFilterModal: 'Filter candidates',
  a11yApplyFilters: 'Apply filters',
  a11yResetFilters: 'Clear all filters',
  a11yLoadingList: 'Loading list',
  a11yRefineHint: 'Opens filter options',
  a11yBackHint: 'Returns to job roles',
  a11yFieldInvalid: 'Has an error',
  a11ySignInEmail: 'Opens email sign in',
  errorLoadList: 'Could not load candidates. Check your connection and try again.',
  offlineCachedHint: 'Showing saved results. Pull down to refresh when you are back online.',
  retry: 'Try again',
  loadingMore: 'Loading more…',
  errorBoundaryTitle: 'Something went wrong',
  errorBoundaryMessage: 'The app hit an unexpected error. You can try again.',
  notificationPermissionTitle: 'Stay in the loop',
  notificationPermissionMessage:
    'Get alerts when employers view your profile or unlock your contact.',
  employerNotificationPermissionMessage:
    'Get alerts when candidates update their profiles or when you have unlock activity.',
  employerProfileCompletionCta: 'Complete company profile →',
  employerProfileCompleteHeadline: 'Company profile complete',
  notificationAllow: 'Enable notifications',
  notificationNotNow: 'Not now',
  toastUnlockSuccess: 'Contact unlocked. You can call or message this candidate.',
  toastNewUnlock: 'An employer unlocked your contact details.',
  toastProfileViewed: 'An employer viewed your profile.',
  a11yDismissToast: 'Dismiss notification',
  privacyPolicy: 'Privacy policy',
  privacyPolicyUpdated: 'Last updated June 2026',
  otpSending: 'Sending verification code…',
  otpVerified: 'Phone verified',
  otpVerifiedEmail: 'Email verified',
  otpSuccessSubtitle: 'Success! Taking you to your account…',
  otpVerifying: 'Verifying code…',
  whatsappOptionalHint:
    'Leave blank if the same as your phone. Uses +971 format when filled.',
};

const ar: Strings = {
  appName: 'Tarteb',
  splashTagline: 'وظّف كوادر وابحث عن عمل في الإمارات',
  welcomeToTarteb: 'مرحباً بك في ترتّب',
  otpHelper: 'سنرسل رمزاً من 6 أرقام',
  sendOtp: 'إرسال الرمز',
  continueWithoutOtp: 'متابعة',
  verify: 'تحقق',
  otpCode: 'رمز التحقق',
  enterPhone: 'أدخل رقم هاتفك',
  changePhone: 'تغيير رقم الهاتف',
  changeRole: 'تغيير الدور',
  resendOtp: 'إعادة إرسال الرمز',
  codeSentTo: 'تم إرسال الرمز إلى',
  signInWithEmail: 'تسجيل الدخول بالبريد بدلاً من ذلك',
  selectRole: 'ابدأ توظيف كوادر موثوقة',
  selectRoleSubtitle:
    'تصفّح المرشحين حسب المهنة، افتح الهاتف وواتساب، ووظّف في جميع أنحاء الإمارات.',
  changeLanguage: 'تغيير اللغة',
  changeLanguageHint: 'اخترت لغة خاطئة؟ اضغط «تغيير اللغة» أعلاه.',
  roleSelectionKicker: 'لأصحاب العمل',
  roleSelectionTrust:
    'يتم حفظ اختيارك بأمان. تواصل مع الدعم إذا اخترت نوع حساب خاطئاً.',
  roleCompareTitle: 'قارن أنواع الحساب',
  roleCompareIntro:
    'راجع الفروقات أدناه. لا يمكن التبديل بين باحث عن عمل وصاحب عمل من التطبيق دون الدعم.',
  roleCompareFeature: 'ما الذي تحصل عليه',
  roleCompareShow: 'قارن أنواع الحساب',
  roleCompareHide: 'إخفاء المقارنة',
  roleComparisonRows: [
    {
      feature: 'هدفك',
      candidate: 'البحث عن عمل في الإمارات',
      employer: 'توظيف لشركتك',
    },
    {
      feature: 'تنشئ',
      candidate: 'ملفاً شخصياً للعمل',
      employer: 'ملف شركة للتوظيف',
    },
    {
      feature: 'يراك الآخرون',
      candidate: 'أصحاب العمل يتصفحونك',
      employer: 'المرشحون الذين تفتح بياناتهم',
    },
    {
      feature: 'التكلفة',
      candidate: 'مجاني لباحثي العمل',
      employer: 'فتح بيانات التواصل مجاناً',
    },
    {
      feature: 'تغيير النوع لاحقاً',
      candidate: 'عبر الدعم فقط',
      employer: 'عبر الدعم فقط',
    },
  ],
  photoEmptyHeadline: 'صورتك مطلوبة',
  photoEmptySub:
    'أصحاب العمل يقررون خلال ثوانٍ. صورة واضحة للوجه أقوى إشارة ثقة على ترتّب.',
  photoBenefits: [
    'حتى ٥ أضعاف مشاهدات الملف',
    'أصحاب العمل يتواصلون أولاً مع من لديهم صورة',
    'تُظهر جدّيتك في البحث عن عمل',
  ],
  dashboardPhotoNag:
    'أضف صورة واضحة للوجه ليزيد ثقة أصحاب العمل. الملفات بدون صور نادراً ما يتم التواصل معها.',
  dashboardPhotoNagAction: 'أضف صورة الآن',
  employerOnboardingKicker: 'إعداد صاحب العمل',
  employerOnboardingIntro:
    'أخبرنا عن نشاطك التجاري ليعرف المرشحون من يوظّف. الحقول المطلوبة يجب إكمالها.',
  employerOnboardingStep1Title: 'الشركة',
  employerOnboardingStep2Title: 'التواصل والموقع',
  employerOnboardingStep1Intro:
    'أضف اسم شركتك للمتابعة. الرخصة التجارية اختيارية.',
  employerOnboardingStep2Intro:
    'كيف يتواصل معك المرشحون وفريقنا؟',
  hiredBanner: 'تم تسجيلك كموظّف — ملفك مخفي عن أصحاب العمل',
  hiredAlertTitle: 'حصلت على عمل؟',
  hiredAlertMessage:
    'مبروك! سيُخفى ملفك عن أصحاب العمل ولن يتواصلوا معك لعروض جديدة.',
  hiredAlertConfirm: 'نعم، حصلت على عمل',
  markHiredLabel: 'حصلت على عمل — إخفاء ملفي',
  markHiredA11y: 'تسجيل الملف كموظّف',
  previousEmployerPlaceholder: '',
  signingUpAsRole: (role) => `إنشاء حسابك كـ ${role}`,
  roleCandidate: 'باحث عن عمل',
  roleEmployer: 'صاحب عمل',
  roleCandidateSubtitle: 'أبحث عن عمل في الإمارات',
  roleEmployerSubtitle: 'أوظّف لشركتي',
  roleCandidateBullets: [
    'أنشئ ملفاً يكتشفه أصحاب العمل',
    'حدّد الراتب والتأشيرة والتوفر',
    'إشعار عند مشاهدة ملفك',
  ],
  roleEmployerBullets: [
    'تصفح باحثي العمل حسب المهنة',
    'افتح الهاتف وواتساب',
    'مجاني بينما ننمّي شبكة المرشحين',
  ],
  roleCandidatePriceFree: 'مجاني لباحثي العمل',
  roleCandidateSectionLabel: 'تبحث عن عمل؟',
  browse: 'تصفح',
  myUnlocks: 'جهات الاتصال المفتوحة',
  currentSalaryLocked: 'افتح الملف لرؤية الراتب الحالي',
  unlockContact: 'افتح بيانات التواصل',
  contactUnlocked: 'تم فتح بيانات التواصل!',
  contactUnlockedNoDetails:
    'تم فتح بيانات التواصل، لكن المرشح لم يُضف رقم هاتف أو واتساب بعد.',
  settings: 'الإعدادات',
  settingsSectionAccount: 'الحساب',
  settingsSectionPreferences: 'التفضيلات',
  settingsSectionHelp: 'المساعدة والقانونية',
  settingsSectionAccountType: 'نوع الحساب',
  settingsLanguageHint: 'لغة التطبيق',
  settingsRtlReloadHint: 'إذا لم يتغيّر اتجاه الشاشة، أغلق التطبيق ثم افتحه من جديد.',
  settingsEditProfile: 'تعديل الملف',
  settingsEditCompany: 'تعديل ملف الشركة',
  candidateProfileTitle: 'ملف المرشح',
  settingsOpensInBrowser: 'يفتح في المتصفح',
  settingsLogoutConfirmTitle: 'تسجيل الخروج؟',
  settingsLogoutConfirmMessage: 'ستحتاج رقم هاتفك لتسجيل الدخول مرة أخرى.',
  settingsLogoutConfirm: 'خروج',
  settingsPhoneLabel: 'الهاتف',
  settingsNameLabel: 'الاسم',
  settingsMemberSince: 'عضو منذ',
  uaePassTitle: 'التحقق عبر الهوية الرقمية',
  uaePassSub: 'تحقق من هويتك عبر UAE Pass',
  uaePassSoon: 'قريباً',
  continue: 'متابعة',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  loading: 'جاري التحميل...',
  errorTitle: 'حدث خطأ',
  errorGeneric: 'حدث خطأ. حاول مرة أخرى.',
  noCandidates: 'لا يوجد مرشحون يطابقون الفلاتر',
  noCandidatesHint: 'جرّب إعادة تعيين الفلاتر أو عد لاحقاً لملفات جديدة.',
  resetFilters: 'إعادة تعيين الفلاتر',
  employerOnboarding: 'بيانات الشركة',
  companyName: 'اسم الشركة',
  contactName: 'اسم جهة الاتصال',
  startBrowsing: 'ابدأ التصفح',
  stepOf: (c, t) => `الخطوة ${c} من ${t}`,
  camera: 'الكاميرا',
  gallery: 'المعرض',
  errPhotoRequired: 'أضف صورة واضحة للوجه للمتابعة. استخدم الكاميرا أو المعرض.',
  jobRole: 'المهنة',
  visaStatus: 'حالة التأشيرة',
  nationality: 'الجنسية',
  location: 'الموقع',
  monthlySalary: 'الراتب الشهري (درهم)',
  currentSalary: 'الراتب الحالي',
  expectedSalary: 'الراتب المتوقع',
  salarySectionTitle: 'الراتب',
  contactsSectionTitle: 'التواصل',
  phoneNumber: 'رقم الهاتف',
  whatsappOptional: 'واتساب (اختياري)',
  yearsExperience: 'سنوات الخبرة',
  languages: 'اللغات',
  uaeExperience: 'هل عملت في الإمارات؟',
  yes: 'نعم',
  no: 'لا',
  previousEmployer: 'شركة سابقة',
  fullName: 'الاسم الكامل',
  fullNameOnId: 'الاسم الكامل (كما في الهوية)',
  experienceBucketLabel: (years) => {
    if (years === 0) return 'بدون خبرة';
    if (years === 1) return 'سنة واحدة';
    if (years === 2 || years === 3) return '2–3 سنوات';
    if (years === 4) return '4–5 سنوات';
    if (years >= 5) return '+5 سنوات';
    return `${years} سنوات`;
  },
  languageLabel: (lang) => {
    const labels: Record<string, string> = {
      English: 'الإنجليزية',
      Arabic: 'العربية',
      Hindi: 'الهندية',
      Urdu: 'الأردية',
      Tagalog: 'تاغالوغ',
      Bengali: 'البنغالية',
      Malayalam: 'المالايالامية',
      Tamil: 'التاميلية',
      Nepali: 'النيبالية',
      Sinhala: 'السنهالية',
      Punjabi: 'البنجابية',
      Pashto: 'البشتو',
      French: 'الفرنسية',
      Russian: 'الروسية',
      Mandarin: 'الماندرين',
    };
    return labels[lang] ?? lang;
  },
  visaStatusLabel: (status) => {
    const labels: Record<string, string> = {
      'Employment Visa': 'تأشيرة عمل',
      'Visit Visa': 'تأشيرة زيارة',
      'Own Visa': 'تأشيرة خاصة',
      'Cancelled Visa': 'تأشيرة ملغاة',
    };
    return labels[status] ?? status;
  },
  homeAlsoOpenTo: 'مفتوح أيضاً لـ',
  experienceSelectOne: 'اختر واحدة',
  languagesSelectAll: 'اختر كل ما ينطبق',
  onboardingOptionalSection: 'اختياري',
  errPhotoGoBackStep1: 'أضف صورتك — اضغط رجوع للخطوة 1.',
  errNameGoBackStep3: 'أضف اسمك الكامل — اضغط رجوع إلى الموقع والتواصل.',
  errSalaryVisaGoBackStep4: 'أكمل الراتب والتأشيرة — اضغط رجوع للخطوة السابقة.',
  availableFromOptional: 'متاح من (اختياري)',
  availableFromOptionalHint: 'اتركه فارغاً إن كنت متاحاً فوراً.',
  availableFrom: 'متاح من',
  submitProfile: 'إرسال الملف',
  saveProfile: 'حفظ الملف',
  required: 'يرجى تعبئة الحقول المطلوبة',
  requiredField: 'مطلوب',
  fieldOptionalSuffix: '(اختياري)',
  whatsapp: 'واتساب',
  onboardingStep1Title: 'الصورة والمهنة',
  onboardingStepPhotoTitle: 'صورة ملفك',
  onboardingStepPhotoIntro:
    'صورة واضحة للوجه تساعد أصحاب العمل على الوثوق بملفك والتواصل معك أسرع.',
  onboardingStepRoleTitle: 'مهنتك',
  onboardingStepLocationTitle: 'الموقع والتواصل',
  onboardingStepLocationIntro: 'اسمك ومكان سكنك وكيف يتواصل معك أصحاب العمل.',
  onboardingStepSalaryVisaTitle: 'الراتب والتأشيرة',
  onboardingStepSalaryVisaIntro:
    'يساعد أصحاب العمل على مطابقة الوظائف لوضعك. يُشارك عند التقديم.',
  onboardingStepExperienceTitle: 'الخبرة',
  onboardingStepExperienceIntro: 'أخبر أصحاب العمل عن خلفيتك ومتى يمكنك البدء.',
  onboardingPhotoIntro:
    'أصحاب العمل يرون صورتك أولاً. استخدم صورة واضحة للوجه بإضاءة جيدة.',
  profileCompletionHeadline: (percent) => `اكتمال الملف ${percent}٪`,
  profileCompletionNext: (milestone) => `التالي: ${milestone}`,
  profileCompleteHeadline: 'الملف مكتمل',
  profileCompleteCelebration:
    'ملفك مكتمل. يمكن لأصحاب العمل اكتشافك بإشارات ثقة كاملة.',
  employerProfileCompletionHeadline: (percent) => `اكتمال ملف الشركة ${percent}٪`,
  employerProfileCompleteCelebration:
    'ملف شركتك مكتمل. تصفّح المرشحين وافتح بيانات التواصل عندما تجد من يناسبك.',
  profileCompletionCta: 'تحسين الملف ←',
  saveCompanyProfile: 'حفظ بيانات الشركة',
  employerEditKicker: 'تعديل الشركة',
  employerOnboardingEditIntro: 'حدّث بيانات نشاطك التجاري. التغييرات تُطبّق فوراً.',
  employerOnboardingEditStep1Intro:
    'حدّث اسم الشركة أو الرخصة التجارية.',
  whatsappSupportMessage: 'مرحباً، أحتاج دعماً بخصوص ترتّب.',
  profileMilestoneLabel: (id) => {
    const labels: Record<string, string> = {
      photo: 'أضف صورة الملف',
      role: 'اختر مهنتك',
      visa: 'أضف حالة التأشيرة',
      nationality: 'أضف الجنسية',
      location: 'أضف موقعك',
      salary: 'أضف الراتب الحالي والمتوقع',
      phone: 'أضف رقم الهاتف',
      name: 'أضف الاسم الكامل',
      available: 'حدد تاريخ التوفر',
      experience: 'أضف الخبرة واللغات',
      alsoRoles: 'أضف مهناً إضافياً تفتح له العمل',
      company: 'أضف اسم الشركة',
      contact: 'أضف جهة الاتصال',
      email: 'أضف البريد الإلكتروني',
    };
    return labels[id] ?? '';
  },
  profilePaused: 'ملفك متوقف — أصحاب العمل لا يمكنهم رؤيتك',
  profileViews: 'مشاهدات الملف',
  profileLive: 'ملفك نشط — أصحاب العمل يمكنهم العثور عليك',
  profileActive: 'الملف نشط',
  homeOverviewSection: 'نظرة عامة',
  homeYourProfile: 'ملفك',
  homeProfileViews: (count) => (count === 1 ? 'مشاهدة واحدة' : `${count} مشاهدات`),
  homeGotHired: 'حصلت على عمل',
  homeLocationLabel: 'الموقع',
  homeExperienceLabel: 'الخبرة',
  homeLanguagesLabel: 'اللغات',
  homeLanguagesMore: (extra) => `+${extra} أخرى`,
  homeExpectedSalaryLabel: 'الراتب المتوقع',
  homeCurrentSalaryLabel: 'الراتب الحالي',
  homeCurrentSalaryPrivate: 'يظهر لك فقط حتى يفتحك صاحب عمل',
  cvSectionTitle: 'السيرة الذاتية',
  cvSectionHint: 'اختياري. PDF أو Word حتى 8 ميجا. يراها أصحاب العمل بعد فتح ملفك.',
  cvUpload: 'رفع السيرة',
  cvReplace: 'استبدال',
  cvAttached: 'تم إرفاق السيرة',
  cvView: 'عرض السيرة',
  cvViewA11y: 'فتح السيرة الذاتية',
  cvRemoveTitle: 'إزالة السيرة؟',
  cvRemoveMessage: 'قد يكون من حمّلها سابقاً قد حفظ نسخة.',
  cvRemoveConfirm: 'إزالة',
  cvInvalidFile: 'استخدم PDF أو Word أقل من 8 ميجا.',
  cvUploadFailed: 'تعذّر رفع السيرة. حاول مرة أخرى.',
  cvOpenFailed: 'تعذّر فتح السيرة. حاول مرة أخرى.',
  cvBadge: 'سيرة',
  cvEmployerHint: 'افتح جهة الاتصال لعرض أو تحميل السيرة.',
  editProfile: 'تعديل',
  candidateAdditionalRolesEdit: 'تعديل المهن الإضافية',
  filters: 'الفلاتر',
  candidatePickRole: 'مهنتك',
  candidatePickRoleHint: 'اختر المهنة الأهم لك. يمكنك إضافة مهن أخرى من ملفك لاحقاً.',
  candidatePrimaryRoleTitle: 'المهنة الأساسية',
  candidatePrimaryRoleHint: 'هذه المهنة تظهر أولاً لأصحاب العمل.',
  candidatePrimaryRoleEditNote: 'لتغيير المهنة الأساسية، استخدم تعديل الملف.',
  candidateAdditionalRolesTitle: 'مفتوح أيضاً لـ',
  candidateAdditionalRolesHint:
    'أضف حتى مهنتين. يمكن لأصحاب العمل العثور عليك عند البحث عن هذه المهن.',
  candidateAdditionalRolesScreenTitle: 'مفتوح أيضاً لـ',
  candidateAdditionalRolesScreenIntro:
    'ظهور في المزيد من الوظائف. يمكنك تغييرها في أي وقت.',
  candidateAdditionalRolesCta: 'إضافة أو تعديل مهن إضافية',
  candidateAdditionalRolesCount: (n, max) =>
    `${n} من ${max} مهن إضافية — اضغط للتعديل`,
  candidatePrimaryRoleBadge: 'أساسية',
  candidateSecondaryRoleBadge: 'إضافية',
  candidateAlsoOpenTo: 'مفتوح أيضاً لـ',
  roleSelectedPrimary: 'المهنة الأساسية',
  employerPrimaryRoleBadge: 'أساسية',
  employerSecondaryRoleBadge: 'ثانوية',
  employerAlsoOpenTo: 'مفتوح أيضاً لـ',
  candidateAdditionalRolesEmpty: 'لم تُضف بعد',
  jobRoleAdditionalCap: 'الحد الأقصى مهنتان إضافيتان. احذف واحدة لإضافة أخرى.',
  removeRole: (role) => `إزالة ${role}`,
  employerMatchPrimaryShort: 'يطابق الفلتر (مهنة رئيسية)',
  employerMatchSecondaryShort: (role) => `مفتوح أيضاً لـ ${role}`,
  employerRoleFilterLegend:
    'أساسية = المهنة الرئيسية. ثانوية = مفتوح أيضاً لـ. القائمة تعرض من يطابق مهمتك.',
  employerRoleFilterLegendDismiss: 'فهمت',
  jobRoleSearchPlaceholder: '',
  jobRoleCategories: 'تصفح حسب الفئة',
  jobRoleAllCategories: 'كل الفئات',
  allJobRoles: 'كل المهن',
  jobRoleNoMatch: 'لا توجد مهنة.',
  jobRoleNoMatchDetail: ({ query, categoryLabel }) => {
    if (query && categoryLabel) {
      return `لا توجد مهنة في ${categoryLabel} تطابق «${query}». جرّب كل الفئات أو غيّر البحث.`;
    }
    if (query) {
      return `لا توجد مهنة تطابق «${query}». تحقق من الكتابة أو جرّب كلمة أخرى.`;
    }
    if (categoryLabel) {
      return `لا توجد مهن في ${categoryLabel}. جرّب كل الفئات.`;
    }
    return 'لا توجد مهنة.';
  },
  jobRoleClearSearch: 'مسح البحث',
  jobRoleClearCategory: 'مسح الفئة',
  roleSelected: 'المحدد',
  browsePickRole: 'ما المهنة التي توظف لها؟',
  browsePickRoleHint:
    'اختر مهنة لعرض المرشحين المطابقين. استخدم الفلاتر فقط عند الحاجة.',
  browseRefine: 'تصفية',
  browseBackToRoles: 'كل المهن',
  candidatesForRole: (role) => `التوظيف لـ: ${role}`,
  filterOptionalHint: 'كل الفلاتر اختيارية — اتركها فارغة لعرض الجميع في هذه المهنة.',
  filterSalaryRange: 'نطاق الراتب (درهم / شهر)',
  filterExperience: 'الخبرة',
  browseFilterLanguages: 'اللغات',
  filterUaeExp: 'عمل سابقاً في الإمارات',
  filterAny: 'أي',
  salaryMinLabel: 'الحد الأدنى',
  salaryMaxLabel: 'الحد الأعلى',
  salaryMinPlaceholder: '',
  salaryMaxPlaceholder: '',
  addEmirateOnly: (emirate) => `كل ${emirate}`,
  otpPlaceholder: '',
  filterRoles: 'المهنة',
  filterVisa: 'حالة التأشيرة',
  apply: 'تطبيق',
  reset: 'إعادة تعيين',
  filtered: 'مفلتر',
  availableNow: 'متاح الآن',
  enterEmail: 'البريد الإلكتروني',
  email: 'البريد الإلكتروني',
  searchPlaceholder: '',
  unlockedBadge: 'مفتوح',
  salaryPerMonth: (amount) => `${formatSalaryAmount(amount)} درهم/شهر`,
  currentSalaryPerMonth: (amount) => `الحالي: ${formatSalaryAmount(amount)} درهم/شهر`,
  expectedSalaryPerMonth: (amount) => `المتوقع: ${formatSalaryAmount(amount)} درهم/شهر`,
  call: 'اتصال',
  whatsApp: 'واتساب',
  noUnlocksYet: 'لا يوجد فتح بعد',
  noUnlocksHint: 'تصفح المرشحين وافتح بيانات التواصل عندما تكون جاهزاً للتوظيف.',
  devOtpBanner: 'وضع الاختبار: OTP معطّل — بدون رسوم SMS',
  selectLocation: 'اختر الموقع',
  supportWhatsApp: 'الدعم (واتساب)',
  logout: 'تسجيل الخروج',
  english: 'English',
  arabic: 'العربية',
  nationalityLabel: 'الجنسية',
  experienceLabel: 'الخبرة',
  permissionRequired: 'مطلوب إذن الكاميرا أو معرض الصور',
  emailPlaceholder: '',
  back: 'رجوع',
  nationalityPlaceholder: '',
  locationEmirate: 'الإمارة',
  locationArea: 'المنطقة أو الحي',
  locationAreaHint: 'اختياري — يساعد أصحاب العمل في إيجاد مرشحين قريبين.',
  employerLocationAreaHint: 'اختياري — يساعد المرشحين على معرفة موقع نشاطك.',
  locationAreaPlaceholder: '',
  locationNoMatch: 'لا توجد منطقة مطابقة — جرّب إملاءً آخر أو اختر الإمارة فقط.',
  locationSelected: 'المحدد',
  locationFilterHint: 'فلترة حسب الإمارة أو حي محدد',
  salaryPlaceholder: '',
  phonePlaceholder: '',
  phonePlaceholderSpaced: '',
  phoneSelectCountry: 'اختر البلد',
  errPhoneInvalidArabRegion: 'أدخل رقم موبايل صالح.',
  errPhoneInvalid:
    'أدخل رقم موبايل إماراتي صالح: +971 5X XXX XXXX (9 أرقام بعد +971).',
  whatsappEmptyPlaceholder: '',
  fullNamePlaceholder: '',
  companyPlaceholder: '',
  contactPlaceholder: '',
  datePlaceholder: '',
  availableFromHint: 'متى يمكنك بدء العمل',
  signInWithPhone: 'تسجيل الدخول بالهاتف بدلاً من ذلك',
  changeEmail: 'تغيير البريد',
  pickDate: 'اختر تاريخ التوفر',
  photoHint: 'صورة واضحة للوجه تساعد أصحاب العمل على الوثوق بملفك',
  tapToAddPhoto: 'اضغط لإضافة صورة',
  popularRoles: 'مهن شائعة',
  moreRoles: 'مهن أخرى',
  moreLanguages: 'لغات أخرى',
  showMoreLanguages: 'المزيد من اللغات',
  hideMoreLanguages: 'عرض أقل',
  home: 'الملف',
  roleConfirmTitle: 'تأكيد نوع الحساب',
  roleConfirmMessage:
    'لا يمكن التبديل بين باحث عن عمل وصاحب عمل من التطبيق. فريق الدعم يمكنه المساعدة إذا اخترت بالخطأ.',
  roleConfirmAction: (role) => `المتابعة كـ ${role}`,
  roleSelectDifferent: 'اختر نوعاً آخر',
  contactUnlocks: 'فتح بيانات التواصل',
  contactUnlocksHint: 'أصحاب العمل الذين فتحوا هاتفك أو واتساب',
  contactUnlocksEmpty: 'لا تواصل بعد — أبقِ ملفك نشطاً.',
  errRole: 'اختر المهنة',
  errVisa: 'اختر حالة التأشيرة',
  errNationality: 'أدخل جنسيتك',
  errNationalityPick: 'اختر جنسية من القائمة',
  errLocation: 'اختر الموقع',
  errLocationArea: 'اختر الحي من القائمة',
  errAvailableFrom: 'اختر تاريخ بدء التوفر',
  errSalary: 'أدخل الراتب الشهري المتوقع',
  errCurrentSalary: 'أدخل راتبك الشهري الحالي',
  errExpectedSalary: 'أدخل راتبك الشهري المتوقع',
  errPhone: 'أدخل رقم الهاتف',
  errExperience: 'اختر سنوات الخبرة',
  errLanguages: 'اختر لغة واحدة على الأقل',
  errUae: 'أخبرنا إن عملت في الإمارات',
  errFullName: 'أدخل الاسم الكامل',
  errCompany: 'أدخل اسم الشركة',
  errCompanyTaken: 'اسم الشركة مسجّل مسبقاً. استخدم الاسم الرسمي لنشاطك التجاري.',
  errContact: 'أدخل اسم جهة الاتصال',
  errEmail: 'أدخل البريد الإلكتروني',
  errEmailInvalid: 'أدخل بريداً إلكترونياً صالحاً',
  draftSaved: 'تم حفظ تقدمك — يمكنك المغادرة والمتابعة لاحقاً.',
  draftSavedBanner: 'تم حفظ المسودة',
  discardDraft: 'حذف التقدم المحفوظ',
  discardDraftLink: 'تجاهل',
  yourRole: 'نوع حسابك',
  wrongRoleHelp:
    'لا يمكن تغيير الدور من التطبيق. إذا اخترت مرشحاً أو صاحب عمل بالخطأ، تواصل معنا عبر واتساب.',
  contactSupportRole: 'الدعم بخصوص نوع حسابي',
  language: 'اللغة',
  accountNotice:
    'حسابك مرتبط بهذا الرقم. استخدم نفس الرقم عند تسجيل الدخول مرة أخرى.',
  popularLanguages: 'لغات شائعة',
  activeAgo: (days) =>
    days === 0 ? 'نشط اليوم' : days === 1 ? 'نشط أمس' : days < 7 ? `نشط منذ ${days} أيام` : days < 30 ? `نشط منذ ${Math.floor(days / 7)} أسابيع` : `نشط منذ ${Math.floor(days / 30)} أشهر`,
  tradeLicense: 'رقم الرخصة التجارية',
  tradeLicensePlaceholder: '',
  tradeLicenseHint: 'اختياري — يساعد المرشحين على الوثوق بنشاطك التجاري.',
  a11ySelected: 'محدد',
  a11yNotSelected: 'غير محدد',
  a11yChipToggle: 'اضغط مرتين للتبديل',
  a11yOpensCandidateProfile: 'يفتح ملف المرشح',
  a11yFilterModal: 'تصفية المرشحين',
  a11yApplyFilters: 'تطبيق الفلاتر',
  a11yResetFilters: 'مسح جميع الفلاتر',
  a11yLoadingList: 'جاري تحميل القائمة',
  a11yRefineHint: 'يفتح خيارات التصفية',
  a11yBackHint: 'العودة إلى المهن',
  a11yFieldInvalid: 'يوجد خطأ',
  a11ySignInEmail: 'يفتح تسجيل الدخول بالبريد',
  errorLoadList: 'تعذّر تحميل المرشحين. تحقق من الاتصال وحاول مرة أخرى.',
  offlineCachedHint: 'عرض نتائج محفوظة. اسحب للأسفل للتحديث عند عودة الاتصال.',
  retry: 'حاول مرة أخرى',
  loadingMore: 'جاري تحميل المزيد…',
  errorBoundaryTitle: 'حدث خطأ غير متوقع',
  errorBoundaryMessage: 'واجه التطبيق مشكلة. يمكنك المحاولة مرة أخرى.',
  notificationPermissionTitle: 'ابقَ على اطلاع',
  notificationPermissionMessage:
    'تلقّ تنبيهات عند مشاهدة أصحاب العمل لملفك أو فتح بيانات تواصلك.',
  employerNotificationPermissionMessage:
    'تلقّ تنبيهات عند تحديث المرشحين لملفاتهم أو عند نشاط الفتح لديك.',
  employerProfileCompletionCta: 'إكمال ملف الشركة ←',
  employerProfileCompleteHeadline: 'ملف الشركة مكتمل',
  notificationAllow: 'تفعيل الإشعارات',
  notificationNotNow: 'ليس الآن',
  toastUnlockSuccess: 'تم فتح بيانات التواصل. يمكنك الاتصال أو المراسلة.',
  toastNewUnlock: 'قام صاحب عمل بفتح بيانات تواصلك.',
  toastProfileViewed: 'قام صاحب عمل بمشاهدة ملفك.',
  a11yDismissToast: 'إغلاق التنبيه',
  privacyPolicy: 'سياسة الخصوصية',
  privacyPolicyUpdated: 'آخر تحديث يونيو 2026',
  otpSending: 'جاري إرسال رمز التحقق…',
  otpVerified: 'تم التحقق من الهاتف',
  otpVerifiedEmail: 'تم التحقق من البريد',
  otpSuccessSubtitle: 'تم بنجاح! جاري فتح حسابك…',
  otpVerifying: 'جاري التحقق من الرمز…',
  whatsappOptionalHint:
    'اختياري — اتركه فارغاً إذا كان واتساب نفس رقم هاتفك.',
};

export function strings(lang: Lang): Strings {
  return lang === 'ar' ? ar : en;
}
