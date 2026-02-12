'use client';

import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function AccessButton({ url }: { url: string }) {
    const { user, profile, openLoginModal } = useAuth();
    const { t } = useLanguage();

    if (!user) {
        return (
            <button
                onClick={openLoginModal}
                className="telegram-btn"
                style={{ background: 'linear-gradient(90deg, #333, #444)', border: '1px solid #666' }}
            >
                {t('login_required')}
            </button>
        );
    }

    // Authenticated Logic
    const isFemale = profile?.gender_detected === 'female';

    if (isFemale) {
        // "No les aparezcan los botones" - We return null or a generic "Restricted" text? 
        // User asked to "desaparecer", but layout-wise a small text explains why.
        // I'll return null to strictly follow "desaparecer", or maybe a very subtle text.
        // Given the context of "Adult" content, hiding completely for females is requested.
        return null;
    }

    // Male (or unknown?)
    // "en cuanto se verifique que sean hombres"
    const isVerified = profile?.is_verified;

    if (!isVerified) {
        return (
            <div
                className="telegram-btn"
                style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    color: '#fbbf24',
                    borderColor: 'rgba(251, 191, 36, 0.3)',
                    cursor: 'default'
                }}
            >
                {t('verify_pending')}
            </div>
        );
    }

    // Verified Male
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="telegram-btn"
        >
            {t('open_telegram')}
        </a>
    );
}
