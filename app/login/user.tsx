import { Redirect } from 'expo-router';

// Redirect to new auth flow
export default function UserLoginRedirect() {
  return <Redirect href="/auth/user-login" />;
}
