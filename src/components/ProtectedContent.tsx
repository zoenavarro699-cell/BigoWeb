'use client';

import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';
import { CSSProperties } from 'react';

export function ProtectedImage({ src, alt, style, className, onClick }: {
    src: string,
    alt: string,
    style?: CSSProperties,
    className?: string,
    onClick?: () => void
}) {
    const { profile } = useAuth();
    const isVerified = profile?.is_verified ?? false;
    const isFemale = profile?.gender_detected === 'female';

    let blurAmount = '0px';
    if (!isVerified) blurAmount = '15px';
    else if (isFemale) blurAmount = '5px';

    return (
        <div style={{ position: 'relative', width: style?.width || '100%', height: style?.height || '100%' }}>
            <img
                src={src}
                alt={alt}
                className={className}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                    ...style,
                    filter: `blur(${blurAmount})`,
                    transition: 'filter 0.3s ease',
                    userSelect: 'none',
                    pointerEvents: 'none'
                }}
                onClick={onClick}
            />
            {!isVerified && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 2
                }}>
                    <span style={{ fontSize: 20 }}>🔒</span>
                </div>
            )}
        </div>
    );
}

export function ProtectedCover({ src, alt }: { src: string, alt: string }) {
    const { profile } = useAuth();
    const isVerified = profile?.is_verified ?? false;
    const isFemale = profile?.gender_detected === 'female';

    let blurAmount = '0px';
    if (!isVerified) blurAmount = '20px';
    else if (isFemale) blurAmount = '8px';

    return (
        <>
            <Image
                src={src}
                alt={alt}
                fill
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                    objectFit: "cover",
                    objectPosition: "top",
                    filter: `blur(${blurAmount})`,
                    transition: 'filter 0.3s ease',
                    userSelect: 'none',
                    pointerEvents: 'none'
                }}
            />
            {!isVerified && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 10
                }}>
                    <span style={{ fontSize: 48 }}>🔒</span>
                </div>
            )}
        </>
    );
}
