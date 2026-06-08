import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@/core/navigation/types';

const prefix = Linking.createURL('/');

/**
 * Deep link examples:
 * - tarteb://candidate/{id}
 * - tarteb://browse
 * - tarteb://unlocks
 * - tarteb://dashboard (candidate home)
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'tarteb://', 'https://tarteb.app'],
  config: {
    screens: {
      CandidateDetail: {
        path: 'candidate/:candidateId',
        parse: {
          candidateId: (id: string) => id,
        },
      },
      EmployerShell: {
        screens: {
          BrowseTab: 'browse',
          UnlocksTab: 'unlocks',
          SettingsTab: 'employer-settings',
        },
      },
      CandidateShell: {
        screens: {
          HomeTab: 'dashboard',
          SettingsTab: 'settings',
        },
      },
    },
  },
};
