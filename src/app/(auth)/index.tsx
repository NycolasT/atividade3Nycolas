import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Alert, ScrollView, Platform } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { CustomButton } from "../../components/CustomButton";
import { NotificationCard } from "../../components/NotificationCard";
import { ScheduleSection } from "../../components/ScheduleSection";

// Handler de notificações (opções suportadas pelo SDK)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type NotificationData = { id: string; title: string; body: string; time: string };

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderInterval, setReminderInterval] = useState("60");

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Permissões
  useEffect(() => {
    async function requestPermissions() {
      if (!Device.isDevice) {
        Alert.alert("Aviso", "Notificações precisam de um dispositivo físico.");
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Permissão negada", "Habilite notificações para receber lembretes.");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Hidratação",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#2196F3",
        });
      }
    }
    requestPermissions();
  }, []);

  // Listeners
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      const n: NotificationData = {
        id: notification.request.identifier,
        title: notification.request.content.title || "",
        body: notification.request.content.body || "",
        time: new Date().toLocaleTimeString("pt-BR"),
      };
      setNotifications((prev) => [n, ...prev]);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log("Notificação clicada:", response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Única em 15s
  async function scheduleNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora de Beber Água! 💧",
          body: "Não se esqueça de se hidratar.",
          sound: "default",
          data: { type: "hydration" },
        },
        trigger: { seconds: 15 },
      });
      Alert.alert("Sucesso", "Lembrete agendado para 15 segundos!");
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível agendar a notificação.");
    }
  }

  // Recorrente
  async function scheduleRecurringNotification() {
    try {
      const interval = parseInt(reminderInterval);
      if (isNaN(interval) || interval <= 0) {
        Alert.alert("Erro", "Insira um intervalo válido em minutos.");
        return;
      }
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora de Beber Água! 💧",
          body: `Lembrete a cada ${interval} minuto(s)`,
          sound: "default",
          data: { type: "recurring" },
        },
        trigger: { seconds: interval * 60, repeats: true },
      });
      Alert.alert("Sucesso", `Lembrete a cada ${interval} minuto(s)!`);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível agendar recorrência.");
    }
  }

  // Horário específico
  async function scheduleForSpecificTime() {
    try {
      const now = new Date();
      const triggerTime = new Date(selectedTime);
      if (triggerTime <= now) triggerTime.setDate(triggerTime.getDate() + 1);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lembrete Agendado! 💧",
          body: `Hora de beber água - ${triggerTime.toLocaleTimeString("pt-BR")}`,
          sound: "default",
        },
        trigger: triggerTime,
      });
      Alert.alert("Sucesso", `Agendado para ${triggerTime.toLocaleString("pt-BR")}`);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível agendar para este horário.");
    }
  }

  async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert("Sucesso", "Todas as notificações foram canceladas.");
  }

  function clearHistory() {
    setNotifications([]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user?.imageUrl }} style={styles.image} />
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.title}>App de Hidratação 💧</Text>
      </View>

      <ScheduleSection
        reminderInterval={reminderInterval}
        setReminderInterval={setReminderInterval}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        onScheduleNotification={scheduleNotification}
        onScheduleRecurring={scheduleRecurringNotification}
        onScheduleSpecificTime={scheduleForSpecificTime}
        onCancelAll={cancelAllNotifications}
      />

      <View style={styles.section}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Histórico de Notificações</Text>
          {notifications.length > 0 && <CustomButton title="Limpar" onPress={clearHistory} color="#999" />}
        </View>

        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma notificação recebida ainda.</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationCard notification={item} />}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton title="Sair" onPress={() => signOut()} color="#000" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    padding: 32,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  image: { width: 92, height: 92, borderRadius: 46, marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2196F3" },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  historyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  emptyText: { textAlign: "center", color: "#999", fontSize: 14, fontStyle: "italic", paddingVertical: 20 },
  logoutContainer: { margin: 16, marginBottom: 32 },
});