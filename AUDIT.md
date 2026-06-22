# Tarteb — Full App Audit Findings

> Source: Codex + Claude Code multi-persona audit  
> Date: 2026-06-22  
> Fix status: P1 Codex done (not pushed) | P2 Codex half done (cut off) | P3–P5 not started

---

## Fix Status Tracker

| Persona | Codex | Claude Code | Fixed? |
|---------|-------|-------------|--------|
| P1 — Frontend/UI | ✓ Done | ✓ Done | Codex fixes done, not pushed |
| P2 — UX Designer | Partial | ✓ Done | Half fixed, cut off |
| P3 — QA/Flow | ✓ Done | ✓ Done | Not started |
| P4 — Backend/API | ✓ Done | ✓ Done | Not started |
| P5 — Device/A11y | ✓ Done | ✓ Done | Not started |

---

## PERSONA 1 — Frontend / UI Developer
*(Animations, Transitions, UI Quality, Performance)*

### Animations & Transitions

**[P1-01] [High]** `mobile/src/features/candidate/presentation/screens/CandidateOnboardingScreen.tsx`  
Step transitions are instant unmount/mount swaps with zero animation. Every "Continue" press produces a jarring blink.

**[P1-02] [High]** `mobile/src/shared/widgets/OtpCodeField.tsx`  
OTP field is a single TextInput with letter-spacing. Not segmented boxes. Looks unpolished and untrustworthy on the first real interaction screen.

**[P1-03] [Medium]** `mobile/src/shared/hooks/usePressScale.ts` + `mobile/src/core/theme/interaction.ts`  
Press scale is 0.97 with bounciness 0. Change is physically imperceptible (1.7px on a 56px button). Buttons feel unresponsive.

**[P1-04] [Medium]** `mobile/src/shared/widgets/OnboardingProgress.tsx`  
Progress bar width snaps instantly — no animation. The primary visual feedback on step advance teleports.

**[P1-05] [Medium]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
`KeyboardAvoidingView` uses `behavior={undefined}` on Android. Keyboard slides over the Send OTP button. Android users cannot see what they're tapping.

**[P1-06] [Medium]** `mobile/src/features/candidate/presentation/components/CandidateOnboardingStep.tsx`  
ScrollView with no KeyboardAvoidingView wrapper. On Step 4, the salary inputs focus and the Continue button is buried under the keyboard.

**[P1-07] [Low]** `mobile/src/shared/widgets/SkeletonBlock.tsx`  
Shimmer is a plain opacity pulse, not a directional gradient sweep. Looks like flickering, not loading.

### UI / Visual Quality

**[P1-08] [High]** `mobile/src/features/employer/presentation/components/CandidateBrowseCard.tsx` + `CandidateDashboardScreen.tsx` + `CandidateDetailScreen.tsx`  
Raw `<Image>` with no defaultSource, no placeholder, no error fallback. Photos flash blank before loading on every screen.

**[P1-09] [High]** `mobile/src/shared/widgets/SelectableChip.tsx`  
Dense chip variant: 32px height. Violates Apple 44pt and Google 48dp touch target minimums. Used in language grids.

**[P1-10] [High]** `mobile/src/features/app/presentation/screens/SplashScreen.tsx`  
Splash screen is a plain ActivityIndicator on a gray background. No logo, no branding, no animation. Shown on every cold launch.

**[P1-11] [Medium]** `mobile/src/features/employer/presentation/components/CandidateBrowseCard.tsx`  
Chevron is a Unicode guillemet character (`‹`/`›`). Renders inconsistently across Samsung, Xiaomi, OPPO — common UAE devices.

**[P1-12] [Medium]** `mobile/src/shared/widgets/Screen.tsx`  
`SafeAreaView` omits `'bottom'` edge. Content underflows behind home indicator on modern iPhones (34pt gap, only 32px padding).

**[P1-13] [Medium]** `mobile/src/features/employer/presentation/screens/RefineFiltersModal.tsx`  
Modal footer has no keyboard avoidance. Salary inputs focus → Apply button becomes invisible and unreachable.

**[P1-14] [Medium]** `mobile/src/shared/widgets/JobRoleGrid.tsx`  
Category chips: ~32px height, no minimum touch target. Primary filter navigation in job role picker.

**[P1-15] [Low]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
Photo placeholder (88x88) has icon + text competing for space. Looks like overflow, not intentional design.

### Performance

**[P1-16] [High]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
`useFocusEffect` fires 4 sequential Supabase calls (getUser, select candidates, select unlocks, update last_active_at) on every tab focus. `loading` is in the dependency array, creating a potential double-fetch loop.

**[P1-17] [High]** `mobile/src/features/employer/presentation/screens/BrowseScreen.tsx`  
`loadEmployerProfile` fires a raw uncached `select('*')` query on every Browse tab mount, separate from React Query.

**[P1-18] [High]** `mobile/src/shared/widgets/JobRoleGrid.tsx`  
All matching roles rendered with `.map()` inside a plain View — no FlatList/FlashList. 30–80 roles mounted simultaneously. Visible jank on mid-range Android.

**[P1-19] [Medium]** `mobile/src/shared/widgets/JobRoleGrid.tsx`  
`HorizontalChipScroller` stores scroll offset in `useState`, triggering ~30 re-renders/second during horizontal scroll.

**[P1-20] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
`last_active_at` database write fires on every tab focus, not once per session. Unnecessary write traffic + added latency.

**[P1-21] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
`toggleActive` not wrapped in `useCallback`. New function reference on every render, causing Switch to re-render unnecessarily.

**[P1-22] [Medium]** `mobile/src/features/employer/presentation/screens/EmployerShellScreen.tsx` + `CandidateShellScreen.tsx`  
`openEditCompany` / `openEditProfile` defined without `useCallback`. New references on every render defeat SettingsPanel memoization.

**[P1-23] [Low]** `mobile/src/features/employer/presentation/components/CandidateBrowseCard.tsx` + `CandidateDashboardScreen.tsx` + `CandidateDetailScreen.tsx`  
Standard React Native `<Image>` with no disk cache policy. Photos re-fetched on every remount. `expo-image` not used anywhere.

---

## PERSONA 2 — Mobile UX Designer
*(Loading States, Error States, Empty States, Navigation & Flow Logic)*

### Loading & Async States

**[P2-01] [High]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
`toggleActive` has no optimistic update. Switch visually snaps back to old value while request is in flight. Users think toggle failed and tap again — doubling the action.

**[P2-02] [High]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Loading state is a raw `<Text>{t.loading}</Text>` — plain string on blank white screen. Looks broken, not loading.

**[P2-03] [High]** `mobile/src/features/employer/presentation/screens/EmployerShellScreen.tsx`  
`openEditCompany` is async with no loading state, no spinner, no disabled state during fetch. Silently returns if no row found. Looks like tapping "Edit" does nothing.

**[P2-04] [Medium]** `mobile/src/features/employer/presentation/screens/RolePickerView.tsx`  
Role counts show 0 while query is pending. No skeleton, no shimmer. Employers think platform has no candidates.

**[P2-05] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
`useFocusEffect` triggers silent background refetch with no `isRefetching` indicator. User edits profile, returns to dashboard, sees stale data with no indication it's refreshing.

**[P2-06] [Medium]** `mobile/src/features/app/presentation/screens/SplashScreen.tsx`  
No timeout on splash. 3 sequential Supabase calls — hangs indefinitely on poor connection. Users on airplane mode see spinner forever with no way out except killing the app.

**[P2-07] [Medium]** `mobile/src/features/employer/presentation/screens/CandidateDetailScreen.tsx`  
Loading state not inside `<Screen>` — no SafeAreaView. Loading spinner renders under status bar on notched iPhones.

**[P2-08] [High]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
Profile activation/pausing/hired status updates have no visible in-progress state. Users can repeatedly trigger same action.

**[P2-09] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
Focus refresh errors shown as blocking native alerts. Returning offline repeatedly interrupts user with modal alerts instead of showing stale screen.

### Error States

**[P2-10] [Critical]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
After loading fails, `if (!candidate) return null` renders a completely blank screen. No retry, no error message, no navigation out. User must kill the app.

**[P2-11] [High]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
Wrong OTP shows `t.errorGeneric` ("Something went wrong") instead of "Wrong code". Users think it's a system failure, not a typo.

**[P2-12] [High]** `mobile/src/features/employer/presentation/screens/EmployerShellScreen.tsx`  
`logout` has no try/catch around `supabase.auth.signOut()`. Logout silently fails on network error. User thinks they're logged out but aren't.

**[P2-13] [High]** `mobile/src/features/candidate/presentation/screens/onboarding/Step4Finish.tsx`  
Prerequisite error (missing photo) tells user to go back to Step 1 but provides no navigation button. They must press Back four times manually.

**[P2-14] [High]** `mobile/src/features/candidate/presentation/screens/CandidateDetailScreen.tsx` (candidate-facing)  
`goBack` fallback has no error handling. On `fetchAccountRole` failure, back button does nothing. User trapped on screen.

**[P2-15] [High]** `mobile/src/features/employer/presentation/screens/onboarding/EmployerStep2Contact.tsx`  
Missing userId causes silent `return` after `setLoading(true)`. Button spinner stays active forever — form permanently locked.

**[P2-16] [Medium]** `mobile/src/features/employer/data/services/candidateBrowse.ts`  
`useRoleCounts` errors silently dropped — calling component ignores `error`. 0 counts are indistinguishable from a genuine empty marketplace.

**[P2-17] [Medium]** `mobile/src/features/employer/presentation/screens/BrowseScreen.tsx`  
`loadEmployerProfile` errors swallowed with `console.warn`. Profile completion card disappears silently.

**[P2-18] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
Unlock count query error not checked. `unlockRows` can be null, shows "0 unlocks" as if real data.

**[P2-19] [High]** `mobile/src/features/employer/data/services/unlocks.ts`  
Unlocked candidates loaded through `candidate_browse` which only includes active candidates. When candidate pauses/gets hired, they disappear from employer's My Unlocks — including contact details.

**[P2-20] [Medium]** `mobile/src/features/employer/presentation/screens/MyUnlocksScreen.tsx`  
Refresh errors only visible via `ListEmptyComponent`. Existing data stays on screen with no indication sync failed.

**[P2-21] [Medium]** `mobile/src/features/employer/domain/candidateUnlock.ts`  
Unlock-status query failure returns `false` — previously unlocked candidates appear locked, inviting a second unlock attempt.

**[P2-22] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Load failure shows alert then immediately navigates away. No persistent error state or retry.

**[P2-23] [High]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Unavailable user ID after load → renders loading message indefinitely. User trapped on permanent loading screen.

**[P2-24] [Medium]** `mobile/src/shared/widgets/SettingsPanel.tsx`  
Only initial profile query has error handling. Account names, phone, edit controls silently disappear.

**[P2-25] [Medium]** `mobile/src/features/settings/presentation/screens/SettingsScreen.tsx`  
Edit profile fetch has no loading state and ignores errors. Tapping "Edit profile" appears to do nothing.

**[P2-26] [High]** `mobile/src/features/employer/presentation/screens/CandidateDetailScreen.tsx`  
Error-state Back button calls `navigation.goBack()` directly instead of fallback-aware goBack logic. Cold deep link → back button does nothing.

**[P2-27] [Medium]** `mobile/src/shared/utils/errors.ts`  
Raw Supabase/network error messages returned as user-facing copy. Users see technical, untranslated error strings.

**[P2-28] [Medium]** `mobile/src/core/providers/ToastProvider.tsx`  
Toasts positioned above safe-area only, not above tab bar. Toast messages and actions overlap tab navigation.

### Empty States

**[P2-29] [High]** `mobile/src/features/employer/presentation/screens/BrowseScreen.tsx`  
Empty state CTA says "Refine" when role has zero candidates. Tells user to add more filters to an already empty pool. Counterproductive.

**[P2-30] [Medium]** `mobile/src/features/employer/presentation/screens/RolePickerView.tsx`  
No empty state for zero candidates across all roles (early marketplace). Employers see all roles at 0 and assume the product is dead.

**[P2-31] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Empty state is passive italic text with no visual affordance pointing to the role grid below the fold.

### Navigation & Flow Logic

**[P2-32] [Critical]** `mobile/src/core/navigation/authNavigation.ts`  
`routeAuthenticatedUser` clears `pendingRole` before recursing. If second invocation fails, user is routed to RoleSelection despite having already chosen a role.

**[P2-33] [High]** `mobile/src/features/auth/presentation/screens/RoleSelectionScreen.tsx`  
Expired/malformed session with active `hasSession` → `setPendingAccountRole` + replace to PhoneOtp. User re-verifies, may use different number, creating a second account.

**[P2-34] [High]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
Missing candidate row navigates to CandidateOnboarding inside `useFocusEffect`. On every focus, this can fire again — navigation loop.

**[P2-35] [High]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Null/empty `role` field silently calls `navigation.replace('CandidateOnboarding')`. User ejected from authenticated flow with no explanation.

**[P2-36] [High]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
No back button. Users who picked wrong role in RoleSelection cannot correct it. Must kill the app.

**[P2-37] [High]** `mobile/src/features/employer/presentation/screens/onboarding/EmployerStep2Contact.tsx`  
Edit mode calls `navigation.goBack()` after save. Settings tab has no data refresh on focus. User sees old data — thinks save failed.

**[P2-38] [Medium]** `mobile/src/core/navigation/RootNavigator.tsx`  
`flushPendingDeepLink` fires once on `onReady`. If Splash fails and user retries successfully, deep link is silently dropped.

**[P2-39] [Medium]** `mobile/src/features/candidate/presentation/screens/onboarding/Step3Location.tsx`  
Candidates get no hint text explaining why area selection is required (employers do get hint text). Validation error appears with no guidance.

**[P2-40] [Low]** `mobile/src/core/providers/ToastProvider.tsx`  
Single-toast architecture with no queue. New toast immediately replaces existing one. Unlock confirmation can be overwritten by a subsequent action.

**[P2-41] [High]** `mobile/src/core/providers/AuthProvider.tsx`  
Session expiry not connected to navigation guards. Protected screens stay mounted until individual API calls fail unpredictably.

**[P2-42] [High]** `mobile/src/core/navigation/RootNavigator.tsx`  
All screens registered without route-level auth or role guards. Invalid state, deep-link races, and expired sessions can expose wrong screens.

**[P2-43] [High]** `mobile/src/core/navigation/deepLink.ts`  
Pending deep links not resumed after successful authentication. Sign-out user completes login and lands on default home instead of intended destination.

**[P2-44] [High]** `mobile/src/core/navigation/deepLinkRole.ts`  
Profile-query error and unauthenticated state both return null. Temporary network failure resets authenticated user to phone-login screen.

**[P2-45] [Medium]** `mobile/src/core/navigation/deepLink.ts`  
Deep links for opposite role silently redirect to default home tab. No explanation to user.

**[P2-46] [Medium]** `mobile/src/core/providers/PushNotificationsProvider.tsx`  
Initial URLs processed manually AND by NavigationContainer. Cold-start links can be parsed twice — duplicate navigation or destination flicker.

**[P2-47] [Medium]** `mobile/src/features/auth/presentation/screens/RoleSelectionScreen.tsx`  
`hasSession` starts false and populates async but role controls are immediately active. Authenticated user can re-enter OTP flow unnecessarily.

**[P2-48] [High]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
Successful auth triggers routing twice: auth-state effect + `finishAuth`. Competing navigation resets → loading flicker, inconsistent destination.

**[P2-49] [High]** `mobile/src/features/auth/presentation/screens/EmailOtpScreen.tsx`  
Same double-routing race as PhoneOtpScreen.

**[P2-50] [Medium]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
Switching between phone/email auth uses `navigate` both ways. Repeated switching stacks duplicate auth screens in history.

---

## PERSONA 3 — QA / Flow Tester
*(Auth, Onboarding, Dashboard, Browse, Unlock, Settings — all flows)*

### Auth Flow

**[P3-01] [High]** `mobile/src/features/auth/data/services/twilioVerify.ts`  
Successful Twilio verification creates a new anonymous Supabase user with no server-side binding to the verified phone. Clients can call anonymous sign-in directly, bypassing OTP entirely. Reinstall or device change = new account, lost profile.

**[P3-02] [High]** `mobile/src/features/auth/presentation/screens/EmailOtpScreen.tsx`  
Email auth is exposed despite phone-only account model. Email and phone sign-in create unrelated Supabase identities. Duplicate accounts.

**[P3-03] [Medium]** `mobile/src/features/auth/data/services/twilioVerify.ts`  
Phone UI shows many countries but `sendOtp` only accepts `+971`. Users select India, Pakistan, Bangladesh — hit unavoidable validation failure.

**[P3-04] [Medium]** `mobile/src/features/auth/data/services/twilioVerify.ts`  
For new accounts, verified phone only written to profile if profile already exists. Profile created later during role routing. New users have no phone stored in Settings.

**[P3-05] [Medium]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
No OTP resend cooldown or retry timer. Users can spam Twilio requests → rate-limit failures, confusion, unnecessary SMS cost.

### Candidate Onboarding

**[P3-06] [High]** `mobile/src/features/candidate/presentation/screens/CandidateOnboardingScreen.tsx`  
Hardware Back / Android Back during onboarding exits the entire flow instead of going to previous step. Loss of all entered data.

**[P3-07] [Medium]** `mobile/src/features/candidate/providers/CandidateOnboardingContext.tsx`  
Draft loads asynchronously after form is already interactive. Loaded draft unconditionally replaces current state. Input typed immediately disappears when draft hydrates.

**[P3-08] [Medium]** `mobile/src/features/candidate/providers/CandidateOnboardingContext.tsx`  
`setStep` saves state captured before recent updates, canceling pending save with newer data. Resumed draft can miss values entered just before pressing Continue.

**[P3-09] [Medium]** `mobile/src/features/candidate/providers/CandidateOnboardingContext.tsx`  
Discarding draft does not cancel pending save timer. Discarded draft silently recreated with old data.

**[P3-10] [Medium]** `mobile/src/features/candidate/data/services/onboardingDraft.ts`  
Draft uses one device-wide storage key with no user identifier, not cleared on logout. Next user on same device sees previous candidate's personal data.

**[P3-11] [Low]** `mobile/src/features/candidate/data/services/onboardingDraft.ts`  
Draft read/save/delete failures all suppressed. "Draft saved" shown even when nothing persisted.

**[P3-12] [Medium]** `mobile/src/features/candidate/presentation/screens/onboarding/Step4SalaryVisa.tsx`  
Salary validation uses falsy check — rejects zero. Unemployed candidates cannot complete onboarding with AED 0 current salary.

**[P3-13] [Medium]** `mobile/src/features/candidate/presentation/screens/onboarding/Step3Location.tsx`  
Verified auth phone not loaded into onboarding. Candidates can publish unrelated unverified number. Employers unlock a contact that may be wrong or unowned.

### Employer Onboarding

**[P3-14] [High]** `mobile/src/features/employer/presentation/screens/EmployerOnboardingScreen.tsx`  
Hardware Back on step 2 exits entire employer onboarding flow. No draft persistence — all data lost.

**[P3-15] [High]** `mobile/src/features/employer/presentation/screens/onboarding/EmployerStep2Contact.tsx`  
After first-time onboarding, `navigation.replace('EmployerShell')` leaves RoleSelection underneath in the stack. Back from employer app returns user to role selection.

**[P3-16] [Medium]** `mobile/src/features/employer/presentation/screens/onboarding/EmployerStep1Company.tsx`  
Missing session → silent return. Continue button appears busy then does nothing.

**[P3-17] [Medium]** `mobile/src/features/employer/presentation/screens/onboarding/EmployerStep2Contact.tsx`  
Missing user ID → silent return. Final onboarding button becomes inert with no message.

**[P3-18] [Medium]** `mobile/src/features/employer/domain/schemas/employerProfile.ts`  
Email validation only checks minimum length and contains `@`. `a@b` accepted as valid employer contact.

### Browse & Search

**[P3-19] [Medium]** `mobile/src/features/employer/data/services/candidateBrowse.ts`  
"Available now" filter uses `available_from <= today`. Null dates excluded — but schema defines null as immediate/unspecified availability. Available candidates hidden.

**[P3-20] [Medium]** `mobile/src/features/employer/presentation/screens/RefineFiltersModal.tsx`  
Salary min/max not validated against each other. Impossible ranges produce unexplained empty results.

**[P3-21] [Medium]** `mobile/src/features/employer/data/services/candidateBrowse.ts`  
Salary filter capped at AED 10,000. Candidate profiles allow up to AED 1,000,000. Employers cannot search above 10K.

### Unlock Flow

**[P3-22] [High]** `mobile/src/features/employer/data/services/unlocks.ts`  
My Unlocks loads through `candidate_browse` — active candidates only. When candidate pauses or gets hired, employer loses the unlocked contact permanently.

**[P3-23] [High]** `supabase/migrations/20260604800000_free_unlocks_no_subscription.sql`  
Unlock function ignores `credits_balance`, subscription state, and monthly limits. Every employer has unlimited free unlocks. Business model does not exist in production.

### Settings

**[P3-24] [Medium]** `mobile/src/shared/widgets/SettingsPanel.tsx`  
No account deletion action. Privacy policy tells users to request deletion externally.

**[P3-25] [Low]** `mobile/src/shared/widgets/DateField.tsx`  
Once availability date is selected, no way to clear it. Candidates editing profile cannot return to valid blank state.

---

## PERSONA 4 — Backend / API Engineer
*(Supabase, RLS, Edge Functions, API errors, data integrity)*

### Security — Critical

**[P4-01] [High]** `supabase/migrations/20260530000000_initial_schema.sql`  
Employer SELECT policy on `candidates` grants access to full rows. RLS cannot hide columns. Employers can bypass `candidate_browse` and read phone, WhatsApp, salary, CV paths directly — no unlock required.

**[P4-02] [High]** `supabase/migrations/20260530000000_initial_schema.sql`  
Employer INSERT policy on `unlocks` is active. Employers can insert directly, bypassing `unlock_candidate` — no credits, subscription, or monthly-limit enforcement.

**[P4-03] [High]** `supabase/migrations/20260530000000_initial_schema.sql`  
Users can UPDATE their own `profiles.role`. A candidate can self-promote to employer and gain employer-level access to all candidate data.

**[P4-04] [High]** `supabase/migrations/20260602400000_tiered_pricing.sql`  
`activate_employer_subscription` is SECURITY DEFINER with no EXECUTE revocation from PUBLIC and no caller auth check. Anyone can activate/extend any employer's subscription at any tier.

**[P4-05] [High]** `supabase/migrations/20260530000000_initial_schema.sql`  
`add_employer_credits` is SECURITY DEFINER, publicly executable, accepts caller-controlled credit amount, no caller auth. Anyone can give any employer arbitrary credits.

**[P4-06] [High]** `supabase/functions/notify-candidate/index.ts`  
Uses service-role key but never validates that caller is an employer, legitimately viewed the candidate, or owns the referenced unlock. Any authenticated user can send fraudulent notifications and inflate profile view counts.

**[P4-07] [High]** `supabase/functions/candidate-reengagement/index.ts`  
No auth check on mass-notification function. Any authenticated user can trigger platform-wide push campaigns.

**[P4-08] [High]** `supabase/functions/send-otp/index.ts`  
No rate limit, no per-phone cooldown, no CAPTCHA, no UAE-only validation. Attackers can generate large Twilio bills and harass any phone number globally.

**[P4-09] [High]** `mobile/src/features/employer/data/services/browseCache.ts`  
Browse cache keyed only by filters — not by user, not cleared on logout. Contains unlocked phone, WhatsApp, salary, CV paths. Next account on same device receives previous employer's unlocked private data.

**[P4-10] [High]** `mobile/App.tsx`  
Global React Query cache survives logout. Query keys do not include user ID. Candidate details, unlock status, unlocked contacts leak between accounts in same app process.

**[P4-11] [High]** `mobile/src/features/auth/data/services/twilioVerify.ts`  
Phone OTP bypassed: successful Twilio verify calls anonymous Supabase sign-in with no server-side phone binding. Any client can call anonymous sign-in directly.

**[P4-12] [High]** `mobile/src/features/auth/data/services/twilioVerify.ts`  
Every phone login creates a new anonymous user instead of finding existing phone owner. Phone stored as editable metadata only. `updateUser` error ignored. Returning users get duplicate accounts.

**[P4-13] [High]** `supabase/migrations/20260604600000_profile_view_count.sql`  
`increment_candidate_profile_view` is publicly executable SECURITY DEFINER with no caller auth. Anyone can inflate any candidate's view count arbitrarily.

### Data Integrity

**[P4-14] [Medium]** `mobile/src/features/candidate/presentation/components/CandidateCvSection.tsx`  
CV replacement deletes existing file before updating database reference. If database update fails, old reference points to deleted file. New upload is an orphan.

**[P4-15] [Medium]** `mobile/src/shared/services/candidateCv.ts`  
Client accepts CVs up to 8MB. `supabase/config.toml` limits storage to 5MB. Files 5–8MB pass client validation then consistently fail on upload.

**[P4-16] [Medium]** `mobile/src/features/employer/data/services/candidateBrowse.ts`  
Role counts download all matching candidate role arrays and count client-side. Incorrect beyond API row cap. Grows increasingly wasteful at scale.

**[P4-17] [Medium]** `supabase/functions/candidate-reengagement/index.ts`  
`no_views` job selects candidates without recent unlocks — not without views. Views and unlocks are different events. Wrong candidates notified.

### Error Handling & Reliability

**[P4-18] [Medium]** `mobile/src/core/lib/supabase.ts`  
Supabase client has no request timeout or abort behavior on any call type. Requests hang indefinitely on weak/captive networks.

**[P4-19] [Medium]** `mobile/src/features/candidate/data/services/candidatePhoto.ts`  
XHR photo upload has no timeout or abort handler. Stalled upload leaves onboarding permanently loading with no recovery.

**[P4-20] [Medium]** `supabase/functions/candidate-reengagement/index.ts`  
Sequential processing — one DB query and one HTTP request per candidate. Query and push errors ignored. `sent` incremented regardless of delivery success. Slow at scale, reports fabricated totals.

**[P4-21] [Medium]** `supabase/functions/notify-candidate/index.ts`  
DB errors and Expo response status not checked. Returns `sent: true` after any parseable Expo response including rejected push tickets.

**[P4-22] [Medium]** `mobile/src/core/services/notifications.ts`  
`registerPushToken` returns `true` unconditionally after push-token DB update, even if update failed.

**[P4-23] [Medium]** `supabase/functions/verify-otp/index.ts`  
Phone numbers and OTP codes written to logs. Response returns `debugPhone` containing complete OTP code. Raw Twilio error details returned to clients.

---

## PERSONA 5 — Device & Accessibility QA
*(iOS/Android, Screen Sizes, Font Scaling, Contrast, Touch Targets)*

### Safe Area & Layout

**[P5-01] [High]** `mobile/src/features/candidate/presentation/screens/CandidateOnboardingStep.tsx`  
Fixed footer + ScrollView + no keyboard avoidance. On iOS, keyboard covers footer buttons and lower fields. Users cannot continue or go back.

**[P5-02] [High]** `mobile/src/features/employer/presentation/components/EmployerOnboardingStep.tsx`  
Same issue. Contact fields and submission controls obscured by iOS keyboard.

**[P5-03] [High]** `mobile/src/features/employer/presentation/screens/RefineFiltersModal.tsx`  
Number-pad fields + fixed footer + no keyboard avoidance. Number pad has no Done key on iOS. Apply and Reset unreachable.

**[P5-04] [High]** `mobile/src/features/candidate/presentation/screens/onboarding/Step4SalaryVisa.tsx`  
Both salary fields use `number-pad` (no dismiss key on iOS) inside keyboard-unaware layout. Users trapped behind keyboard, cannot press Continue.

**[P5-05] [High]** `mobile/src/shared/widgets/TabScreenLayout.tsx`  
Shared tab layout has no top safe-area handling. Headers and controls render beneath status bars, notches, and camera cutouts.

**[P5-06] [High]** `mobile/src/features/employer/presentation/screens/BrowseScreen.tsx`  
No top safe area. Role picker, back control, and candidate heading overlap status bar content.

**[P5-07] [High]** `mobile/src/features/employer/presentation/screens/MyUnlocksScreen.tsx`  
No top safe area despite hiding native navigation header. Title positioned incorrectly on notched/cutout devices.

**[P5-08] [High]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Neither `<Screen>` nor `<SafeAreaView>` around header. Back button and title appear under status bar.

**[P5-09] [Medium]** `mobile/src/shared/widgets/DateField.tsx`  
iOS date spinner closes immediately on every `onChange` event. Selecting a date is abrupt and error-prone.

### Font Scaling & Accessibility

**[P5-10] [High]** `mobile/src/shared/constants/listPerf.ts`  
`getItemLayout` declares fixed 85px row height for variable-height content. Fast scroll jumps to wrong offsets, overlaps rows, shows blank space. Worse with large text on Android.

**[P5-11] [High]** `mobile/src/shared/widgets/PrimaryButton.tsx`  
Button text capped at 1.3× scaling, auto-shrunk to 85%. Large-text users receive smaller, less-readable primary action labels.

**[P5-12] [High]** `mobile/src/shared/widgets/SecondaryButton.tsx`  
Same scaling cap. Back, Cancel, and navigation actions don't respect accessibility text settings.

**[P5-13] [High]** `mobile/src/shared/widgets/FieldLabel.tsx`  
Every form label capped at 1.3× scaling, 2 lines max. Long translated labels truncated for low-vision users.

**[P5-14] [High]** `mobile/src/shared/widgets/FieldError.tsx`  
Validation messages capped at 1.3×, 4 lines. Users with large text may miss end of error instructions.

**[P5-15] [High]** `mobile/src/shared/widgets/ConfirmDialog.tsx`  
Dialog content capped at 1.2–1.3× scaling, fixed line counts, not scrollable. Large-text users receive truncated warning/confirmation content.

**[P5-16] [High]** `mobile/src/shared/widgets/SelectableChip.tsx`  
32–36px minimum height, text scaling capped at 1.25×. Language and experience selections difficult to tap and read for low-vision/dexterity users.

**[P5-17] [Medium]** `mobile/src/shared/widgets/LanguageSelectList.tsx`  
40px minimum row height. Below 44/48px standard. Wrong language selections common on small screens.

**[P5-18] [Medium]** `mobile/src/shared/widgets/JobRoleGrid.tsx`  
Category chips: no 44px minimum height, only 7px vertical padding. Heavily-used filter controls with narrow targets on 360px devices.

**[P5-19] [Medium]** `mobile/src/features/employer/presentation/screens/BrowseScreen.tsx`  
Refine filter pill: no minimum touch height, 8px padding around 13px text. Primary filtering control below accessible size.

**[P5-20] [Medium]** `mobile/src/features/auth/presentation/screens/PhoneOtpScreen.tsx`  
Email sign-in and resend controls: text-only pressables with no minimum height. Authentication actions difficult to hit on small screens.

**[P5-21] [Medium]** `mobile/src/features/candidate/presentation/components/OnboardingDraftBanner.tsx`  
Discard action: 12px text, no padding, no minimum size, no hit slop. Easily missed.

**[P5-22] [Medium]** `mobile/src/features/candidate/presentation/screens/CandidateAdditionalRolesScreen.tsx`  
Role removal: small × glyph with only 6px hit slop. Unreliable for large fingers or motor impairments.

**[P5-23] [Medium]** `mobile/src/shared/widgets/ToastBanner.tsx`  
Toast action buttons: 36px minimum height. Time-limited actions (e.g., open unlocked candidate) difficult to activate before toast disappears.

### Color Contrast

**[P5-24] [High]** `mobile/src/core/theme/colors.ts`  
Primary blue on white: ~4.41:1 (WCAG minimum is 4.5:1). Error red: ~3.76:1. Placeholder gray: ~2.54:1. Success green: ~2.24:1. All fail WCAG AA.

**[P5-25] [High]** `mobile/src/features/candidate/presentation/screens/CandidateDashboardScreen.tsx`  
Warning text on warning tint: ~2.07:1. Hired-status green on tint: ~2.04:1. Critical profile-paused and hired messages unreadable outdoors or for low-vision users.

**[P5-26] [High]** `mobile/src/features/employer/presentation/components/CandidateBrowseCard.tsx`  
Unlocked badges and fresh-activity text use failing success green at 11px font size. Employers may not distinguish unlocked candidates.

**[P5-27] [Medium]** `mobile/src/shared/widgets/SettingsPanel.tsx`  
Placeholder gray (~2.54:1) used for real informational content — account notices and RTL guidance.

**[P5-28] [Medium]** `mobile/src/shared/widgets/ProfileFactRow.tsx`  
Labels restricted to 1 line and 42% of row width. Values limited to 2 lines. Candidate details truncated under large text + long translations.

**[P5-29] [Medium]** `mobile/src/features/auth/presentation/components/RoleVisualCard.tsx`  
Fixed square side-by-side containers with fixed 72px icon, fixed 20px title line-height, 2-line limit. Labels clip on 360px screens with large text.

### Arabic / i18n

**[P5-30] [High]** `mobile/src/core/i18n/LocaleContext.tsx`  
`ARABIC_ENABLED = false`. Saved Arabic preferences forced back to English. RTL disabled globally. Advertised bilingual/RTL experience unavailable.

**[P5-31] [High]** `mobile/src/shared/constants/candidate.ts`  
Every Arabic role-category label stored as corrupted mojibake (`╪º┘ä...`). Enabling Arabic would display unreadable garbage throughout role selection and filtering.

### Testing Coverage

**[P5-32] [High]** `mobile/package.json`  
End-to-end tests run through Playwright only. No native iOS/Android physical-device test framework. Permission dialogs, native keyboards, safe areas, date pickers, OEM variations, and font-scaling failures not covered.

---

## Summary Count

| Persona | Critical | High | Medium | Low | Total |
|---------|----------|------|--------|-----|-------|
| P1 — Frontend/UI | 0 | 6 | 12 | 5 | 23 |
| P2 — UX Designer | 2 | 18 | 15 | 3 | 38 |
| P3 — QA/Flow | 0 | 7 | 15 | 3 | 25 |
| P4 — Backend/API | 0 | 13 | 10 | 0 | 23 |
| P5 — Device/A11y | 0 | 18 | 12 | 0 | 30 |
| **Total** | **2** | **62** | **64** | **11** | **139** |

---

*Next step: PM triage — group by theme, eliminate duplicates, order by fix priority.*

---

---

# Claude Code Findings

> Note: Some findings overlap with Codex. Overlaps are marked [OVERLAP] and confirm priority. Unique findings are marked [UNIQUE].

---

## SECURITY — Critical (Claude Code)

**[CC-S01] [High] [OVERLAP with P4-01, P4-11]** `supabase/functions/send-otp/index.ts`  
No authentication check on Edge Function. Any unauthenticated caller can trigger Twilio SMS to any E.164 number. No IP rate limiting, no per-phone throttle. Attackers can spam UAE numbers at Tarteb's Twilio cost.

**[CC-S02] [High] [UNIQUE]** `supabase/functions/verify-otp/index.ts:68`  
Response unconditionally returns `debugPhone` field containing the literal Twilio request payload including the OTP code itself. Also logged to console on line 48. OTP codes in plaintext in server logs and client responses. Violates UAE PDPL.

**[CC-S03] [High] [OVERLAP with P4-06]** `supabase/functions/notify-candidate/index.ts`  
No authentication or authorization check. Any unauthenticated HTTP client can POST `{ candidate_id: "<any-uuid>", event: "viewed" }` and trigger: (1) profile view count increment, (2) push notification to candidate. Spam and metric manipulation vector.

**[CC-S04] [High] [OVERLAP with P4-07]** `supabase/functions/candidate-reengagement/index.ts`  
Accepts any HTTP request, authenticated or not. Any external caller can trigger bulk push to every active candidate.

**[CC-S05] [High] [OVERLAP with P4-11, P3-01]** `mobile/src/features/auth/data/services/twilioVerify.ts:56–78`  
`signInWithVerifiedPhone` calls `supabase.auth.signInAnonymously()` — the OTP check is client-enforced only. Any caller invoking `signInWithVerifiedPhone` directly without `verifyOtp` gets a fully authenticated session for any phone number. Module-level `otpSessionPhoneE164` is process-global state — race between two concurrent flows could cross-validate.

**[CC-S06] [High] [UNIQUE]** `supabase/functions/verify-otp/index.ts:30–35`  
`OTP_BYPASS_ENABLED=true` returns `{ approved: true }` for any phone, any code, with no production guard. Server-side bypass is independently controlled from the mobile app's `env.skipOtpVerification`. If accidentally set in production, anyone authenticates as anyone.

**[CC-S07] [High] [OVERLAP with P4-02, P4-03]** `supabase/migrations/20260530000000_initial_schema.sql`  
Three RLS violations confirmed:
- Employer SELECT on `candidates` exposes full rows including phone, WhatsApp, salary, CV paths without unlock
- Employer INSERT on `unlocks` active — bypasses `unlock_candidate`, no credits/subscription check
- Users can UPDATE their own `profiles.role` — self-promote from candidate to employer

**[CC-S08] [High] [OVERLAP with P4-04, P4-05]** `supabase/migrations/`  
- `activate_employer_subscription`: SECURITY DEFINER, no EXECUTE revoke, no caller auth — anyone can activate/extend any subscription
- `add_employer_credits`: SECURITY DEFINER, publicly executable, caller-controlled amount — anyone manufactures credits

**[CC-S09] [High] [OVERLAP with P4-13]** `supabase/migrations/20260604600000_profile_view_count.sql`  
`increment_candidate_profile_view` is SECURITY DEFINER, EXECUTE granted to PUBLIC. Any authenticated user inflates any candidate's view count.

---

## DATA LEAKAGE & INTEGRITY (Claude Code)

**[CC-D01] [High] [UNIQUE]** `supabase/functions/send-otp/index.ts:35`  
`console.log('Send payload:', debugPhone)` logs recipient phone on every OTP send. Supabase logs retained and queryable. Every login attempt phone number stored in plaintext. UAE PDPL compliance failure.

**[CC-D02] [High] [UNIQUE]** `mobile/src/features/auth/data/services/twilioVerify.ts:64`  
`supabase.auth.updateUser({ data: { phone: e164 } })` result completely discarded. If this call fails, user is authenticated with no phone stored. Silent corruption of auth user record.

**[CC-D03] [High] [UNIQUE]** `supabase/migrations/20260605000000_qa_candidate_contact_backfill.sql`  
Production migration unconditionally backfills `phone = '+971501234567'` and `whatsapp = '+971501234567'` (hardcoded test number) on every active candidate with no contact. Real candidates who chose not to provide contact now have a fake test number. Employers who unlock get test number, not silence.

**[CC-D04] [Medium] [OVERLAP with P4-09]** `mobile/src/features/employer/data/services/browseCache.ts`  
Offline browse cache writes candidate records including unlocked phone/WhatsApp to AsyncStorage in plaintext JSON. Android AsyncStorage is unencrypted. Accessible to other apps or via ADB on rooted device.

---

## EFFICIENCY & SCALABILITY (Claude Code)

**[CC-E01] [High] [UNIQUE]** `supabase/migrations/20260622144417_preserve_inactive_unlocked_candidates.sql`  
`candidate_browse` view runs 4–5 correlated `EXISTS` subqueries per row to check unlock status. 20-candidate page = up to 100 subqueries. Not cacheable because they reference `auth.uid()`. Browse performance degrades linearly. Should be a single LEFT JOIN.

**[CC-E02] [High] [OVERLAP with P4-16]** `mobile/src/features/employer/data/services/candidateBrowse.ts:60–80`  
`fetchRoleCounts()` queries `SELECT role, additional_roles FROM candidates WHERE is_active = true` with no LIMIT. Transfers every active candidate's role data to mobile client for client-side counting. 10,000 candidates = 10,000 rows over the network for what should be a single GROUP BY aggregate.

**[CC-E03] [High] [OVERLAP with P4-20]** `supabase/functions/candidate-reengagement/index.ts:105–126`  
Sends push notifications in serial loop — one at a time — with separate DB query per candidate inside the loop. 1,000 candidates = 1,000 sequential DB round-trips + 1,000 sequential Expo HTTP calls. Function times out at 150s. No error handling per iteration. N+1 pattern entirely avoidable with a single JOIN query.

---

## LOGIC & CORRECTNESS (Claude Code)

**[CC-L01] [Medium] [UNIQUE]** `mobile/src/features/employer/data/services/candidateDetail.ts:32–37` + `candidateUnlock.ts:9–18`  
`useEmployerUnlockStatus` queries `unlocks` table directly — redundant, `candidate_browse` already returns `is_unlocked`. Two network calls where one suffices. The two sources can also return conflicting results: the direct query ignores `is_active`, the view doesn't. UI inconsistency.

**[CC-L02] [Medium] [UNIQUE]** `mobile/src/features/employer/data/services/candidateBrowse.ts:145–149`  
Location filter builds PostgREST `.or()` clauses via string concatenation using user-controlled filter state. Comma, dot, or operator characters in location strings malform the filter query. Not SQL injection (PostgREST parameterizes) but silently returns wrong results.

**[CC-L03] [Medium] [UNIQUE]** `mobile/src/features/candidate/data/services/onboardingDraft.ts:16`  
`JSON.parse(raw)` called without try/catch. Corrupted AsyncStorage string (possible after crash during write) throws unhandled exception. Candidate with corrupted draft cannot open onboarding screen.

**[CC-L04] [Medium] [OVERLAP with P3-23]** `supabase/migrations/20260604800000_free_unlocks_no_subscription.sql`  
`unlock_candidate` removed subscription check entirely. No feature flag, no migration to re-add it, no automated path back to billing. Monetization completely disabled in production. Comment says "re-enable when supply grows" with no enforcement mechanism.

**[CC-L05] [Medium] [UNIQUE]** `supabase/functions/verify-otp/index.ts:40–45`  
Missing Twilio secrets: `verify-otp` returns HTTP 200 with error. `send-otp` proceeds with `undefined` credentials, sends `Authorization: Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` to Twilio (base64 of `undefined:undefined`). Misconfigured deployments silently fail on send with no alarm.

**[CC-L06] [Medium] [UNIQUE]** `mobile/src/features/employer/presentation/screens/CandidateDetailScreen.tsx:100–107`  
`notify-candidate` invoked in a `useEffect` that fires every time `candidate` changes. If candidate query refetches (on unlock, on focus), effect re-runs and sends another "viewed" notification + increments view count again. Guard only checks `if (!candidate || isUnlocked)`.

**[CC-L07] [Low] [UNIQUE]** `supabase/migrations/20260622144417_preserve_inactive_unlocked_candidates.sql`  
`candidate_browse` view drops `availability_status` column that was added in `20260602300000_candidate_availability_status.sql`. Employers cannot see whether an unlocked-but-inactive candidate is hired, paused, or unavailable.

**[CC-L08] [Low] [UNIQUE]** `mobile/src/features/candidate/data/services/candidatePhoto.ts:33`  
Photo upload uses `x-upsert: true` with `Date.now()` as path. Two rapid uploads in same millisecond silently overwrite each other with no error.

**[CC-L09] [Low] [UNIQUE]** `mobile/src/features/employer/data/services/unlocks.ts:22–23`  
`fetchUnlocks` queries `unlocks` with no LIMIT. Hundreds of unlocks → unbounded query. Eventually hits PostgREST 1000-row limit, silently truncating employer's unlock history.

**[CC-L10] [Low] [UNIQUE]** `mobile/src/core/lib/supabase.ts:13–14`  
Missing env vars produce client with literal placeholder values `'https://placeholder.supabase.co'`. App "works" in misconfigured state — all queries fail with generic network errors. `assertEnv()` exists but is not called on startup.

---

## E2E FLOW AUDIT (Claude Code — Unique findings only, overlaps already in Codex section)

### Auth

**[CC-F01] [High] [OVERLAP with P2-36, P3-14]** `PhoneOtpScreen.tsx` + `RoleSelectionScreen.tsx`  
`confirmRole()` calls `navigation.replace('PhoneOtp')`. Stack is `[PhoneOtp]` with nothing behind it. No back button, no role-change link. Wrong role choice = must kill app.

**[CC-F02] [High] [OVERLAP with P2-32]** `authNavigation.ts` — `applyPendingRole()`  
Uses plain `.insert()` not upsert. If `profiles` row already exists from a prior failed attempt, unique-constraint error → permanent "Could not load your profile". Account created but unreachable.

**[CC-F03] [Low] [UNIQUE]** `LanguageSelectionScreen.tsx`  
Language card shows one row (English only) with no placeholder for Arabic, no "coming soon" label. Card has `overflow: hidden`. Looks broken or still loading to Arabic-speaking users.

### Candidate Onboarding

**[CC-F04] [High] [UNIQUE]** `Step1Photo.tsx`  
Network failure during photo upload sets `permissionError` state — the same state used for camera permission denials. User sees "Permission required" for a network error. Goes to device settings to fix something that isn't broken.

**[CC-F05] [High] [UNIQUE]** `onboardingDraft.ts` + `CandidateOnboardingContext.tsx`  
Draft saves debounced 500ms. iOS can terminate the process in under 200ms when app is backgrounded. No `AppState` listener for synchronous flush on background. Draft lost on mid-fill app switch. Common scenario: copying WhatsApp number from another app.

**[CC-F06] [High] [UNIQUE]** `Step4Finish.tsx` — `submit()`  
Always calls `navigation.reset({ index: 0, routes: [{ name: 'CandidateShell' }] })` — even in edit mode. User who enters from Settings → Edit Profile is teleported to HomeTab after saving. Loses their place in the app.

**[CC-F07] [Medium] [UNIQUE]** `CandidateOnboardingScreen.tsx`  
Step components use `useNavigation()` internally instead of the `navigation` prop passed from parent. In tab-nested contexts (profile edit), `useNavigation()` may resolve to the tab navigator. Tapping Back from Step 1 could go to wrong screen.

**[CC-F08] [Low] [UNIQUE]** `RootNavigator.tsx` + `types.ts`  
`CandidateDashboard` registered as a standalone route but `routeCandidate` never navigates there. Dead code. If a deep link resolves to it, user gets dashboard without tab bar — broken experience and silent landmine.

### Employer Onboarding

**[CC-F09] [High] [OVERLAP with P3-16, P2-15]** `EmployerStep2Contact.tsx` — `submit()`  
`supabase.auth.getUser()` called outside try/catch before `setLoading(true)`. Expired session throws unhandled rejection. Missing userId → silent return after button press. No feedback, no loading state, form permanently appears stuck.

**[CC-F10] [High] [UNIQUE]** `EmployerOnboardingContext.tsx`  
All employer onboarding form state in local useState with no persistence. No AsyncStorage draft, no AppState listener. App killed mid-form = all data lost. Candidate onboarding has a full draft system. Employer has nothing. Structurally higher employer churn at registration.

**[CC-F11] [Medium] [UNIQUE]** `EmployerStep2Contact.tsx`  
Company name uniqueness check re-runs on final submit. If name is taken since step 1, error shown on step 2 where there is no company name field. Error message doesn't instruct user to go back. User confused, can't find field to fix.

**[CC-F12] [Low] [UNIQUE]** `EmployerOnboardingContext.tsx` — edit mode  
Edit mode always starts on step 1. No `startStep` param. Employer who only needs to update contact phone must pass through company name check on step 1 first. Every contact edit requires re-navigating step 1.

### Candidate Dashboard

**[CC-F13] [Medium] [OVERLAP with P2-01]** `CandidateDashboardScreen.tsx` — `toggleActive()`  
Switch flickers — derives from stale `candidate.is_active` while async load is in flight. User taps twice thinking first tap failed → accidentally toggles back.

**[CC-F14] [Medium] [OVERLAP with P2-18]** `CandidateDashboardScreen.tsx` — `fetchCandidate()`  
Unlock count query error not checked. Silent "0 unlocks" when query fails. Candidate thinks no one is interested. Undermines platform trust.

**[CC-F15] [Medium] [UNIQUE]** `CandidateShellScreen.tsx` + `SettingsScreen.tsx` — `openEditProfile()`  
Both hardcode `startStep: 3` (location). Settings path cannot reach Step 1 (photo) or Step 2 (job role). Only path to edit photo/role is the dashboard card "Edit Profile" button — not labelled as full editor.

### Employer Browse & Search

**[CC-F16] [Medium] [OVERLAP with P3-20]** `RefineFiltersModal.tsx`  
No validation that `salaryMin ≤ salaryMax`. Impossible range returns zero results with no explanation. Empty state offers "Browse" making it look like the role has no candidates.

**[CC-F17] [Low] [UNIQUE]** `BrowseScreen.tsx` — `showRoleLegend`  
Initialized as `false`, set to `true` after AsyncStorage read resolves. On every session the role legend "pops in" mid-render causing content shift. Looks like a rendering bug on slower devices.

### Unlock Flow

**[CC-F18] [High] [OVERLAP with P2-14, P2-26]** `CandidateDetailScreen.tsx` — `goBack()`  
`fetchAccountRole()` called with no `.catch()`. Network error → rejection swallowed → navigate call never executes → user stranded on detail screen from deep link. Force-quit only escape.

**[CC-F19] [Medium] [UNIQUE]** `MyUnlocksScreen.tsx` — empty state  
"Browse candidates" button uses `navigation.getParent()?.navigate('BrowseTab')`. Outside employer shell (deep link), `getParent()` returns undefined, optional chain silently no-ops. Button does nothing.

**[CC-F20] [Medium] [UNIQUE]** `CandidateDetailScreen.tsx` — unlock success  
After unlock, `refetchCandidate()` called but `useEmployerUnlockStatus` hook NOT invalidated. `isUnlocked` computed as `alreadyUnlocked || isCandidateUnlocked(candidate)`. Unlock button briefly reappears. Confused employer taps again → duplicate unlock mutation.

### Settings

**[CC-F21] [Medium] [UNIQUE]** `SettingsPanel.tsx` — language section  
`ARABIC_ENABLED = false` renders single English chip. Below it, `settingsRtlReloadHint` ("restart to apply RTL") is still shown. Meaningless and actively misleading to English-only users. Some will restart expecting a layout change.

**[CC-F22] [Medium] [UNIQUE]** `EmployerShellScreen.tsx` + `CandidateShellScreen.tsx` — logout  
`LANGUAGE_SELECTION_DONE_KEY` never cleared on logout. Next user on same device skips language screen and inherits previous user's language. "Change Language" link only shows when `ARABIC_ENABLED = true` — currently hidden. Language is locked for shared-device users.

**[CC-F23] [Low] [OVERLAP with P2-40]** `SettingsPanel.tsx` — profile load failure  
Error shown as small text with no retry button. `useEffect` has no focus dependency. Must kill and reopen app to retry.

**[CC-F24] [Low] [UNIQUE]** `AuthProvider.tsx`  
3-second fallback timer can race with `onAuthStateChange`. If `SIGNED_OUT` fires and fallback fires 3s later with stale cached session, app briefly re-sets session after signOut — transient phantom authenticated state.

---

## Updated Summary Count (Combined Codex + Claude Code, deduplicated)

| Persona / Area | Critical | High | Medium | Low | Total |
|----------------|----------|------|--------|-----|-------|
| P1 — Frontend/UI | 0 | 6 | 12 | 5 | 23 |
| P2 — UX Designer | 2 | 18 | 15 | 3 | 38 |
| P3 — QA/Flow | 0 | 7 | 15 | 3 | 25 |
| P4 — Backend/API | 0 | 13 | 10 | 0 | 23 |
| P5 — Device/A11y | 0 | 18 | 12 | 0 | 30 |
| CC Security | 0 | 9 | 0 | 0 | 9 |
| CC Data/Integrity | 0 | 3 | 1 | 0 | 4 |
| CC Efficiency | 0 | 3 | 0 | 0 | 3 |
| CC Logic | 0 | 1 | 4 | 5 | 10 |
| CC Flow (unique) | 0 | 6 | 8 | 4 | 18 |
| **TOTAL (unique)** | **2** | **~70** | **~55** | **~15** | **~142** |

*Overlapping findings confirmed priority — they appear in both agents independently.*

---

---

# Gap Audit — Additional Areas

> Checked by PM after persona audits completed.

## 1. Storage Bucket Policies

**`candidate-photos` → `public = true` ❌**  
Anyone on the internet can access candidate photos by direct URL with no authentication. No signed URLs, no expiry, no access revocation. Photos persist publicly after account deletion or profile pause. Bots can enumerate and scrape all candidate photos.

**`employer-logos` → `public = true` ❌**  
Same issue. Employer logos publicly accessible without auth.

**`candidate-cvs` → `public = false` ✓**  
Correctly private.

## 2. app.config.ts / Build Secrets

**CLEAN.** Supabase URL and anon key read from env vars, fall back to empty strings. EAS project ID hardcoded — acceptable, not a secret. No action needed.

## 3. CI/CD Pipeline

**Secrets handling: CORRECT** — all credentials in GitHub Secrets.

**`supabase-migrate.yml` is dangerous:**
- Auto-deploys every migration to **production** on every push to `main`
- Uses `--ignore-warnings` — suppresses safety warnings
- No staging environment, no manual approval step
- This is exactly how `20260605000000_qa_candidate_contact_backfill.sql` (hardcoded test phone number) was auto-deployed to production

## 4. EAS Updates (OTA)

**NOT configured.** No `updates` block in `app.config.ts`, no `runtimeVersion`, no `updates.url`. Every fix to the 139+ issues in this audit requires a full App Store / Play Store submission. Given the security issues found (OTP bypass, RLS violations, billing disabled), this is a critical operational gap.

## 5. Payment / Credits UI

**Does not exist.** No payment screen, no Stripe integration, no credits purchase flow anywhere in the mobile codebase. The `payments` table exists in the DB with `stripe_payment_id` — the backend schema anticipates payments but the client implementation is entirely absent. Combined with server-side billing disabled (`free_unlocks_no_subscription`), **the business model has zero implementation in production on either side.**

## 6. Push Notification Permission Denied

When a user denies push notifications, the app silently continues — no message, no explanation of what they're missing, no re-prompt path. On Android without `google-services.json` (FCM not configured), `canRegisterNativePushToken()` returns false and the entire notification system is silently disabled — the user sees nothing. No "you won't receive job alerts" message exists anywhere in the flow.

---

---

# Fix Plan — All Sprints

> PM-ordered by risk and dependency. Do not skip sprints — later sprints depend on earlier ones being stable.

---

## 🔴 SPRINT 1 — Security (Fix before any real users)

These are exploitable right now by anyone with the API URL.

| # | Issue | File |
|---|-------|------|
| S1 | OTP codes in server logs and response body | `supabase/functions/verify-otp/index.ts` — remove `debugPhone` from response and `console.log` |
| S2 | `send-otp` has no auth — SMS spam/harassment vector | `supabase/functions/send-otp/index.ts` — require valid JWT, add per-phone 60s cooldown |
| S3 | `notify-candidate` has no auth — spam and metric manipulation | `supabase/functions/notify-candidate/index.ts` — require JWT + verify caller owns the unlock |
| S4 | `candidate-reengagement` has no auth — anyone triggers bulk push | `supabase/functions/candidate-reengagement/index.ts` — require service-role JWT |
| S5 | `add_employer_credits` publicly executable — anyone manufactures credits | New migration: `REVOKE EXECUTE ON FUNCTION add_employer_credits FROM PUBLIC` |
| S6 | `activate_employer_subscription` publicly executable | New migration: `REVOKE EXECUTE` |
| S7 | `increment_candidate_profile_view` publicly executable | New migration: `REVOKE EXECUTE` |
| S8 | Users can self-promote `profiles.role` to employer | New migration: remove UPDATE policy on `role` column |
| S9 | Employers INSERT directly into `unlocks` bypassing `unlock_candidate` | New migration: remove direct INSERT policy on `unlocks` |
| S10 | `OTP_BYPASS_ENABLED` has no production guard | `supabase/functions/verify-otp/index.ts` — reject bypass if not in dev environment |
| S11 | React Query cache survives logout — data leaks between accounts | `mobile/App.tsx` — call `queryClient.clear()` on logout |
| S12 | Browse cache not user-scoped, not cleared on logout | `browseCache.ts` — scope key to user ID, clear on logout |
| S13 | Onboarding draft not user-scoped, not cleared on logout | `onboardingDraft.ts` — scope key to user ID, clear on logout |

---

## 🔴 SPRINT 2 — Broken Core Flows (Fix before any marketing)

| # | Issue | File |
|---|-------|------|
| F1 | Billing completely disabled — unlimited free unlocks | Re-enable credit check in `unlock_candidate` function |
| F2 | QA test phone backfilled on real candidate records | Write migration to undo the backfill |
| F3 | OTP is UI-only gate — `signInAnonymously` bypasses it | Link Supabase auth to verified phone at server level |
| F4 | Candidate blank screen on dashboard fetch failure | `CandidateDashboardScreen.tsx` — replace `return null` with error state + retry |
| F5 | No back button from PhoneOtp — wrong role traps user | Add "Change role" link or back button to PhoneOtp |
| F6 | `applyPendingRole` uses INSERT not upsert — locks out users with prior failed signup | `authNavigation.ts` — change to upsert |
| F7 | Employer submit silently fails on expired session | `EmployerStep2Contact.tsx` — wrap `getUser()` in try/catch, show error + navigate to auth |
| F8 | Hardware Back exits entire onboarding instead of going to prev step | `CandidateOnboardingScreen.tsx` + `EmployerOnboardingScreen.tsx` — intercept `BackHandler` |
| F9 | `goBack()` from deep-linked CandidateDetailScreen silently fails | `CandidateDetailScreen.tsx` — add `.catch()`, fallback to `navigate('EmployerShell')` |
| F10 | Double routing race on auth success | `PhoneOtpScreen.tsx` + `EmailOtpScreen.tsx` — gate with ref flag, only first caller wins |

---

## 🟡 SPRINT 3 — Data Integrity (Fix before scale)

| # | Issue | File |
|---|-------|------|
| D1 | Candidate photos publicly accessible — scrapeable, persist after deletion | New migration: set `candidate-photos` to `public = false`, serve via signed URLs |
| D2 | `candidate_browse` view uses N+1 correlated subqueries per row | Rewrite view with `LEFT JOIN` on unlocks |
| D3 | `fetchRoleCounts` downloads all candidate rows client-side | Replace with server-side `GROUP BY` RPC |
| D4 | `candidate-reengagement` serial N+1 loop — times out | Batch fetch tokens with JOIN, send via Expo bulk API |
| D5 | CV delete-before-update race condition | `CandidateCvSection.tsx` — upload new → update DB → delete old |
| D6 | CV size limit mismatch: client 8MB vs server 5MB | `candidateCv.ts` — change client limit to 5MB |
| D7 | `updateUser` result discarded — phone not stored on auth | `twilioVerify.ts` — check error, retry or surface failure |
| D8 | View count incremented on every candidate data refetch | `CandidateDetailScreen.tsx` — track `hasNotified` with ref, fire once per mount |
| D9 | Supabase client has no request timeout | `supabase.ts` — add global fetch timeout wrapper |
| D10 | `candidate_browse` drops `availability_status` | Restore column in view definition |

---

## 🟡 SPRINT 4 — UX Blockers (Fix before launch)

| # | Issue | File |
|---|-------|------|
| U1 | Keyboard covers Continue button on all form screens | Add `KeyboardAvoidingView` + number-pad dismiss to `CandidateOnboardingStep`, `EmployerOnboardingStep`, `RefineFiltersModal`, `Step4SalaryVisa` |
| U2 | Employer onboarding has no draft — data lost on background/kill | `EmployerOnboardingContext.tsx` — add AsyncStorage draft + AppState flush |
| U3 | Candidate draft lost when app is backgrounded | `onboardingDraft.ts` — add AppState listener for synchronous flush |
| U4 | Photo upload failure shows "Permission required" | `Step1Photo.tsx` — separate `uploadError` from `permissionError` state |
| U5 | Edit profile always starts at step 3 — can't reach photo/role | `CandidateShellScreen.tsx` + `SettingsScreen.tsx` — pass `startStep: 1` |
| U6 | Edit profile `navigation.reset` teleports user to HomeTab | `Step4Finish.tsx` — use `navigation.goBack()` in edit mode |
| U7 | Profile active toggle flickers on tap | `CandidateDashboardScreen.tsx` — apply optimistic update before async call |
| U8 | Logout doesn't clear language — shared device problem | `EmployerShellScreen.tsx` + `CandidateShellScreen.tsx` — clear `LANGUAGE_SELECTION_DONE_KEY` on logout |
| U9 | Wrong OTP shows "Something went wrong" not "Wrong code" | `PhoneOtpScreen.tsx` — add `t.errorWrongCode` string |
| U10 | Salary filter capped at AED 10,000, profiles allow AED 1,000,000 | `candidateBrowse.ts` — raise cap |
| U11 | `salaryMin > salaryMax` produces unexplained empty results | `RefineFiltersModal.tsx` — add validation, show inline error |
| U12 | RTL reload hint shown when Arabic disabled | `SettingsPanel.tsx` — hide hint when `ARABIC_ENABLED = false` |
| U13 | SplashScreen hangs indefinitely offline | `SplashScreen.tsx` — add 15s timeout with retry state |
| U14 | Deep links dropped on first-launch network error | `RootNavigator.tsx` — persist pending link through retry cycle |
| U15 | Empty state "Refine" CTA on genuinely empty role | `BrowseScreen.tsx` — distinguish "too many filters" from "role is empty" |
| U16 | EmployerStep2 company-name-taken error shown with no field to fix | `EmployerStep2Contact.tsx` — navigate back to step 1 automatically |
| U17 | Settings profile load failure has no retry | `SettingsPanel.tsx` — add retry button |

---

## 🟠 SPRINT 5 — Accessibility & Device (Fix before App Store submission)

| # | Issue | Action |
|---|-------|--------|
| A1 | Font scaling capped globally on buttons, labels, errors, dialogs | Remove or raise `maxFontSizeMultiplier` caps to minimum 1.5× |
| A2 | `getItemLayout` fixed 85px on variable-height rows | Remove `getItemLayout` or make height dynamic |
| A3 | Safe area missing on TabScreenLayout, BrowseScreen, MyUnlocksScreen, AdditionalRolesScreen | Wrap with `<Screen>` or `<SafeAreaView edges={['top']}>` |
| A4 | Touch targets below 44px on chips, language rows, discard button, role removal | Add `minHeight: 44` and `hitSlop` where needed |
| A5 | Contrast ratios failing WCAG AA (primary blue, error red, success green) | Darken colors in `colors.ts` to meet 4.5:1 |
| A6 | Warning/hired status text contrast ~2.07:1 | Darken text or lighten background on status badges |
| A7 | Arabic role labels stored as corrupted mojibake | Fix encoding in `mobile/src/shared/constants/candidate.ts` |

---

## 🟢 SPRINT 6 — Infrastructure (Run in parallel with above)

| # | Issue | Action |
|---|-------|--------|
| I1 | No OTA update configured — every fix needs App Store review | Add `updates` + `runtimeVersion` to `app.config.ts`, configure EAS Update |
| I2 | Migration pipeline auto-deploys to prod with `--ignore-warnings` | Add manual approval to `supabase-migrate.yml`, remove `--ignore-warnings` |
| I3 | No staging environment | Create staging Supabase project, add staging deploy step before prod |
| I4 | No payment/credits UI — business model has no client implementation | Build credits purchase screen (decide: in-app purchase vs web payment) |
| I5 | Push notification denied — no user explanation | Show "You won't receive job alerts" message when permission denied |
| I6 | No ESLint configured | Add ESLint + React Native rules to CI |
| I7 | No native device test framework | Add Maestro or Detox for E2E on physical device |

---

## Sprint Order Summary

```
SPRINT 1  Security       → Fix NOW — exploitable today
SPRINT 2  Core flows     → Fix before any marketing push
SPRINT 3  Data           → Fix before scale
SPRINT 4  UX             → Fix before production launch
SPRINT 5  Accessibility  → Fix before App Store submission
SPRINT 6  Infra          → Run in parallel with 1–5
```

**Total: ~73 actionable fixes across 6 sprints.**

*Next step: PM triage — group by theme, eliminate duplicates, order by fix priority.*
