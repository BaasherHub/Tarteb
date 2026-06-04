import { StatusBar } from 'expo-status-bar';
import { LocaleProvider } from '@/core/i18n/LocaleContext';
import { AuthProvider } from '@/core/providers/AuthProvider';
import { RootNavigator } from '@/core/navigation/RootNavigator';

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </LocaleProvider>
  );
}
