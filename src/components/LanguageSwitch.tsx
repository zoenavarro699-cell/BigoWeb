'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageSwitch() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="glass-hover"
            style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: 8
            }}
        >
            {language === 'es' ? 'ES' : 'EN'}
        </button>
    );
}
