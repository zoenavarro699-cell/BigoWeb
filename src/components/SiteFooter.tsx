'use client';

import { useState } from 'react';

export default function SiteFooter() {
    const [showTerms, setShowTerms] = useState(false);

    return (
        <>
            <div style={{
                textAlign: 'center',
                padding: '32px 0 48px',
                color: 'var(--text-dim)',
                fontSize: '12px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: 60
            }}>
                © 2026 Bigo Hot &nbsp;|&nbsp; 🔞 Solo +18 &nbsp;|&nbsp;
                <span
                    onClick={() => setShowTerms(true)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Términos y Condiciones
                </span>
            </div>

            {/* Terms Modal */}
            {showTerms && (
                <div
                    onClick={() => setShowTerms(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 10000, // Always on top
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        cursor: 'default'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="glass"
                        style={{
                            padding: 32,
                            borderRadius: 24,
                            maxWidth: 500,
                            border: '1px solid var(--glass-border)',
                            background: '#0a0a0f',
                            position: 'relative'
                        }}
                    >
                        <h3 style={{ marginTop: 0, fontSize: 20, color: '#fff' }}>Términos y Condiciones</h3>

                        <div style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, marginTop: 16 }}>
                            <p>
                                <strong>1. Catálogo Informativo:</strong> Este sitio web funciona exclusivamente como un catálogo visual e informativo. No se realizan transacciones monetarias, procesamientos de pago ni ventas directas dentro de esta plataforma ni en los servidores web asociados.
                            </p>
                            <p style={{ marginTop: 12 }}>
                                <strong>2. Mayoría de Edad (18+):</strong> El acceso a este sitio y a su contenido está estrictamente restringido a personas mayores de 18 años (o la mayoría de edad legal en su jurisdicción).
                            </p>
                            <p style={{ marginTop: 12 }}>
                                <strong>3. Enlaces Externos:</strong> Toda gestión de acceso a contenido privado, acuerdos o colaboraciones se realiza de manera externa a través de Telegram u otras plataformas de mensajería. Este sitio no se hace responsable de dichas interacciones externas.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowTerms(false)}
                            style={{
                                marginTop: 24,
                                width: '100%',
                                padding: '12px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 12,
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
