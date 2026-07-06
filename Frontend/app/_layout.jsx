import { Slot, Stack } from 'expo-router';
import { UserProvider } from '../Context/UserContext';
import '../app/global.css';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products" />
      </Stack>
    </UserProvider>
  );
}