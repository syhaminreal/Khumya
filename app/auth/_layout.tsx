import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="user-login" />
      <Stack.Screen name="user-signup" />
      <Stack.Screen name="vendor-login" />
      <Stack.Screen name="vendor-signup" />
    </Stack>
  );
}
