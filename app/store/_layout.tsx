// This file prevents expo-router from scanning the store folder as routes
// Store files are not React components, they are Zustand stores
export default function StoreLayout() {
  return null;
}
