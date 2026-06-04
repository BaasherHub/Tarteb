import { colors } from '@/core/theme/colors';

export function visaChipColor(visaStatus: string): string {
  switch (visaStatus) {
    case 'Employment Visa':
      return colors.visaEmployment;
    case 'Visit Visa':
      return colors.visaVisit;
    case 'Own Visa':
      return colors.visaOwn;
    case 'Cancelled Visa':
      return colors.visaCancelled;
    default:
      return colors.textSecondary;
  }
}


