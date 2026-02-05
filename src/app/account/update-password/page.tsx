'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import TopBar from '@/components/TopBar';
import SiteFooter from '@/components/SiteFooter';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Ensure session exists
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If no session, try to refresh or redirect
                console.log("No session found in Update Password Page");
            }
        });
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');

        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Force verify session before update
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Sesión expirada. Por favor solicita el enlace de nuevo.");

            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setMessage('¡Contraseña actualizada correctamente! Redirigiendo...');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al actualizar contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <TopBar />

            <div style={{
                minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20
            }}>
                <div className="glass" style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 16 }}>
                    <h1 style={{ marginBottom: 8, fontSize: 24, textAlign: 'center' }}>Nueva Contraseña</h1>
                    <p style={{ color: '#ccc', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>
                        Introduce tu nueva contraseña para asegurar tu cuenta.
                    </p>

                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                                style={{
                                    width: '100%', padding: 12, borderRadius: 8,
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', outline: 'none'
                                }}
                            />
                        </div>

                        {error && <div style={{ color: '#ff6b6b', fontSize: 13, textAlign: 'center' }}>{error}</div>}
                        {message && <div style={{ color: '#4ade80', fontSize: 13, textAlign: 'center' }}>{message}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(90deg, #f59e0b, #ec4899)',
                                color: 'white', border: 'none', padding: 14, borderRadius: 8,
                                fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Actualizando...' : 'Establecer Contraseña'}
                        </button>
                    </form>
                </div>
            </div>

            <SiteFooter />
        </main>
    );
}
