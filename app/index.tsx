import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#6200ea" />
            </View>
        );
    }

    if (session) {
        return <Redirect href="/(app)/home" />;
    } else {
        return <Redirect href="/(auth)/login" />;
    }
}
