import React from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomButton } from "./CustomButton";

interface Props {
  reminderInterval: string;
  setReminderInterval: (v: string) => void;
  selectedTime: Date;
  setSelectedTime: (d: Date) => void;
  showTimePicker: boolean;
  setShowTimePicker: (b: boolean) => void;
  onScheduleNotification: () => void;
  onScheduleRecurring: () => void;
  onScheduleSpecificTime: () => void;
  onCancelAll: () => void;
}

export function ScheduleSection({
  reminderInterval,
  setReminderInterval,
  selectedTime,
  setSelectedTime,
  showTimePicker,
  setShowTimePicker,
  onScheduleNotification,
  onScheduleRecurring,
  onScheduleSpecificTime,
  onCancelAll,
}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Agendar Lembrete</Text>

      <CustomButton title="Lembrete em 15s" onPress={onScheduleNotification} color="#4CAF50" />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Intervalo (minutos):</Text>
        <TextInput
          style={styles.input}
          value={reminderInterval}
          onChangeText={setReminderInterval}
          keyboardType="numeric"
          placeholder="60"
        />
      </View>

      <CustomButton title="Configurar Recorrente" onPress={onScheduleRecurring} color="#2196F3" />

      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Horário Específico:</Text>
        <CustomButton
          title={`Selecionar: ${selectedTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
          onPress={() => setShowTimePicker(true)}
          color="#666"
        />
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour
            onChange={(_, date) => {
              setShowTimePicker(Platform.OS === "ios");
              if (date) setSelectedTime(date);
            }}
          />
        )}

        <CustomButton title="Agendar Horário" onPress={onScheduleSpecificTime} color="#FF9800" />
      </View>

      <CustomButton title="Cancelar Todos" onPress={onCancelAll} color="#F44336" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#333" },
  inputContainer: { marginVertical: 12 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  timePickerContainer: { marginVertical: 12 },
});
