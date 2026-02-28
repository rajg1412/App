import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { JWT } from "https://esm.sh/google-auth-library@8.7.0"

serve(async (req) => {
    try {
        const { record } = await req.json()
        const fcmToken = record.fcm_token

        if (!fcmToken) {
            return new Response(JSON.stringify({ message: 'No FCM token found' }), { status: 200 })
        }

        // Get FCM secrets from Supabase Env
        const clientEmail = Deno.env.get('FCM_CLIENT_EMAIL')
        const privateKey = Deno.env.get('FCM_PRIVATE_KEY')?.replace(/\\n/g, '\n')
        const projectId = Deno.env.get('FCM_PROJECT_ID')

        if (!clientEmail || !privateKey || !projectId) {
            throw new Error('Missing FCM configuration secrets')
        }

        // Authenticate with Google API
        const auth = new JWT(
            clientEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/cloud-platform']
        )

        const token = await auth.authorize()
        const accessToken = token.access_token

        // Send notification via FCM V1
        const fcmResponse = await fetch(
            `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    message: {
                        token: fcmToken,
                        notification: {
                            title: 'Profile Updated ✅',
                            body: 'Your profile has been updated successfully!',
                        },
                    },
                }),
            }
        )

        const result = await fcmResponse.json()
        console.log('FCM Result:', result)

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        console.error('Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
