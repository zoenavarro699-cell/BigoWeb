import "./globals.css";

export const metadata = {
  title: "Bigo Catalog",
  description: "Catálogo web conectado a Supabase. Accede a packs por modelo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="bg-gradient" />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
