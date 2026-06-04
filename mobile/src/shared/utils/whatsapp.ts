import { Linking } from 'react-native';
import { markSubscriptionPending } from '@/features/employer/data/services/subscriptionPending';

const SUPPORT = '971501551480';

export async function openWhatsAppSubscribe(
  contact: string,
  message: string,
): Promise<void> {
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent(message)}`;
  await markSubscriptionPending();
  await Linking.openURL(url);
}

export async function openWhatsAppSupport(message: string): Promise<void> {
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}
