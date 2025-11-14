import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  time: string;
}

export function NotificationCard({ notification }: { notification: NotificationData }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.body}>{notification.body}</Text>
      <Text style={styles.time}>{notification.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  body: { fontSize: 14, color: '#666', marginBottom: 4 },
  time: { fontSize: 12, color: '#999', fontStyle: 'italic' },
});
