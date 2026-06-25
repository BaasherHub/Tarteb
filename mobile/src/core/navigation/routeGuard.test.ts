import { describe, expect, it } from 'vitest';
import {
  getRootRouteName,
  routeGuardTarget,
  unauthenticatedRouteGuardRedirect,
} from './routeGuard';

describe('route guard helpers', () => {
  it('uses the root stack route instead of the nested tab route', () => {
    expect(
      getRootRouteName({
        index: 0,
        routes: [
          {
            name: 'CandidateShell',
            state: {
              index: 1,
              routes: [{ name: 'HomeTab' }, { name: 'SettingsTab' }],
            },
          },
        ],
      }),
    ).toBe('CandidateShell');
  });

  it('classifies candidate and employer root routes', () => {
    expect(routeGuardTarget('CandidateShell')).toBe('candidate');
    expect(routeGuardTarget('EmployerShell')).toBe('employer');
    expect(routeGuardTarget('PhoneOtp')).toBeNull();
  });

  it('sends unauthenticated protected routes to auth instead of role selection', () => {
    expect(unauthenticatedRouteGuardRedirect('CandidateShell')).toBe('PhoneOtp');
    expect(unauthenticatedRouteGuardRedirect('EmployerShell')).toBe('PhoneOtp');
    expect(unauthenticatedRouteGuardRedirect('RoleSelection')).toBeNull();
  });
});
