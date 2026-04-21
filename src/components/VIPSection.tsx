'use client';

import { useState } from 'react';
import Image from 'next/image';
import ClientText from './ClientText';

export default function VIPSection() {
    const [showQR, setShowQR] = useState(false);

    return (
        <>
            <section style={{
                padding: '60px 20px',
                background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.03) 0%, rgba(138, 43, 226, 0.03) 100%)',
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 50 }}>
                        <h2 style={{
                            fontSize: 42,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 12
                        }}>
                            <ClientText k="vip_title" defaultText="Acceso Premium" /> 👑
                        </h2>
                        <p style={{ fontSize: 16, color: '#999' }}>
                            <ClientText k="vip_desc" defaultText="Elige el plan que mejor se adapte a ti" />
                        </p>
                    </div>

                    {/* Main VIP Card - Featured */}
                    <div className="glass" style={{
                        padding: '40px',
                        borderRadius: 32,
                        border: '2px solid rgba(138, 43, 226, 0.3)',
                        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.08), rgba(255, 20, 147, 0.08))',
                        marginBottom: 32,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Glow effect */}
                        <div style={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 300,
                            height: 300,
                            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                            {/* Left side - Info */}
                            <div style={{ flex: '1 1 300px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '6px 16px',
                                    background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    marginBottom: 16,
                                    color: 'white'
                                }}>
                                    ⭐ <ClientText k="vip_popular" defaultText="MÁS POPULAR" />
                                </div>

                                <h3 style={{
                                    fontSize: 32,
                                    fontWeight: 700,
                                    marginBottom: 12,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12
                                }}>
                                    <ClientText k="vip_all_access" defaultText="🔥 VIP All Access" />
                                </h3>

                                <p style={{ fontSize: 15, color: '#bbb', marginBottom: 24, lineHeight: 1.6 }}>
                                    <ClientText k="vip_all_access_desc" defaultText="Acceso ilimitado a todo el contenido del catálogo..." />
                                </p>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                                    <span style={{
                                        fontSize: 48,
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #8a2be2, #ff1493)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        3,849
                                    </span>
                                    <span style={{ fontSize: 24, color: '#999' }}>⭐</span>
                                    <span style={{ fontSize: 14, color: '#666' }}><ClientText k="per_month" defaultText="/ mes" /></span>
                                </div>

                                <a
                                    href="https://t.me/+tk3NLsAASRQxMmMx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        padding: '14px 40px',
                                        background: 'linear-gradient(135deg, #8a2be2, #ff1493)',
                                        color: 'white',
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        textDecoration: 'none',
                                        boxShadow: '0 6px 25px rgba(138, 43, 226, 0.4)',
                                        transition: 'all 0.3s ease',
                                        border: 'none'
                                    }}
                                >
                                    <ClientText k="join_now" defaultText="Unirse Ahora" /> →
                                </a>
                            </div>

                            {/* Right side - Alternative payment */}
                            <div style={{
                                flex: '0 0 auto',
                                padding: 24,
                                background: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: 16,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                                minWidth: 200
                            }}>
                                <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
                                    💳 <ClientText k="alt_payment" defaultText="Métodos Alternativos" />
                                </div>
                                <div style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: '#ff1493',
                                    marginBottom: 8
                                }}>
                                    50% OFF
                                </div>
                                <div style={{ fontSize: 13, color: '#bbb', marginBottom: 16 }}>
                                    Crypto / PayPal
                                </div>

                                {/* Clickable QR */}
                                <div
                                    onClick={() => setShowQR(true)}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'relative',
                                        display: 'inline-block',
                                        marginBottom: 12
                                    }}
                                    title="Click para ampliar"
                                >
                                    <Image
                                        src="/qr-contact.png"
                                        alt="QR @ogibVIP"
                                        width={80}
                                        height={80}
                                        style={{
                                            borderRadius: 8,
                                            border: '2px solid rgba(255, 20, 147, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: -2,
                                        right: -2,
                                        width: 24,
                                        height: 24,
                                        background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        border: '2px solid #0a0a0f'
                                    }}>
                                        🔍
                                    </div>
                                </div>

                                <div style={{ fontSize: 11, color: '#666' }}>
                                    <ClientText k="contact" defaultText="Contacta:" /> <a href="https://t.me/ogibVIP" target="_blank" rel="noopener noreferrer" style={{ color: '#ff69b4', fontWeight: 600, textDecoration: 'none' }}>@ogibVIP</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VIP Paid Channels - 2 cols */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 16
                        }}>⭐ Grupos VIP de Pago</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

                            {/* Lives Guardados */}
                            <div className="glass" style={{
                                padding: 28,
                                borderRadius: 20,
                                border: '2px solid rgba(255, 20, 147, 0.2)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ fontSize: 36, marginBottom: 10 }}>📹</div>
                                <h3 style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    marginBottom: 8,
                                    color: 'white'
                                }}>
                                    <ClientText k="lives_saved" defaultText="Lives Guardados" />
                                </h3>
                                <p style={{ fontSize: 13, color: '#999', marginBottom: 16, lineHeight: 1.5 }}>
                                    <ClientText k="lives_saved_desc" defaultText="Canal con lives y streams grabados" />
                                </p>
                                <div style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: '#ff1493',
                                    marginBottom: 4
                                }}>
                                    800 ⭐
                                </div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
                                    <ClientText k="per_month" defaultText="/ mes" />
                                </div>
                                <a
                                    href="https://t.me/+Y8HxZR5SA4JhMzc5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                                        color: 'white',
                                        textAlign: 'center',
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        textDecoration: 'none'
                                    }}
                                >
                                    <ClientText k="join" defaultText="Unirse →" />
                                </a>
                            </div>

                            {/* Colegialas Reales VIP */}
                            <div className="glass" style={{
                                padding: 28,
                                borderRadius: 20,
                                border: '2px solid rgba(255, 100, 0, 0.3)',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 100, 0, 0.03)'
                            }}>
                                <div style={{ fontSize: 36, marginBottom: 10 }}>🎓</div>
                                <h3 style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    marginBottom: 8,
                                    color: 'white'
                                }}>
                                    Colegialas Reales VIP
                                </h3>
                                <p style={{ fontSize: 13, color: '#999', marginBottom: 16, lineHeight: 1.5 }}>
                                    Contenido exclusivo del grupo privado
                                </p>
                                <div style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: '#ff6400',
                                    marginBottom: 4
                                }}>
                                    800 ⭐
                                </div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
                                    <ClientText k="per_month" defaultText="/ mes" />
                                </div>
                                <a
                                    href="https://t.me/+7-g7qGC24CxkYjkx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, #ff6400, #ff9900)',
                                        color: 'white',
                                        textAlign: 'center',
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        textDecoration: 'none'
                                    }}
                                >
                                    <ClientText k="join" defaultText="Unirse →" />
                                </a>
                            </div>

                            {/* PiperBlus VIP */}
                            <div className="glass" style={{
                                padding: 28,
                                borderRadius: 20,
                                border: '2px solid rgba(100, 120, 255, 0.3)',
                                transition: 'all 0.3s ease',
                                background: 'rgba(100, 120, 255, 0.03)'
                            }}>
                                <div style={{ fontSize: 36, marginBottom: 10 }}>💎</div>
                                <h3 style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    marginBottom: 8,
                                    color: 'white'
                                }}>
                                    PiperBlus VIP
                                </h3>
                                <p style={{ fontSize: 13, color: '#999', marginBottom: 16, lineHeight: 1.5 }}>
                                    Contenido exclusivo del grupo privado
                                </p>
                                <div style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: '#6478ff',
                                    marginBottom: 4
                                }}>
                                    800 ⭐
                                </div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
                                    <ClientText k="per_month" defaultText="/ mes" />
                                </div>
                                <a
                                    href="https://t.me/+7waFVXQHUBFjZjlh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, #6478ff, #a855f7)',
                                        color: 'white',
                                        textAlign: 'center',
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        textDecoration: 'none'
                                    }}
                                >
                                    <ClientText k="join" defaultText="Unirse →" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Free / Info Channels - 3 cols */}
                    <div style={{ marginTop: 12 }}>
                        <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 16
                        }}>🆓 Canales Gratuitos</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>

                            {/* BigHot Global */}
                            <div className="glass" style={{
                                padding: 24,
                                borderRadius: 20,
                                border: '2px solid rgba(0, 255, 127, 0.3)',
                                transition: 'all 0.3s ease',
                                background: 'rgba(0, 255, 127, 0.03)'
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>🔥</div>
                                <h3 style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    marginBottom: 8,
                                    color: 'white'
                                }}>
                                    BigHot Global
                                </h3>
                                <p style={{ fontSize: 13, color: '#999', marginBottom: 16, lineHeight: 1.5 }}>
                                    Grupo público de previews y contenido
                                </p>
                                <div style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: '#00ff7f',
                                    marginBottom: 4
                                }}>
                                    GRATIS
                                </div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>acceso libre</div>
                                <a
                                    href="https://t.me/BigHot_Global"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        padding: '9px 20px',
                                        background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                                        color: '#000',
                                        textAlign: 'center',
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        fontSize: 13,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Unirse Gratis →
                                </a>
                            </div>

                            {/* Canal de Respaldo - BIGHOTANUNCIOS */}
                            <div className="glass" style={{
                                padding: 24,
                                borderRadius: 20,
                                border: '2px solid rgba(255, 200, 0, 0.3)',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 200, 0, 0.03)'
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>📢</div>
                                <h3 style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    marginBottom: 8,
                                    color: 'white'
                                }}>
                                    Canal de Respaldo
                                </h3>
                                <p style={{ fontSize: 13, color: '#999', marginBottom: 16, lineHeight: 1.5 }}>
                                    Si nuestros grupos son eliminados, aquí publicamos los nuevos links
                                </p>
                                <div style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: '#ffc800',
                                    marginBottom: 4
                                }}>
                                    GRATIS
                                </div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>¡Síguenos!</div>
                                <a
                                    href="https://t.me/BIGHOTANUNCIOS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        padding: '9px 20px',
                                        background: 'linear-gradient(135deg, #ffc800, #ff9900)',
                                        color: '#000',
                                        textAlign: 'center',
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        fontSize: 13,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Seguir Canal →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QR Modal */}
            {showQR && (
                <div
                    onClick={() => setShowQR(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 20,
                        textAlign: 'center',
                        maxWidth: 400
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src="/qr-contact.png"
                            alt="QR Code @ogibVIP"
                            width={300}
                            height={300}
                            style={{ borderRadius: 12 }}
                        />
                        <p style={{ marginTop: 16, fontSize: 16, color: '#333', fontWeight: 600 }}>
                            @ogibVIP - Telegram
                        </p>
                        <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                            <ClientText k="scan_contact" defaultText="Escanea para contactar directamente" />
                        </p>
                        <button
                            onClick={() => setShowQR(false)}
                            style={{
                                marginTop: 16,
                                padding: '10px 24px',
                                background: '#333',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            <ClientText k="close" defaultText="Cerrar" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
