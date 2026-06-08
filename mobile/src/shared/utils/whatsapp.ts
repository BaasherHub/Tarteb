import { Linking } from 'react-native';

const SUPPORT = '971501551480';

export async function openWhatsAppSupport(message: string): Promise<void> {
  const url = `https://wa.me/${SUPPORT}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}
