import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { router, Slot } from "expo-router";
import { tokenCache } from "@/storage/tokenCache"; // corrigido

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/(auth)" : "/(public)");
  }, [isLoaded, isSignedIn]);

  return isLoaded ? (
    <Slot />
  ) : (
    <ActivityIndicator style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
  );
}

export default function Layout() {
  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}