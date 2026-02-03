'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AgeVerificationModal() {
    const [isVerified, setIsVerified] = useState(true); // Default to true to avoid flash

    useEffect(() => {
        // Check if user has already verified (stored in localStorage)
        const verified = localStorage.getItem('age_verified');
        if (!verified) {
            setIsVerified(false);
        }
    }, []);

    const handleContinue = () => {
        localStorage.setItem('age_verified', 'true');
        setIsVerified(true);
    };

    const handleExit = () => {
        window.location.href = 'https://www.google.com';
    };

    if (isVerified) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '2px solid rgba(255, 20, 147, 0.3)',
                borderRadius: 24,
                padding: '48px 32px',
                maxWidth: 480,
                width: '100%',
                boxShadow: '0 20px 60px rgba(255, 20, 147, 0.2)',
                textAlign: 'center'
            }}>
                {/* Warning Icon */}
                <div style={{
                    fontSize: 64,
                    marginBottom: 20
                }}>⚠️</div>

                {/* Title */}
                <h1 style={{
                    fontSize: 32,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 16
                }}>
                    Verificación de Edad
                </h1>

                {/* Message */}
                <p style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: '#e0e0e0',
                    marginBottom: 32
                }}>
                    Este sitio contiene contenido exclusivo para <strong>mayores de 18 años</strong>.
                    <br /><br />
                    Al continuar, confirmas que tienes la edad legal requerida para acceder a este tipo de contenido en tu jurisdicción.
                </p>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={handleExit}
                        style={{
                            padding: '14px 32px',
                            fontSize: 16,
                            fontWeight: 600,
                            borderRadius: 12,
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            background: 'transparent',
                            color: '#999',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = '#999';
                        }}
                    >
                        Salir
                    </button>

                    <button
                        onClick={handleContinue}
                        style={{
                            padding: '14px 32px',
                            fontSize: 16,
                            fontWeight: 600,
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(255, 20, 147, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 20, 147, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 20, 147, 0.4)';
                        }}
                    >
                        Soy Mayor de 18
                    </button>
                </div>

                {/* Footer */}
                <p style={{
                    fontSize: 12,
                    color: '#666',
                    marginTop: 24
                }}>
                    Politicas de privacidad y términos de uso aplicables
                </p>
            </div>
        </div>
    );
}
