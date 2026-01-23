import { Redirect } from 'expo-router';

// Redirect to new auth flow
export default function VendorLoginRedirect() {
  return <Redirect href="/auth/vendor-login" />;
}
