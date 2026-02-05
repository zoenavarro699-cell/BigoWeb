'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function NavBar() {
    const { user, profile, loading, signOut } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <nav className="glass" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 24px', marginBottom: 24, borderRadius: 12
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>
                    <span style={{ color: '#fbbf24' }}>BIgHot</span> 🔥
                </div>
            </nav>

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </>
    );
}
