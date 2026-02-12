'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import ProfileModal from '@/components/ProfileModal';
import LanguageSwitch from './LanguageSwitch';
import ClientText from './ClientText';

export default function TopBar() {
    const { user, profile, loading, openLoginModal } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
            <div className="nav glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="brand-dot" />
                    <div className="brand-name text-gradient">
                        <ClientText k="brand_hot" defaultText="Bigo Hot 🔥" />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ marginLeft: 8 }}>
                        <LanguageSwitch />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginLeft: 'auto' }}>
                    {!loading && (
                        <>
                            {user ? (
                                <button
                                    onClick={() => setShowProfile(true)}
                                    className="glass-hover"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '6px 16px', borderRadius: 99,
                                        border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.05)', transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ textAlign: 'right', fontSize: 13 }}>
                                        <div style={{ fontWeight: 600, color: 'white' }}>{profile?.username || user.email?.split('@')[0]}</div>
                                        <div style={{ fontSize: 11, color: profile?.is_verified ? '#4ade80' : '#fbbf24' }}>
                                            {profile?.is_verified ? <ClientText k="verified" defaultText="Verificado" /> : <ClientText k="pending" defaultText="Pendiente" />}
                                        </div>
                                    </div>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                    }}>
                                        {profile?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={openLoginModal}
                                    style={{
                                        background: 'linear-gradient(90deg, #f59e0b, #ec4899)',
                                        color: 'white', fontWeight: 600,
                                        padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                                    }}
                                >
                                    <ClientText k="login_title" defaultText="Entrar / Registro" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </>
    );
}
