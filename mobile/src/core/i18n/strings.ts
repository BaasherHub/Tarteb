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
  resendOtp: string;
  codeSentTo: string;
  signInWithEmail: string;
  selectRole: string;
  selectRoleSubtitle: string;
  roleSelectionKicker: string;
  roleSelectionNextHint: string;
  signingUpAsRole: (role: string) => string;
  roleCandidate: string;
  roleEmployer: string;
  roleCandidateSubtitle: string;
  roleEmployerSubtitle: string;
  roleCandidateBullets: readonly string[];
  roleEmployerBullets: readonly string[];
  roleSelectionTrust: string;
  roleCompareTitle: string;
  roleCompareIntro: string;
  roleCompareFeature: string;
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
  companyLogo: string;
  companyLogoTap: string;
  companyLogoHint: string;
  previousEmployerPlaceholder: string;
  nationalityExamplesHint: string;
  browse: string;
  myUnlocks: string;
  subscribe: string;
  planActive: string;
  subscription: string;
  subscriptionPrice: string;
  unlockContact: string;
  contactUnlocked: string;
  subscriptionRequired: string;
  subscribeViaWhatsApp: string;
  subscriptionBody: string;
  subscriptionBullet1: string;
  subscriptionBullet2: string;
  subscriptionBullet3: string;
  subscriptionValidUntil: (date: string) => string;
  settings: string;
  settingsPhoneLabel: string;
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
  phoneNumber: string;
  whatsappOptional: string;
  yearsExperience: string;
  languages: string;
  uaeExperience: string;
  yes: string;
  no: string;
  previousEmployer: string;
  fullName: string;
  availableFrom: string;
  submitProfile: string;
  saveProfile: string;
  required: string;
  requiredField: string;
  onboardingStep1Title: string;
  onboardingStepPhotoTitle: string;
  onboardingStepPhotoIntro: string;
  onboardingStepRoleTitle: string;
  onboardingStep2Title: string;
  onboardingStep3Title: string;
  onboardingStep4Title: string;
  onboardingStep5Title: string;
  onboardingPhotoIntro: string;
  profileCompletionHeadline: (percent: number) => string;
  profileCompletionNext: (milestone: string) => string;
  profileCompleteHeadline: string;
  profileCompleteCelebration: string;
  profileCompletionCta: string;
  saveCompanyProfile: string;
  employerEditKicker: string;
  employerOnboardingEditIntro: string;
  employerOnboardingEditStep1Intro: string;
  whatsappSubscribeMessage: (tierName: string, price: string, contact: string) => string;
  whatsappSupportMessage: string;
  profileMilestoneLabel: (id: string) => string;
  subscriptionChoosePlan: string;
  subscriptionPlanActiveTitle: (tierName: string) => string;
  subscriptionRemainingUnlimited: string;
  subscriptionRemainingCount: (left: number) => string;
  subscriptionSubscribeToTier: (tierName: string) => string;
  subscriptionSwitchToTier: (tierName: string) => string;
  subscriptionPaymentNote: string;
  subscriptionBadgeCurrent: string;
  subscriptionBadgePopular: string;
  subscriptionA11yCurrentPlan: string;
  tierDisplayName: (tier: 'starter' | 'business' | 'agency') => string;
  tierDisplayPrice: (tier: 'starter' | 'business' | 'agency') => string;
  tierDisplayBullets: (tier: 'starter' | 'business' | 'agency') => readonly string[];
  profilePaused: string;
  profileViews: string;
  profileLive: string;
  profileActive: string;
  editProfile: string;
  filters: string;
  candidatePickRole: string;
  candidatePickRoleHint: string;
  jobRoleSearchPlaceholder: string;
  allJobRoles: string;
  jobRoleNoMatch: string;
  roleSelected: string;
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
  subscribeToUnlock: string;
  viewSubscription: string;
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
  nationalityHint: string;
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
  phoneHelper: string;
  phoneExampleLabel: (example: string) => string;
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
  home: string;
  roleConfirmTitle: string;
  roleConfirmMessage: string;
  roleConfirmAction: (role: string) => string;
  roleSelectDifferent: string;
  contactUnlocks: string;
  contactUnlocksHint: string;
  contactUnlocksEmpty: string;
  subStep1Title: string;
  subStep1Desc: string;
  subStep2Title: string;
  subStep2Desc: string;
  subStep3Title: string;
  subStep3Desc: string;
  managePlan: string;
  errRole: string;
  errVisa: string;
  errNationality: string;
  errNationalityPick: string;
  errLocation: string;
  errAvailableFrom: string;
  errSalary: string;
  errPhone: string;
  errExperience: string;
  errLanguages: string;
  errUae: string;
  errFullName: string;
  errCompany: string;
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
  subscriptionPending: string;
  subscriptionPendingHint: string;
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
  a11yManagePlanHint: string;
  a11yRefineHint: string;
  a11yBackHint: string;
  a11yFieldInvalid: string;
  a11ySelectPlan: string;
  a11ySignInEmail: string;
  errorLoadList: string;
  offlineCachedHint: string;
  retry: string;
  loadingMore: string;
  errorBoundaryTitle: string;
  errorBoundaryMessage: string;
  notificationPermissionTitle: string;
  notificationPermissionMessage: string;
  notificationAllow: string;
  notificationNotNow: string;
  toastSubscriptionActive: string;
  toastUnlockSuccess: string;
  toastNewUnlock: string;
  toastProfileViewed: string;
  a11yDismissToast: string;
  privacyPolicy: string;
}

const en: Strings = {
  appName: 'Tarteb',
  splashTagline: 'Your next job, arranged',
  welcomeToTarteb: 'Welcome to Tarteb',
  otpHelper: "We'll send a 6-digit code",
  sendOtp: 'Send OTP',
  continueWithoutOtp: 'Continue',
  verify: 'Verify',
  otpCode: 'OTP code',
  enterPhone: 'Enter your phone number',
  changePhone: 'Change phone number',
  resendOtp: 'Resend code',
  codeSentTo: 'Code sent to',
  signInWithEmail: 'Sign in with email instead',
  selectRole: 'How will you use Tarteb?',
  selectRoleSubtitle:
    'One account type per person. Pick the path that matches how you will use Tarteb.',
  roleSelectionKicker: 'Get started',
  roleSelectionNextHint: 'Next: verify your UAE mobile number (+971).',
  roleSelectionTrust:
    'Your choice is saved securely. Contact support if you selected the wrong account type.',
  roleCompareTitle: 'Compare account types',
  roleCompareIntro:
    'Review the differences below. You cannot switch between job seeker and employer in the app without support.',
  roleCompareFeature: 'What you get',
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
      employer: 'Monthly subscription (AED 79.9)',
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
    'Add your company details. A logo helps candidates recognise your business.',
  employerOnboardingStep2Intro:
    'How can candidates and our team reach you? Use your UAE mobile number.',
  companyLogo: 'Company logo',
  companyLogoTap: 'Tap to add company logo',
  companyLogoHint: 'Optional — square image works best. Builds trust with job seekers.',
  hiredBanner: 'You are marked as hired — your profile is hidden from employers',
  hiredAlertTitle: 'Got hired?',
  hiredAlertMessage:
    'Congratulations! Your profile will be hidden from employers so you are not contacted for new roles.',
  hiredAlertConfirm: 'Yes, I got hired',
  markHiredLabel: 'I got hired — hide my profile',
  markHiredA11y: 'Mark profile as hired',
  previousEmployerPlaceholder: 'Previous company name (optional)',
  nationalityExamplesHint: 'Examples: United Arab Emirates, Egypt, India, Philippines…',
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
    'Monthly plan — no per-profile fees',
  ],
  browse: 'Browse',
  myUnlocks: 'Candidates',
  subscribe: 'Subscribe',
  planActive: 'Plan active',
  subscription: 'Subscription',
  subscriptionPrice: 'AED 79.9 / month',
  unlockContact: 'Unlock contact',
  contactUnlocked: 'Contact unlocked!',
  subscriptionRequired: 'Subscribe to unlock candidate contacts',
  subscribeViaWhatsApp: 'Subscribe via WhatsApp',
  subscriptionBody:
    'Unlimited contact unlocks while your plan is active. Payment is confirmed via WhatsApp; we activate within 1 hour.',
  subscriptionBullet1: 'Unlimited unlocks for all candidates',
  subscriptionBullet2: 'Phone & WhatsApp contact details',
  subscriptionBullet3: 'Cancel anytime — no per-CV fees',
  subscriptionValidUntil: (date) => `Valid until ${date}`,
  settings: 'Settings',
  settingsPhoneLabel: 'Phone',
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
  phoneNumber: 'Phone number',
  whatsappOptional: 'WhatsApp (optional)',
  yearsExperience: 'Years of experience',
  languages: 'Languages',
  uaeExperience: 'Worked in UAE before?',
  yes: 'Yes',
  no: 'No',
  previousEmployer: 'Previous company (optional)',
  fullName: 'Full name',
  availableFrom: 'Available from',
  submitProfile: 'Submit profile',
  saveProfile: 'Save profile',
  required: 'Please fill all required fields',
  requiredField: 'Required',
  onboardingStep1Title: 'Photo & job role',
  onboardingStepPhotoTitle: 'Your profile photo',
  onboardingStepPhotoIntro:
    'A clear face photo helps employers trust your profile and contact you faster.',
  onboardingStepRoleTitle: 'Your job role',
  onboardingStep2Title: 'Visa & location',
  onboardingStep3Title: 'Salary & contacts',
  onboardingStep4Title: 'Experience & finish',
  onboardingStep5Title: 'Experience & finish',
  onboardingPhotoIntro:
    'Employers see your photo first. Use a clear face picture in good light.',
  profileCompletionHeadline: (percent) => `Profile ${percent}% complete`,
  profileCompletionNext: (milestone) => `Next: ${milestone}`,
  profileCompleteHeadline: 'Profile complete',
  profileCompleteCelebration:
    'Your profile is complete. Employers can discover you with full trust signals.',
  profileCompletionCta: 'Improve profile →',
  saveCompanyProfile: 'Save company profile',
  employerEditKicker: 'Edit company',
  employerOnboardingEditIntro: 'Update your business details. Changes apply immediately.',
  employerOnboardingEditStep1Intro:
    'Update your company name, logo, or trade license.',
  whatsappSubscribeMessage: (tierName, price, contact) =>
    `Hi, I want to subscribe to Tarteb — ${tierName} plan (${price}).\nMy number: ${contact}`,
  whatsappSupportMessage: 'Hi, I need support with Tarteb.',
  profileMilestoneLabel: (id) => {
    const labels: Record<string, string> = {
      photo: 'Add your profile photo',
      role: 'Select your job role',
      visa: 'Add visa status',
      nationality: 'Add nationality',
      location: 'Add your location',
      salary: 'Add expected salary',
      phone: 'Add phone number',
      name: 'Add your full name',
      available: 'Set availability date',
      experience: 'Add experience & languages',
      company: 'Add company name',
      contact: 'Add contact person',
      email: 'Add business email',
      logo: 'Add company logo',
    };
    return labels[id] ?? '';
  },
  subscriptionChoosePlan: 'Choose a plan',
  subscriptionPlanActiveTitle: (tierName) => `${tierName} plan — active`,
  subscriptionRemainingUnlimited: 'Unlimited unlocks this month',
  subscriptionRemainingCount: (left) => `${left} unlocks left this month`,
  subscriptionSubscribeToTier: (tierName) => `Subscribe to ${tierName} via WhatsApp`,
  subscriptionSwitchToTier: (tierName) => `Switch to ${tierName} via WhatsApp`,
  subscriptionPaymentNote:
    'Payment confirmed via WhatsApp · Activated within 1 hour · Cancel anytime',
  subscriptionBadgeCurrent: 'Current',
  subscriptionBadgePopular: 'Popular',
  subscriptionA11yCurrentPlan: 'Current plan',
  tierDisplayName: (tier) =>
    ({ starter: 'Starter', business: 'Business', agency: 'Agency' })[tier],
  tierDisplayPrice: (tier) =>
    ({
      starter: 'AED 79.9 / mo',
      business: 'AED 199 / mo',
      agency: 'AED 499 / mo',
    })[tier],
  tierDisplayBullets: (tier) =>
    ({
      starter: [
        '5 contact unlocks / month',
        'Phone & WhatsApp details',
        'All job categories',
      ],
      business: [
        '25 contact unlocks / month',
        'Phone & WhatsApp details',
        'All job categories',
        'Priority support',
      ],
      agency: [
        'Unlimited contact unlocks',
        'Phone & WhatsApp details',
        'All job categories',
        'Priority support',
        'Multi-role hiring',
      ],
    })[tier],
  profilePaused: 'Your profile is paused — employers cannot see you',
  profileViews: 'Profile views',
  profileLive: 'Your profile is live — employers can find you',
  profileActive: 'Profile active',
  editProfile: 'Edit profile',
  filters: 'Filters',
  candidatePickRole: 'Your job role',
  candidatePickRoleHint: 'Choose the role you want to work in.',
  jobRoleSearchPlaceholder: 'Search job role…',
  allJobRoles: 'All roles',
  jobRoleNoMatch: 'No roles match your search.',
  roleSelected: 'Selected',
  browsePickRole: 'What role are you hiring for?',
  browsePickRoleHint:
    'Pick a job title first — then refine by nationality, location, salary, experience, and more. Use only the filters that matter to you.',
  browseRefine: 'Refine',
  browseBackToRoles: 'All roles',
  candidatesForRole: (role) => role,
  filterOptionalHint: 'All filters are optional — leave blank to see everyone in this role.',
  filterSalaryRange: 'Salary range (AED / month)',
  filterExperience: 'Experience',
  browseFilterLanguages: 'Languages spoken',
  filterUaeExp: 'Worked in UAE before',
  filterAny: 'Any',
  salaryMinLabel: 'Minimum',
  salaryMaxLabel: 'Maximum',
  salaryMinPlaceholder: 'Min (optional)',
  salaryMaxPlaceholder: 'Max (optional)',
  addEmirateOnly: (emirate) => `All of ${emirate}`,
  otpPlaceholder: '6-digit code',
  filterRoles: 'Job role',
  filterVisa: 'Visa status',
  apply: 'Apply',
  reset: 'Reset',
  filtered: 'Filtered',
  availableNow: 'Available now',
  enterEmail: 'Email address',
  email: 'Email',
  searchPlaceholder: 'Search nationality...',
  unlockedBadge: 'Unlocked',
  salaryPerMonth: (amount) => `AED ${amount}/mo`,
  subscribeToUnlock: 'Subscribe to unlock phone & WhatsApp',
  viewSubscription: 'View plans',
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
  emailPlaceholder: 'Work or personal email',
  back: 'Back',
  nationalityPlaceholder: 'Search your nationality…',
  nationalityHint: 'Type to search, then pick your country from the list.',
  locationEmirate: 'Emirate',
  locationArea: 'Area or district',
  locationAreaHint: 'Optional — helps employers find people near their business.',
  employerLocationAreaHint:
    'Optional — helps candidates see where your business is based.',
  locationAreaPlaceholder: 'District or neighbourhood (optional)',
  locationNoMatch: 'No matching area — try another spelling or pick the emirate only.',
  locationSelected: 'Selected',
  locationFilterHint: 'Filter by emirate or a specific district',
  salaryPlaceholder: 'Amount in AED',
  phonePlaceholder: '+9715XXXXXXXX',
  phonePlaceholderSpaced: '+971 5X XXX XXXX',
  phoneHelper:
    'Use international format starting with +971. Do not start with 050 — enter the full number.',
  phoneExampleLabel: (example) => `Example: ${example}`,
  errPhoneInvalid:
    'Enter a valid UAE mobile: +971 5X XXX XXXX (9 digits after +971).',
  whatsappEmptyPlaceholder: 'WhatsApp number (optional)',
  fullNamePlaceholder: 'As on your ID',
  companyPlaceholder: 'Your registered business name',
  contactPlaceholder: 'Person we can reach',
  datePlaceholder: 'Select a date',
  availableFromHint: 'When you can start working',
  signInWithPhone: 'Sign in with phone instead',
  changeEmail: 'Change email',
  pickDate: 'Pick availability date',
  photoHint: 'Face the camera, good lighting, no sunglasses or filters.',
  tapToAddPhoto: 'Tap to add photo',
  popularRoles: 'Popular roles',
  moreRoles: 'More roles',
  moreLanguages: 'More languages',
  home: 'Home',
  roleConfirmTitle: 'Confirm account type',
  roleConfirmMessage:
    'You cannot switch between job seeker and employer in the app. Our support team can help if you chose the wrong type.',
  roleConfirmAction: (role) => `Continue as ${role}`,
  roleSelectDifferent: 'Choose a different type',
  contactUnlocks: 'Contact unlocks',
  contactUnlocksHint: 'Employers who unlocked your phone or WhatsApp',
  contactUnlocksEmpty: 'No employer has unlocked your contact yet. Keep your profile active.',
  subStep1Title: 'Message us on WhatsApp',
  subStep1Desc: 'Tap Subscribe — we send payment details',
  subStep2Title: 'We confirm payment',
  subStep2Desc: 'Usually within 1 hour on business days',
  subStep3Title: 'Plan active',
  subStep3Desc: 'Unlimited unlocks until your plan ends',
  managePlan: 'Plan',
  errRole: 'Select a job role',
  errVisa: 'Select your visa status',
  errNationality: 'Enter your nationality',
  errNationalityPick: 'Choose a nationality from the list',
  errLocation: 'Select your location',
  errAvailableFrom: 'Select when you are available to start',
  errSalary: 'Enter expected monthly salary',
  errPhone: 'Enter your phone number',
  errExperience: 'Select years of experience',
  errLanguages: 'Select at least one language',
  errUae: 'Tell us if you worked in the UAE',
  errFullName: 'Enter your full name',
  errCompany: 'Enter company name',
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
  subscriptionPending: 'Activation pending',
  subscriptionPendingHint:
    'We received your WhatsApp message. Your plan is usually activated within 1 hour on business days.',
  activeAgo: (days) =>
    days === 0 ? 'Active today' : days === 1 ? 'Active yesterday' : days < 7 ? `Active ${days}d ago` : days < 30 ? `Active ${Math.floor(days / 7)}w ago` : `Active ${Math.floor(days / 30)}mo ago`,
  tradeLicense: 'Trade license number',
  tradeLicensePlaceholder: 'Trade license number (optional)',
  tradeLicenseHint: 'Optional but helps candidates trust your business.',
  a11ySelected: 'Selected',
  a11yNotSelected: 'Not selected',
  a11yChipToggle: 'Double tap to toggle',
  a11yOpensCandidateProfile: 'Opens candidate profile',
  a11yFilterModal: 'Filter candidates',
  a11yApplyFilters: 'Apply filters',
  a11yResetFilters: 'Clear all filters',
  a11yLoadingList: 'Loading list',
  a11yManagePlanHint: 'Opens subscription plans',
  a11yRefineHint: 'Opens filter options',
  a11yBackHint: 'Returns to job roles',
  a11yFieldInvalid: 'Has an error',
  a11ySelectPlan: 'Double tap to select this plan',
  a11ySignInEmail: 'Opens email sign in',
  errorLoadList: 'Could not load candidates. Check your connection and try again.',
  offlineCachedHint: 'Showing saved results. Pull down to refresh when you are back online.',
  retry: 'Try again',
  loadingMore: 'Loading more…',
  errorBoundaryTitle: 'Something went wrong',
  errorBoundaryMessage: 'The app hit an unexpected error. You can try again.',
  notificationPermissionTitle: 'Stay in the loop',
  notificationPermissionMessage:
    'Get alerts when employers view your profile, unlock your contact, or when your subscription is activated.',
  notificationAllow: 'Enable notifications',
  notificationNotNow: 'Not now',
  toastSubscriptionActive: 'Your plan is active. You can unlock candidates now.',
  toastUnlockSuccess: 'Contact unlocked. You can call or message this candidate.',
  toastNewUnlock: 'An employer unlocked your contact details.',
  toastProfileViewed: 'An employer viewed your profile.',
  a11yDismissToast: 'Dismiss notification',
  privacyPolicy: 'Privacy policy',
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
  splashTagline: 'رتّب شغلك',
  welcomeToTarteb: 'مرحباً بك في ترتّب',
  otpHelper: 'سنرسل رمزاً من 6 أرقام',
  sendOtp: 'إرسال الرمز',
  continueWithoutOtp: 'متابعة',
  verify: 'تحقق',
  otpCode: 'رمز التحقق',
  enterPhone: 'أدخل رقم هاتفك',
  changePhone: 'تغيير رقم الهاتف',
  resendOtp: 'إعادة إرسال الرمز',
  codeSentTo: 'تم إرسال الرمز إلى',
  signInWithEmail: 'تسجيل الدخول بالبريد بدلاً من ذلك',
  selectRole: 'كيف ستستخدم ترتّب؟',
  selectRoleSubtitle:
    'نوع حساب واحد لكل شخص. اختر المسار الذي يناسب استخدامك لتطبيق ترتّب.',
  roleSelectionKicker: 'ابدأ الآن',
  roleSelectionNextHint: 'التالي: التحقق من رقمك الإماراتي (+971).',
  roleSelectionTrust:
    'يتم حفظ اختيارك بأمان. تواصل مع الدعم إذا اخترت نوع حساب خاطئاً.',
  roleCompareTitle: 'قارن أنواع الحساب',
  roleCompareIntro:
    'راجع الفروقات أدناه. لا يمكن التبديل بين باحث عن عمل وصاحب عمل من التطبيق دون الدعم.',
  roleCompareFeature: 'ما الذي تحصل عليه',
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
      employer: 'اشتراك شهري (٧٩٫٩ درهم)',
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
    'أضف بيانات شركتك. الشعار يساعد المرشحين على التعرّف على نشاطك.',
  employerOnboardingStep2Intro:
    'كيف يتواصل معك المرشحون وفريقنا؟ استخدم رقم موبايل إماراتي.',
  companyLogo: 'شعار الشركة',
  companyLogoTap: 'اضغط لإضافة شعار الشركة',
  companyLogoHint: 'اختياري — صورة مربعة أفضل. يعزز الثقة مع الباحثين عن عمل.',
  hiredBanner: 'تم تسجيلك كموظّف — ملفك مخفي عن أصحاب العمل',
  hiredAlertTitle: 'حصلت على عمل؟',
  hiredAlertMessage:
    'مبروك! سيُخفى ملفك عن أصحاب العمل ولن يتواصلوا معك لعروض جديدة.',
  hiredAlertConfirm: 'نعم، حصلت على عمل',
  markHiredLabel: 'حصلت على عمل — إخفاء ملفي',
  markHiredA11y: 'تسجيل الملف كموظّف',
  previousEmployerPlaceholder: 'اسم الشركة السابقة (اختياري)',
  nationalityExamplesHint: 'أمثلة: الإمارات، مصر، الهند، الفلبين…',
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
    'خطة شهرية — بدون رسوم لكل ملف',
  ],
  browse: 'تصفح',
  myUnlocks: 'المرشحون',
  subscribe: 'اشترك',
  planActive: 'الخطة نشطة',
  subscription: 'الاشتراك',
  subscriptionPrice: '٧٩٫٩ درهم / شهر',
  unlockContact: 'افتح بيانات التواصل',
  contactUnlocked: 'تم فتح بيانات التواصل!',
  subscriptionRequired: 'اشترك لفتح بيانات تواصل المرشحين',
  subscribeViaWhatsApp: 'اشترك عبر واتساب',
  subscriptionBody:
    'فتح غير محدود لبيانات التواصل طالما خطتك نشطة. يتم تأكيد الدفع عبر واتساب؛ التفعيل خلال ساعة.',
  subscriptionBullet1: 'فتح غير محدود لجميع المرشحين',
  subscriptionBullet2: 'رقم الهاتف وواتساب',
  subscriptionBullet3: 'إلغاء في أي وقت — بدون رسوم لكل سيرة',
  subscriptionValidUntil: (date) => `صالح حتى ${date}`,
  settings: 'الإعدادات',
  settingsPhoneLabel: 'الهاتف',
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
  phoneNumber: 'رقم الهاتف',
  whatsappOptional: 'واتساب (اختياري)',
  yearsExperience: 'سنوات الخبرة',
  languages: 'اللغات',
  uaeExperience: 'هل عملت في الإمارات؟',
  yes: 'نعم',
  no: 'لا',
  previousEmployer: 'شركة سابقة (اختياري)',
  fullName: 'الاسم الكامل',
  availableFrom: 'متاح من',
  submitProfile: 'إرسال الملف',
  saveProfile: 'حفظ الملف',
  required: 'يرجى تعبئة الحقول المطلوبة',
  requiredField: 'مطلوب',
  onboardingStep1Title: 'الصورة والمهنة',
  onboardingStepPhotoTitle: 'صورة ملفك',
  onboardingStepPhotoIntro:
    'صورة واضحة للوجه تساعد أصحاب العمل على الوثوق بملفك والتواصل معك أسرع.',
  onboardingStepRoleTitle: 'مهنتك',
  onboardingStep2Title: 'التأشيرة والموقع',
  onboardingStep3Title: 'الراتب والتواصل',
  onboardingStep4Title: 'الخبرة والإنهاء',
  onboardingStep5Title: 'الخبرة والإنهاء',
  onboardingPhotoIntro:
    'أصحاب العمل يرون صورتك أولاً. استخدم صورة واضحة للوجه بإضاءة جيدة.',
  profileCompletionHeadline: (percent) => `اكتمال الملف ${percent}٪`,
  profileCompletionNext: (milestone) => `التالي: ${milestone}`,
  profileCompleteHeadline: 'الملف مكتمل',
  profileCompleteCelebration:
    'ملفك مكتمل. يمكن لأصحاب العمل اكتشافك بإشارات ثقة كاملة.',
  profileCompletionCta: 'تحسين الملف ←',
  saveCompanyProfile: 'حفظ بيانات الشركة',
  employerEditKicker: 'تعديل الشركة',
  employerOnboardingEditIntro: 'حدّث بيانات نشاطك التجاري. التغييرات تُطبّق فوراً.',
  employerOnboardingEditStep1Intro:
    'حدّث اسم الشركة أو الشعار أو الرخصة التجارية.',
  whatsappSubscribeMessage: (tierName, price, contact) =>
    `مرحباً، أريد الاشتراك في ترتّب — خطة ${tierName} (${price}).\nرقمي: ${contact}`,
  whatsappSupportMessage: 'مرحباً، أحتاج دعماً بخصوص ترتّب.',
  profileMilestoneLabel: (id) => {
    const labels: Record<string, string> = {
      photo: 'أضف صورة الملف',
      role: 'اختر مهنتك',
      visa: 'أضف حالة التأشيرة',
      nationality: 'أضف الجنسية',
      location: 'أضف موقعك',
      salary: 'أضف الراتب المتوقع',
      phone: 'أضف رقم الهاتف',
      name: 'أضف الاسم الكامل',
      available: 'حدد تاريخ التوفر',
      experience: 'أضف الخبرة واللغات',
      company: 'أضف اسم الشركة',
      contact: 'أضف جهة الاتصال',
      email: 'أضف البريد الإلكتروني',
      logo: 'أضف شعار الشركة',
    };
    return labels[id] ?? '';
  },
  subscriptionChoosePlan: 'اختر خطة',
  subscriptionPlanActiveTitle: (tierName) => `خطة ${tierName} — نشطة`,
  subscriptionRemainingUnlimited: 'فتح غير محدود هذا الشهر',
  subscriptionRemainingCount: (left) => `${left} فتح متبقٍ هذا الشهر`,
  subscriptionSubscribeToTier: (tierName) => `اشترك في ${tierName} عبر واتساب`,
  subscriptionSwitchToTier: (tierName) => `التحويل إلى ${tierName} عبر واتساب`,
  subscriptionPaymentNote:
    'تأكيد الدفع عبر واتساب · التفعيل خلال ساعة · إلغاء في أي وقت',
  subscriptionBadgeCurrent: 'الحالية',
  subscriptionBadgePopular: 'الأكثر شيوعاً',
  subscriptionA11yCurrentPlan: 'الخطة الحالية',
  tierDisplayName: (tier) =>
    ({ starter: 'أساسية', business: 'أعمال', agency: 'وكالة' })[tier],
  tierDisplayPrice: (tier) =>
    ({
      starter: '٧٩٫٩ درهم / شهر',
      business: '١٩٩ درهم / شهر',
      agency: '٤٩٩ درهم / شهر',
    })[tier],
  tierDisplayBullets: (tier) =>
    ({
      starter: [
        '٥ فتح بيانات تواصل / شهر',
        'هاتف وواتساب',
        'جميع المهن',
      ],
      business: [
        '٢٥ فتح بيانات تواصل / شهر',
        'هاتف وواتساب',
        'جميع المهن',
        'دعم أولوية',
      ],
      agency: [
        'فتح بيانات تواصل غير محدود',
        'هاتف وواتساب',
        'جميع المهن',
        'دعم أولوية',
        'توظيف لعدة مهن',
      ],
    })[tier],
  profilePaused: 'ملفك متوقف — أصحاب العمل لا يمكنهم رؤيتك',
  profileViews: 'مشاهدات الملف',
  profileLive: 'ملفك نشط — أصحاب العمل يمكنهم العثور عليك',
  profileActive: 'الملف نشط',
  editProfile: 'تعديل الملف',
  filters: 'الفلاتر',
  candidatePickRole: 'مهنتك',
  candidatePickRoleHint: 'اختر المهنة التي تبحث عنها.',
  jobRoleSearchPlaceholder: 'ابحث عن المهنة…',
  allJobRoles: 'كل المهن',
  jobRoleNoMatch: 'لا توجد مهنة مطابقة.',
  roleSelected: 'المحدد',
  browsePickRole: 'ما المهنة التي توظف لها؟',
  browsePickRoleHint:
    'اختر المهنة أولاً — ثم صفّ حسب الجنسية والموقع والراتب والخبرة وغيرها. استخدم فقط الفلاتر التي تهمك.',
  browseRefine: 'تصفية',
  browseBackToRoles: 'كل المهن',
  candidatesForRole: (role) => role,
  filterOptionalHint: 'كل الفلاتر اختيارية — اتركها فارغة لعرض الجميع في هذه المهنة.',
  filterSalaryRange: 'نطاق الراتب (درهم / شهر)',
  filterExperience: 'الخبرة',
  browseFilterLanguages: 'اللغات',
  filterUaeExp: 'عمل سابقاً في الإمارات',
  filterAny: 'أي',
  salaryMinLabel: 'الحد الأدنى',
  salaryMaxLabel: 'الحد الأعلى',
  salaryMinPlaceholder: 'الحد الأدنى (اختياري)',
  salaryMaxPlaceholder: 'الحد الأعلى (اختياري)',
  addEmirateOnly: (emirate) => `كل ${emirate}`,
  otpPlaceholder: 'رمز من 6 أرقام',
  filterRoles: 'المهنة',
  filterVisa: 'حالة التأشيرة',
  apply: 'تطبيق',
  reset: 'إعادة تعيين',
  filtered: 'مفلتر',
  availableNow: 'متاح الآن',
  enterEmail: 'البريد الإلكتروني',
  email: 'البريد الإلكتروني',
  searchPlaceholder: 'ابحث عن الجنسية...',
  unlockedBadge: 'مفتوح',
  salaryPerMonth: (amount) => `${amount} درهم/شهر`,
  subscribeToUnlock: 'اشترك لفتح الهاتف وواتساب',
  viewSubscription: 'عرض الخطط',
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
  emailPlaceholder: 'بريد العمل أو الشخصي',
  back: 'رجوع',
  nationalityPlaceholder: 'ابحث عن جنسيتك…',
  nationalityHint: 'ابحث ثم اختر بلدك من القائمة.',
  locationEmirate: 'الإمارة',
  locationArea: 'المنطقة أو الحي',
  locationAreaHint: 'اختياري — يساعد أصحاب العمل في إيجاد مرشحين قريبين.',
  employerLocationAreaHint: 'اختياري — يساعد المرشحين على معرفة موقع نشاطك.',
  locationAreaPlaceholder: 'الحي أو المنطقة (اختياري)',
  locationNoMatch: 'لا توجد منطقة مطابقة — جرّب إملاءً آخر أو اختر الإمارة فقط.',
  locationSelected: 'المحدد',
  locationFilterHint: 'فلترة حسب الإمارة أو حي محدد',
  salaryPlaceholder: 'المبلغ بالدرهم',
  phonePlaceholder: '+9715XXXXXXXX',
  phonePlaceholderSpaced: '+971 5X XXX XXXX',
  phoneHelper:
    'استخدم الصيغة الدولية التي تبدأ بـ +971. لا تبدأ بـ 050 — أدخل الرقم كاملاً.',
  phoneExampleLabel: (example) => `مثال: ${example}`,
  errPhoneInvalid:
    'أدخل رقم موبايل إماراتي صالح: +971 5X XXX XXXX (9 أرقام بعد +971).',
  whatsappEmptyPlaceholder: 'رقم واتساب (اختياري)',
  fullNamePlaceholder: 'كما في الهوية',
  companyPlaceholder: 'اسم الشركة المسجل',
  contactPlaceholder: 'الشخص الذي يمكن التواصل معه',
  datePlaceholder: 'اختر تاريخاً',
  availableFromHint: 'متى يمكنك بدء العمل',
  signInWithPhone: 'تسجيل الدخول بالهاتف بدلاً من ذلك',
  changeEmail: 'تغيير البريد',
  pickDate: 'اختر تاريخ التوفر',
  photoHint: 'صورة واضحة للوجه تساعد أصحاب العمل على الوثوق بملفك',
  tapToAddPhoto: 'اضغط لإضافة صورة',
  popularRoles: 'مهن شائعة',
  moreRoles: 'مهن أخرى',
  moreLanguages: 'لغات أخرى',
  home: 'الرئيسية',
  roleConfirmTitle: 'تأكيد نوع الحساب',
  roleConfirmMessage:
    'لا يمكن التبديل بين باحث عن عمل وصاحب عمل من التطبيق. فريق الدعم يمكنه المساعدة إذا اخترت بالخطأ.',
  roleConfirmAction: (role) => `المتابعة كـ ${role}`,
  roleSelectDifferent: 'اختر نوعاً آخر',
  contactUnlocks: 'فتح بيانات التواصل',
  contactUnlocksHint: 'أصحاب العمل الذين فتحوا هاتفك أو واتساب',
  contactUnlocksEmpty: 'لم يفتح أحد بيانات تواصلك بعد. أبقِ ملفك نشطاً.',
  subStep1Title: 'راسلنا على واتساب',
  subStep1Desc: 'اضغط اشترك — نرسل تفاصيل الدفع',
  subStep2Title: 'نؤكد الدفع',
  subStep2Desc: 'عادة خلال ساعة في أيام العمل',
  subStep3Title: 'الخطة نشطة',
  subStep3Desc: 'فتح غير محدود حتى انتهاء الخطة',
  managePlan: 'الخطة',
  errRole: 'اختر المهنة',
  errVisa: 'اختر حالة التأشيرة',
  errNationality: 'أدخل جنسيتك',
  errNationalityPick: 'اختر جنسية من القائمة',
  errLocation: 'اختر الموقع',
  errAvailableFrom: 'اختر تاريخ بدء التوفر',
  errSalary: 'أدخل الراتب الشهري المتوقع',
  errPhone: 'أدخل رقم الهاتف',
  errExperience: 'اختر سنوات الخبرة',
  errLanguages: 'اختر لغة واحدة على الأقل',
  errUae: 'أخبرنا إن عملت في الإمارات',
  errFullName: 'أدخل الاسم الكامل',
  errCompany: 'أدخل اسم الشركة',
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
  subscriptionPending: 'التفعيل قيد الانتظار',
  subscriptionPendingHint:
    'استلمنا رسالتك على واتساب. عادةً يتم تفعيل الخطة خلال ساعة في أيام العمل.',
  activeAgo: (days) =>
    days === 0 ? 'نشط اليوم' : days === 1 ? 'نشط أمس' : days < 7 ? `نشط منذ ${days} أيام` : days < 30 ? `نشط منذ ${Math.floor(days / 7)} أسابيع` : `نشط منذ ${Math.floor(days / 30)} أشهر`,
  tradeLicense: 'رقم الرخصة التجارية',
  tradeLicensePlaceholder: 'رقم الرخصة التجارية (اختياري)',
  tradeLicenseHint: 'اختياري — يساعد المرشحين على الوثوق بنشاطك التجاري.',
  a11ySelected: 'محدد',
  a11yNotSelected: 'غير محدد',
  a11yChipToggle: 'اضغط مرتين للتبديل',
  a11yOpensCandidateProfile: 'يفتح ملف المرشح',
  a11yFilterModal: 'تصفية المرشحين',
  a11yApplyFilters: 'تطبيق الفلاتر',
  a11yResetFilters: 'مسح جميع الفلاتر',
  a11yLoadingList: 'جاري تحميل القائمة',
  a11yManagePlanHint: 'يفتح خطط الاشتراك',
  a11yRefineHint: 'يفتح خيارات التصفية',
  a11yBackHint: 'العودة إلى المهن',
  a11yFieldInvalid: 'يوجد خطأ',
  a11ySelectPlan: 'اضغط مرتين لاختيار هذه الخطة',
  a11ySignInEmail: 'يفتح تسجيل الدخول بالبريد',
  errorLoadList: 'تعذّر تحميل المرشحين. تحقق من الاتصال وحاول مرة أخرى.',
  offlineCachedHint: 'عرض نتائج محفوظة. اسحب للأسفل للتحديث عند عودة الاتصال.',
  retry: 'حاول مرة أخرى',
  loadingMore: 'جاري تحميل المزيد…',
  errorBoundaryTitle: 'حدث خطأ غير متوقع',
  errorBoundaryMessage: 'واجه التطبيق مشكلة. يمكنك المحاولة مرة أخرى.',
  notificationPermissionTitle: 'ابقَ على اطلاع',
  notificationPermissionMessage:
    'تلقّ تنبيهات عند مشاهدة ملفك، فتح بيانات التواصل، أو تفعيل اشتراكك.',
  notificationAllow: 'تفعيل الإشعارات',
  notificationNotNow: 'ليس الآن',
  toastSubscriptionActive: 'خطتك مفعّلة. يمكنك فتح بيانات المرشحين الآن.',
  toastUnlockSuccess: 'تم فتح بيانات التواصل. يمكنك الاتصال أو المراسلة.',
  toastNewUnlock: 'قام صاحب عمل بفتح بيانات تواصلك.',
  toastProfileViewed: 'قام صاحب عمل بمشاهدة ملفك.',
  a11yDismissToast: 'إغلاق التنبيه',
  privacyPolicy: 'سياسة الخصوصية',
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
