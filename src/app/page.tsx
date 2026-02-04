import { listModels, listCollabs } from "@/lib/queries";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import VIPSection from "@/components/VIPSection";
import CatalogTabs from "@/components/CatalogTabs";
import SiteFooter from "@/components/SiteFooter";
import { Suspense } from "react";

export const revalidate = 30;

export default async function HomePage() {
  const [models, collabs] = await Promise.all([listModels(), listCollabs()]);

  return (
    <main>
      <AgeVerificationModal />

      <div className="nav glass">
        <div className="brand">
          <div className="brand-dot" />
          <div className="brand-name text-gradient">Bigo Hot 🔥</div>
        </div>

        {/* Simple top links could go here if needed, but we have tabs below now */}
      </div>

      <div className="hero">
        <h1 className="text-gradient">Catálogo Exclusivo</h1>
        <p>Explora nuestra colección premium. Entra por modelo y accede a sus packs privados en Telegram.</p>
      </div>

      {/* Main Tabbed Layout */}
      <div style={{ minHeight: '100vh' }}>
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Cargando catálogo...</div>}>
          <CatalogTabs models={models} collabs={collabs} />
        </Suspense>
      </div>

      <div className="divider" />

      {/* Wrapped VIP Section for scroll target */}
      <div id="vip-section" style={{ scrollMarginTop: 100 }}>
        <VIPSection />
      </div>

      <SiteFooter />
    </main>
  );
}
