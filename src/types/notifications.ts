export interface NotificationData {
  id: string;
  title: string;
  body: string;
  time: string;
}

export interface ScheduleSectionProps {
  reminderInterval: string;
  setReminderInterval: (value: string) => void;
  selectedTime: Date;
  setSelectedTime: (date: Date) => void;
  showTimePicker: boolean;
  setShowTimePicker: (show: boolean) => void;
  onScheduleNotification: () => void;
  onScheduleRecurring: () => void;
  onScheduleSpecificTime: () => void;
  onCancelAll: () => void;
}

export interface NotificationCardProps {
  notification: NotificationData;
}

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  style?: any;
}
