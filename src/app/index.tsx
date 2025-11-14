import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/(auth)" : "/(public)");
  }, [isLoaded, isSignedIn]);

  return null;
}
