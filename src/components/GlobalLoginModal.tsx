'use client';

import { useAuth } from "@/lib/AuthContext";
import LoginModal from "@/components/LoginModal";

export default function GlobalLoginModal() {
    const { isLoginModalOpen, closeLoginModal } = useAuth();
    return <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />;
}
