// app/(app)/home.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get the current user's email to display
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? '');
    });
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home 🏠</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>You're logged in! 🎉</Text>
          <Text style={styles.welcomeSubtitle}>Welcome back</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What's next?</Text>
          <Text style={styles.infoText}>
            I've successfully built a Login/Register app with Supabase auth.
           
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  logoutBtn: {
    backgroundColor: '#fde8e8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#e53935', fontWeight: '600', fontSize: 14 },
  content: { padding: 24 },
  card: {
    backgroundColor: '#6200ea',
    borderRadius: 20,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  email: {
    fontSize: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  infoText: { fontSize: 15, color: '#666', lineHeight: 22 },
});