import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LocaleProvider } from './src/i18n/LocaleContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <LocaleProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </LocaleProvider>
  );
}
