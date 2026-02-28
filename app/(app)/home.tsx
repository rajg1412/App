// app/(app)/home.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { registerForPushNotificationsAsync } from '../../hooks/usePushNotifications';

export default function HomeScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // Register for push notifications
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        savePushToken(token);
      }
    });
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? '');

        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (data) setUsername(data.username || '');
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePushToken = async (token: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, fcm_token: token });
    }
  };

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username.trim(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        Alert.alert('Update Failed', error.message);
      } else {
        Alert.alert('Success', 'Profile updated successfully! ✅');
      }
    }
    setUpdating(false);
  };

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile 👤</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>Your Account</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />

          <TouchableOpacity
            style={[styles.updateBtn, updating && { opacity: 0.7 }]}
            onPress={handleUpdateProfile}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateBtnText}>Update Profile</Text>
            )}
          </TouchableOpacity>
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
    padding: 24,
    marginBottom: 20,
  },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  email: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  updateBtn: {
    backgroundColor: '#6200ea',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  updateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
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
