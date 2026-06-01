import { Linking } from 'react-native';

const SUPPORT = '971501551480';

export async function openWhatsAppSubscribe(contact: string): Promise<void> {
  const message =
    `Hi, I want to subscribe to Tarteb (AED 39.99/month).\nMy number: ${contact}`;
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}

export async function openWhatsAppSupport(): Promise<void> {
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent('Hi, I need support with Tarteb.')}`;
  await Linking.openURL(url);
}
