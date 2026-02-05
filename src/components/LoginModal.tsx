'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { loadModels, detectFace, BiometricResult } from '@/lib/faceUtils';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState<'form' | 'camera' | 'forgot'>('form');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');

    // Camera State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [scanning, setScanning] = useState(false);

    // Feedback
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Load models once when opening modal if signup
    useEffect(() => {
        if (isOpen && isSignUp && !modelsLoaded) {
            loadModels().then(() => setModelsLoaded(true)).catch(console.error);
        }
    }, [isOpen, isSignUp, modelsLoaded]);

    // Clean up stream on close
    useEffect(() => {
        if (!isOpen && stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    }, [isOpen, stream]);

    if (!isOpen) return null;

    const startCamera = async () => {
        try {
            setStep('camera');
            const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
            }
        } catch (err) {
            setError('No se pudo acceder a la cámara. Verifica los permisos.');
        }
    };

    const captureAndVerify = async () => {
        if (!videoRef.current || !modelsLoaded) return;
        setScanning(true);
        setError('');

        try {
            const result = await detectFace(videoRef.current);
            if (!result) {
                setError('No se detectó ningún rostro. Asegúrate de tener buena iluminación.');
                setScanning(false);
                return;
            }

            if (result.score < 0.5) {
                setError('No se pudo verificar claramente el rostro. Intenta de nuevo.');
                setScanning(false);
                return;
            }

            // Success - Proceed to register
            await handleRegistration(result);
        } catch (err) {
            console.error(err);
            setError('Error al analizar biométricos.');
            setScanning(false);
        }
    };

    const handleRegistration = async (bio: BiometricResult) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        username: username,
                        age: bio.age,
                        gender: bio.gender, // 'male' or 'female'
                        score: bio.score,
                        is_verified: true,
                    },
                },
            });
            if (error) throw error;

            // Stop camera
            if (stream) stream.getTracks().forEach(t => t.stop());
            setStream(null);

            setMessage(`¡Cuenta creada! Género detectado: ${bio.gender === 'male' ? 'Hombre' : 'Mujer'} (${bio.age} años). Revisa tu email.`);
            setStep('form');
            setIsSignUp(false);
        } catch (err: any) {
            setError(err.message || 'Error en registro');
        } finally {
            setLoading(false);
            setScanning(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            onClose();
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
            });
            if (error) throw error;
            setMessage('Se ha enviado un correo de recuperación. Revisa tu bandeja.');
        } catch (err: any) {
            setError(err.message || 'Error al enviar correo');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignUp) {
            // Validate fields first
            if (!fullName.trim()) return setError('Nombre requerido');
            if (!username.trim()) return setError('Usuario requerido');
            // Go to camera step
            startCamera();
        } else {
            handleLogin(e);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                <h2>
                    {step === 'camera' ? 'Verificación Biométrica' : step === 'forgot' ? 'Recuperar Contraseña' : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')}
                </h2>

                {step === 'forgot' ? (
                    <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <p style={{ textAlign: 'center', fontSize: 13, color: '#ccc' }}>
                            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                        </p>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        {error && <div className="error-msg">{error}</div>}
                        {message && <div className="success-msg">{message}</div>}

                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Enlace'}
                        </button>

                        <button type="button" className="text-btn" onClick={() => setStep('form')}>
                            Volver al inicio
                        </button>
                    </form>
                ) : step === 'camera' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                        <div style={{
                            width: '100%', height: 300, background: '#000', borderRadius: 12, overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {!modelsLoaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 10 }}>Cargando modelos IA...</div>}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                onLoadedMetadata={() => videoRef.current?.play()}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {scanning && <div className="scanner-line"></div>}
                        </div>

                        <p style={{ textAlign: 'center', fontSize: 14, color: '#ccc' }}>
                            Por favor, mira a la cámara para verificar que eres una persona real.
                        </p>

                        {error && <div className="error-msg">{error}</div>}

                        <button
                            className="primary-btn"
                            onClick={captureAndVerify}
                            disabled={scanning || !modelsLoaded}
                            style={{ width: '100%' }}
                        >
                            {scanning ? 'Analizando...' : 'Capturar y Verificar'}
                        </button>

                        <button
                            className="text-btn"
                            onClick={() => {
                                setStep('form');
                                if (stream) stream.getTracks().forEach(t => t.stop());
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {isSignUp && (
                            <>
                                <div>
                                    <label>Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="input-field"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label>Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input-field"
                                        placeholder="Ej. juanperez99"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                            {!isSignUp && (
                                <div style={{ textAlign: 'right', marginTop: 4 }}>
                                    <button type="button" className="text-btn" style={{ fontSize: 12 }} onClick={() => setStep('forgot')}>
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && <div className="error-msg">{error}</div>}
                        {message && <div className="success-msg">{message}</div>}

                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Procesando...' : (isSignUp ? 'Siguiente: Verificación' : 'Entrar')}
                        </button>
                    </form>
                )}

                {step === 'form' && (
                    <div style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
                        {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        {' '}
                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); setError(''); }}
                        >
                            {isSignUp ? 'Inicia Sesión' : 'Regístrate'}
                        </button>

                        <div style={{ marginTop: 24, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11, color: '#888', lineHeight: '1.4' }}>
                            🔒 <strong>Privacidad:</strong> Los datos proporcionados son exclusivamente para fines de autenticación y verificación de edad. No se mostrarán públicamente. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento desde tu perfil.
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex; alignItems: center; justifyContent: center;
        }
        .modal-content {
          width: 90%; max-width: 400px;
          padding: 32px;
          position: relative;
          border-radius: 16px;
        }
        .close-btn {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; color: white; font-size: 24px; cursor: pointer;
        }
        .input-field {
          width: 100%;
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          margin-top: 4px;
        }
        .primary-btn {
          background: var(--primary-glow);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .text-btn {
          background: none; border: none; color: #fbbf24; cursor: pointer; text-decoration: underline;
        }
        .error-msg { color: #ff6b6b; font-size: 14px; text-align: center; }
        .success-msg { color: #4ade80; font-size: 14px; text-align: center; }
        .scanner-line {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: #fbbf24;
          box-shadow: 0 0 10px #fbbf24;
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
        </div>
    );
}
