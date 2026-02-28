// app/(auth)/register.tsx
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    // Call Supabase register
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else if (data.session) {
      // Session exists = user is logged in directly
      router.replace('/(app)/home');
    } else {
      // No session = email confirmation is required
      Alert.alert(
        'Check Your Email! 📧',
        'We sent a confirmation link to your email. Please verify to continue.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Create Account</Text>
          }
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text style={styles.link}>Login</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 36 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6200ea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#888', fontSize: 15 },
  link: { color: '#6200ea', fontWeight: '600', fontSize: 15 },
});