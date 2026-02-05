'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Verificando...');

    useEffect(() => {
        const handleAuth = async () => {
            const code = searchParams.get('code');
            const next = searchParams.get('next') || '/';

            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    router.push(next);
                } catch (error: any) {
                    setStatus('Error de autenticación: ' + error.message);
                }
            } else {
                // Implicit flow or already logged in
                router.push(next);
            }
        };

        handleAuth();
    }, [router, searchParams]);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', flexDirection: 'column', gap: 16
        }}>
            <div className="loader"></div>
            <p>{status}</p>
            <style jsx>{`
                .loader {
                    border: 4px solid rgba(255,255,255,0.1);
                    border-left-color: #fbbf24;
                    border-radius: 50%;
                    width: 32px; height: 32px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div style={{ padding: 20 }}>Cargando inicio de sesión...</div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
