'use client';

import { useState, Suspense } from 'react';
import ModelsClient from './ModelsClient';
import Image from 'next/image';

// Reuse types if possible, or redefine locally if not exported. 
// Ideally these should be in a types file, but for now we'll define minimal interfaces.
type ModelForGrid = any; // We let ModelsClient handle the specifics
type CollabForGrid = {
    collab_key: string;
    title: string | null;
    cover_url: string | null;
    model_keys?: string[];
    collaborator_profiles?: any[];
};

export default function CatalogTabs({
    models,
    collabs
}: {
    models: ModelForGrid[],
    collabs: CollabForGrid[]
}) {
    const [activeTab, setActiveTab] = useState<'models' | 'collabs'>('models');


    return (
        <>
            {/* Sticky Navigation Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(5, 5, 7, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--glass-border)',
                padding: '12px 0',
                marginBottom: 32,
                marginTop: -1
            }}>
                <div className="container" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>

                    {/* Tabs / Switcher */}
                    <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 999 }}>
                        <button
                            onClick={() => setActiveTab('models')}
                            className="nav-btn"
                            style={{
                                background: activeTab === 'models' ? 'var(--primary)' : 'transparent',
                                color: activeTab === 'models' ? 'white' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', gap: 8,
                                boxShadow: activeTab === 'models' ? '0 0 15px var(--primary-glow)' : 'none',
                                cursor: 'pointer', border: 'none'
                            }}
                        >
                            Modelos <span className="badge-pill" style={{
                                background: activeTab === 'models' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                                color: activeTab === 'models' ? 'white' : 'inherit'
                            }}>{models.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('collabs')}
                            className="nav-btn"
                            style={{
                                background: activeTab === 'collabs' ? 'var(--secondary)' : 'transparent',
                                color: activeTab === 'collabs' ? 'white' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', gap: 8,
                                boxShadow: activeTab === 'collabs' ? '0 0 15px var(--secondary-glow)' : 'none',
                                cursor: 'pointer', border: 'none'
                            }}
                        >
                            Collabs <span className="badge-pill" style={{
                                background: activeTab === 'collabs' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                                color: activeTab === 'collabs' ? 'white' : 'inherit'
                            }}>{collabs.length}</span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <a href="#vip-section" className="telegram-btn" style={{
                            padding: '8px 20px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                            borderRadius: 999, textDecoration: 'none'
                        }}>
                            <span>👑</span> Obtener VIP
                        </a>
                    </div>

                </div>
            </div>

            {/* Content Area */}
            <div style={{ minHeight: '600px' }}>
                {activeTab === 'models' ? (
                    <section id="models-view" className="fade-in">
                        <Suspense fallback={<div className="text-muted" style={{ padding: 20 }}>Cargando filtros...</div>}>
                            <ModelsClient models={models} />
                        </Suspense>
                    </section>
                ) : (
                    <section id="collabs-view" className="fade-in">
                        {/* Collabs Grid */}
                        <div className="toolbar-grid glass" style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span className="badge-pill" style={{ background: 'var(--secondary-glow)', color: 'white' }}>
                                    {collabs.length} Colaboraciones
                                </span>
                                <span className="text-muted" style={{ fontSize: 13 }}>
                                    Videos exclusivos multicasting
                                </span>
                            </div>
                        </div>

                        <div className="grid">
                            {collabs.map((c) => (
                                <a key={c.collab_key} className="card glass" href={`/collabs/${encodeURIComponent(c.collab_key)}`}>
                                    <div className="card-image-wrap">
                                        {c.cover_url ? (
                                            <Image
                                                className="card-image"
                                                src={c.cover_url}
                                                alt={c.collab_key}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%', height: '100%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: '#1a1a20', color: 'var(--text-dim)'
                                            }}>
                                                No Preview
                                            </div>
                                        )}

                                        <div className="card-overlay">
                                            <div className="card-title">
                                                {c.title || `Collab ${c.collab_key}`}
                                            </div>

                                            {/* Collaborator Profile Images */}
                                            {c.collaborator_profiles && c.collaborator_profiles.length > 0 && (
                                                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                                                    {c.collaborator_profiles.map((profile: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "50%",
                                                                overflow: "hidden",
                                                                border: "2px solid rgba(255,255,255,0.3)",
                                                                background: "#1a1a20"
                                                            }}
                                                            title={profile.model_key}
                                                        >
                                                            {profile.cover_url ? (
                                                                <Image
                                                                    src={profile.cover_url}
                                                                    alt={profile.model_key}
                                                                    width={32}
                                                                    height={32}
                                                                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                                                />
                                                            ) : (
                                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#666" }}>
                                                                    ?
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="card-subtitle" style={{ marginTop: 8 }}>
                                                {Array.isArray(c.model_keys)
                                                    ? `${c.model_keys.slice(0, 3).join(", ")}${c.model_keys.length > 3 ? "..." : ""}`
                                                    : "Multi-Model"}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
