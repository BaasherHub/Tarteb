import { Linking } from 'react-native';
import { markSubscriptionPending } from '@/features/employer/data/services/subscriptionPending';


const SUPPORT = '971501551480';

export async function openWhatsAppSubscribe(
  contact: string,
  tier = 'starter',
  price = 'AED 79.9 / mo',
): Promise<void> {
  const message =
    `Hi, I want to subscribe to Tarteb — ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan (${price}).\nMy number: ${contact}`;
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent(message)}`;
  await markSubscriptionPending();
  await Linking.openURL(url);
}

export async function openWhatsAppSupport(): Promise<void> {
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent('Hi, I need support with Tarteb.')}`;
  await Linking.openURL(url);
}
