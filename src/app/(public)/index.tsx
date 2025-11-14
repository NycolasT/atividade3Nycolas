import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { CustomButton } from "../../components/CustomButton";

WebBrowser.maybeCompleteAuthSession();

export default function PublicScreen() {
  const [loading, setLoading] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  async function signInWithGoogle() {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao autenticar com Google.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => WebBrowser.coolDownAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App de Hidratação</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>
      <CustomButton title={loading ? "Entrando..." : "Entrar com Google"} onPress={signInWithGoogle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 8, color: "#2196F3" },
  subtitle: { fontSize: 16, textAlign: "center", color: "#666", marginBottom: 24 },
});