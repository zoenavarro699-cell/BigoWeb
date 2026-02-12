'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import ClientText from './ClientText';
import { useLanguage } from '@/lib/LanguageContext';

function ChangePasswordSection({ userEmail }: { userEmail: string | undefined }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(false);
    const { t } = useLanguage();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) return setError(t('password_min_length'));

        setLoading(true);
        setError('');
        setMsg('');

        try {
            // 1. Verify old password by attempting to sign in
            // Note: We use strictly the current user email
            if (!userEmail) throw new Error("No mail found");

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password: oldPassword
            });

            if (signInError) throw new Error("La contraseña actual es incorrecta.");

            // 2. If valid, update to new password
            const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
            if (updateError) throw updateError;

            setMsg(t('update_success'));
            setOldPassword('');
            setNewPassword('');
            setTimeout(() => setExpanded(false), 2000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (!expanded) {
        return (
            <>
                <button onClick={() => setExpanded(true)} className="glass-btn-secondary" style={{ width: '100%', marginBottom: 24 }}>
                    🔒 <ClientText k="change_password" defaultText="Cambiar Contraseña" />
                </button>
                <style jsx>{`
                .glass-btn-secondary {
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    color: #fff;
                    padding: 14px; 
                    border-radius: 12px; 
                    cursor: pointer; 
                    transition: all 0.3s ease; 
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
                .glass-btn-secondary:hover { 
                    background: rgba(255,255,255,0.08); 
                    border-color: rgba(255,255,255,0.2);
                    transform: translateY(-1px);
                }
                `}</style>
            </>
        );
    }

    return (
        <div style={{ background: '#0a0a0a', padding: 20, borderRadius: 12, marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 16, textAlign: 'center' }}><ClientText k="change_password" defaultText="Cambiar Contraseña" /></h4>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}><ClientText k="current_password" defaultText="Contraseña Actual" /></label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}><ClientText k="new_password" defaultText="Nueva Contraseña" /></label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="input-field"
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </div>

                {msg && <div style={{ color: '#4ade80', fontSize: 12, textAlign: 'center' }}>{msg}</div>}
                {error && <div style={{ color: '#ef4444', fontSize: 12, textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button type="submit" disabled={loading} className="primary-btn" style={{ flex: 1, padding: '10px' }}>
                        {loading ? '...' : <ClientText k="update_btn" defaultText="Actualizar" />}
                    </button>
                    <button type="button" onClick={() => setExpanded(false)} className="text-btn" style={{ padding: '0 12px' }}>
                        <ClientText k="cancel_btn" defaultText="Cancelar" />
                    </button>
                </div>
            </form>
            <style jsx>{`
                .input-field {
                   width: 100%; 
                   padding: 14px; 
                   background: rgba(0,0,0,0.3); 
                   border: 1px solid rgba(255,255,255,0.1);
                   color: white; 
                   border-radius: 10px; 
                   caret-color: #ec4899;
                   font-size: 14px;
                   transition: all 0.2s;
                }
                .input-field:focus { 
                    outline: none; 
                    border-color: #ec4899; 
                    background: rgba(0,0,0,0.5);
                    box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
                }
                .primary-btn {
                    background: linear-gradient(135deg, #f59e0b, #ec4899);
                    color: white; 
                    border: none; 
                    padding: 12px; 
                    border-radius: 10px; 
                    font-weight: 600; 
                    cursor: pointer;
                    transition: opacity 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3);
                }
                .primary-btn:hover { opacity: 0.9; }
                .text-btn {
                    background: transparent; 
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #ccc; 
                    padding: 12px; 
                    border-radius: 10px; 
                    cursor: pointer; 
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .text-btn:hover { 
                    background: rgba(255,255,255,0.05); 
                    color: white; 
                    border-color: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
}






export default function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { user, profile, signOut } = useAuth();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    if (!isOpen || !user) return null;

    const deletionDate = profile?.deletion_requested_at ? new Date(profile.deletion_requested_at) : null;
    const scheduledDate = deletionDate ? new Date(deletionDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null;

    const handleRequestDeletion = async () => {
        if (!confirm(t('delete_account_confirm'))) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ deletion_requested_at: new Date().toISOString() })
                .eq('id', user.id);
            if (error) throw error;
            window.location.reload();
        } catch (e: any) { setMsg('Error: ' + e.message); } finally { setLoading(false); }
    };

    const handleCancelDeletion = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ deletion_requested_at: null })
                .eq('id', user.id);
            if (error) throw error;
            window.location.reload();
        } catch (e: any) { setMsg('Error: ' + e.message); } finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                {/* Header Profile */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{
                        width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        fontSize: 40, fontWeight: 'bold', color: 'white', border: '4px solid rgba(255,255,255,0.1)'
                    }}>
                        {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{ margin: 0, fontSize: 24 }}>{profile?.username || 'Usuario'}</h2>
                    <p style={{ color: '#aaa', margin: '4px 0 12px', fontSize: 14 }}>{user.email}</p>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: 99,
                        background: profile?.is_verified ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                        color: profile?.is_verified ? '#4ade80' : '#fbbf24', fontSize: 12, border: '1px solid currentColor'
                    }}>
                        {profile?.is_verified ? <ClientText k="verified" defaultText="Verificado" /> : <ClientText k="pending" defaultText="Pendiente" />}
                    </div>
                </div>



                {/* Edit Profile Section */}


                {/* Password Section */}
                <ChangePasswordSection userEmail={user.email} />

                {/* Sign Out */}
                <button onClick={() => { signOut(); onClose(); }} className="glass-btn-secondary" style={{ width: '100%', marginBottom: 32, color: '#ccc' }}>
                    <ClientText k="logout" defaultText="Cerrar Sesión" />
                </button>

                {/* Deletion Zone (Small & Bottom) */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, textAlign: 'center' }}>
                    {scheduledDate ? (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 8, fontSize: 13 }}>
                            <p style={{ color: '#fca5a5', margin: '0 0 8px', fontWeight: 600 }}><ClientText k="delete_scheduled" defaultText="Eliminación programada:" /> {scheduledDate.toLocaleDateString()}</p>
                            <button onClick={handleCancelDeletion} disabled={loading} style={{
                                background: 'white', color: 'black', border: 'none', padding: '4px 12px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 600
                            }}>
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleRequestDeletion} disabled={loading} style={{
                            background: 'none', border: 'none', color: '#666', fontSize: 12, cursor: 'pointer', textDecoration: 'underline'
                        }}>
                            <ClientText k="delete_account_request" defaultText="Solicitar eliminar mi cuenta" />
                        </button>
                    )}
                    {msg && <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{msg}</p>}
                </div>

            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
                    z-index: 2000; display: flex; alignItems: center; justifyContent: center;
                }
                .modal-content {
                    width: 90%; max-width: 380px; padding: 32px; position: relative; border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: #09090b; /* Slightly lighter dark for depth */
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .close-btn {
                    position: absolute; top: 20px; right: 20px; background: none; border: none; color: #666; font-size: 24px; cursor: pointer; transition: color 0.2s;
                }
                .close-btn:hover { color: white; }
                
                /* Main Action Buttons (Change Password, Sign Out) */
                .glass-btn-secondary {
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    color: #fff;
                    padding: 14px; 
                    border-radius: 12px; 
                    cursor: pointer; 
                    transition: all 0.3s ease; 
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
                .glass-btn-secondary:hover { 
                    background: rgba(255,255,255,0.08); 
                    border-color: rgba(255,255,255,0.2);
                    transform: translateY(-1px);
                }

                /* Form Inputs */
                .input-field {
                   width: 100%; 
                   padding: 14px; 
                   background: rgba(0,0,0,0.3); 
                   border: 1px solid rgba(255,255,255,0.1);
                   color: white; 
                   border-radius: 10px; 
                   caret-color: #ec4899;
                   font-size: 14px;
                   transition: all 0.2s;
                }
                .input-field:focus { 
                    outline: none; 
                    border-color: #ec4899; 
                    background: rgba(0,0,0,0.5);
                    box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
                }

                /* Update / Submit Button */
                .primary-btn {
                    background: linear-gradient(135deg, #f59e0b, #ec4899);
                    color: white; 
                    border: none; 
                    padding: 12px; 
                    border-radius: 10px; 
                    font-weight: 600; 
                    cursor: pointer;
                    transition: opacity 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3);
                }
                .primary-btn:hover { opacity: 0.9; }
                
                /* Cancel Button */
                .text-btn {
                    background: transparent; 
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #ccc; 
                    padding: 12px; 
                    border-radius: 10px; 
                    cursor: pointer; 
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .text-btn:hover { 
                    background: rgba(255,255,255,0.05); 
                    color: white; 
                    border-color: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
}
