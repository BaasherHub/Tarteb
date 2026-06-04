import { StatusBar } from 'expo-status-bar';
import { LocaleProvider } from '@/core/i18n/LocaleContext';
import { RootNavigator } from '@/core/navigation/RootNavigator';

export default function App() {
  return (
    <LocaleProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </LocaleProvider>
  );
}
