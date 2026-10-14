/**
 * Expo React Native: Teacher Detail & Slot Selection Screen
 * Corresponds to Wireframe 2 (Mobile App Experience)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

interface SlotOption {
  id: string;
  time: string;
  isFull: boolean;
}

export const TeacherDetailScreen: React.FC<{
  onContinueToPayment: (selectedDay: string, selectedSlot: string) => void;
}> = ({ onContinueToPayment }) => {
  const [selectedDay, setSelectedDay] = useState('Wed 21');
  const [selectedSlot, setSelectedSlot] = useState('9:30 AM');

  const days = [
    { key: 'Mon 19', label: 'Mon 19' },
    { key: 'Tue 20', label: 'Tue 20' },
    { key: 'Wed 21', label: 'Wed 21' },
    { key: 'Thu 22', label: 'Thu 22' },
  ];

  const slots: SlotOption[] = [
    { id: '1', time: '7:00 AM', isFull: false },
    { id: '2', time: '9:30 AM', isFull: false },
    { id: '3', time: '6:00 PM', isFull: false },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 1 of 2</Text>
        </View>

        {/* Teacher Header */}
        <View style={styles.header}>
          <Text style={styles.teacherName}>Ananya Sharma</Text>
          <Text style={styles.teacherSubtitle}>Hatha and Vinyasa · 60 min · ₹1,200</Text>
        </View>

        {/* Day Selector Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {days.map((day) => {
            const isSelected = selectedDay === day.key;
            return (
              <TouchableOpacity
                key={day.key}
                style={[styles.dayPill, isSelected && styles.dayPillActive]}
                onPress={() => setSelectedDay(day.key)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{day.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Date Heading */}
        <Text style={styles.dateHeading}>Wednesday 21 October</Text>

        {/* Slots List */}
        <View style={styles.slotsList}>
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[styles.slotCard, isSelected && styles.slotCardActive]}
                onPress={() => setSelectedSlot(slot.time)}
              >
                <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sticky Bottom Checkout Summary */}
        <View style={styles.bottomCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryDate}>Wed 21 Oct, {selectedSlot}</Text>
            <Text style={styles.summaryPrice}>₹1,200</Text>
          </View>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => onContinueToPayment(selectedDay, selectedSlot)}
          >
            <Text style={styles.paymentButtonText}>Continue to payment</Text>
          </TouchableOpacity>
          <Text style={styles.paymentMethodsSubtext}>UPI · Card · Apple Pay · Netbanking</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4CDC3',
    backgroundColor: '#FFFFFF',
  },
  backText: {
    fontSize: 14,
    color: '#1C2621',
    fontWeight: '500',
  },
  stepText: {
    fontSize: 13,
    color: '#717D75',
  },
  header: {
    marginBottom: 20,
  },
  teacherName: {
    fontSize: 28,
    fontFamily: 'serif',
    color: '#1C2621',
    marginBottom: 4,
  },
  teacherSubtitle: {
    fontSize: 14,
    color: '#5C6660',
  },
  dayScroll: {
    flexDirection: 'row',
    marginBottom: 24,
    maxHeight: 44,
  },
  dayPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4CDC3',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  dayPillActive: {
    backgroundColor: '#344C3D',
    borderColor: '#344C3D',
  },
  dayText: {
    fontSize: 14,
    color: '#1C2621',
    fontWeight: '500',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  dateHeading: {
    fontSize: 20,
    fontFamily: 'serif',
    color: '#1C2621',
    marginBottom: 16,
  },
  slotsList: {
    gap: 12,
  },
  slotCard: {
    borderWidth: 1,
    borderColor: '#D4CDC3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  slotCardActive: {
    backgroundColor: '#344C3D',
    borderColor: '#344C3D',
  },
  slotText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C2621',
  },
  slotTextActive: {
    color: '#FFFFFF',
  },
  bottomCard: {
    borderWidth: 1,
    borderColor: '#D4CDC3',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C2621',
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2621',
  },
  paymentButton: {
    backgroundColor: '#344C3D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  paymentMethodsSubtext: {
    fontSize: 12,
    color: '#717D75',
    textAlign: 'center',
  },
});
