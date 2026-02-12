'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { TranslationKey } from '@/lib/translations';

export default function ClientText({ k, defaultText }: { k: TranslationKey, defaultText?: string }) {
    const { t } = useLanguage();
    return <>{t(k) || defaultText}</>;
}
