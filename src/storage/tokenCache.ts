import * as SecureStore from "expo-secure-store";

type TokenCache = {
  getToken: (key: string) => Promise<string | null | undefined>;
  saveToken: (key: string, value: string) => Promise<void>;
};

export const tokenCache: TokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};