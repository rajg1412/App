// app/(auth)/login.tsx
import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);

        // Call Supabase login
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });

        setLoading(false);

        if (error) {
            // Show the error from Supabase
            Alert.alert('Login Failed', error.message);
        } else {
            // Navigate to home screen
            router.replace('/(app)/home');
        }
    };

    return (
        // KeyboardAvoidingView pushes content up when keyboard opens
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.inner}>
                {/* Header */}
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>Login to your account</Text>

                {/* Email Input */}
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

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.buttonText}>Login</Text>
                    }
                </TouchableOpacity>

                {/* Link to Register */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/(auth)/register">
                        <Text style={styles.link}>Register</Text>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 36,
    },
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
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#888',
        fontSize: 15,
    },
    link: {
        color: '#6200ea',
        fontWeight: '600',
        fontSize: 15,
    },
});