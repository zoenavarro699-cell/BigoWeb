'use client';

import { useState } from 'react';
import ClientText from './ClientText';

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
                &copy; 2026 <ClientText k="brand_hot" defaultText="BIgHot 🔥" /> &nbsp;|&nbsp; 🔞 <ClientText k="age_warning" defaultText="Solo +18" /> &nbsp;|&nbsp;
                <span
                    onClick={() => setShowTerms(true)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    <ClientText k="terms_link" defaultText="Términos y Condiciones" />
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
                        <h3 style={{ marginTop: 0, fontSize: 20, color: '#fff' }}><ClientText k="terms_title" defaultText="Términos y Condiciones" /></h3>

                        <div style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, marginTop: 16 }}>
                            <p>
                                <strong><ClientText k="terms_1_title" defaultText="1. Catálogo Informativo:" /></strong> <ClientText k="terms_1_text" defaultText="Este sitio web funciona exclusivamente como un catálogo visual e informativo..." />
                            </p>
                            <p style={{ marginTop: 12 }}>
                                <strong><ClientText k="terms_2_title" defaultText="2. Mayoría de Edad (18+):" /></strong> <ClientText k="terms_2_text" defaultText="El acceso a este sitio..." />
                            </p>
                            <p style={{ marginTop: 12 }}>
                                <strong><ClientText k="terms_3_title" defaultText="3. Enlaces Externos:" /></strong> <ClientText k="terms_3_text" defaultText="Toda gestión de acceso..." />
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
                            <ClientText k="understood" defaultText="Entendido" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
