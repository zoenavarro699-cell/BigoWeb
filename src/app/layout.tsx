import "./globals.css";

export const metadata = {
  title: "Bigo Catalog",
  description: "Catálogo web conectado a Supabase. Accede a packs por modelo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
