import "./globals.css";

export const metadata = {
  title: "Bigo Hot 🔥 - Contenido Exclusivo",
  description: "Catálogo premium de contenido exclusivo. Accede a packs por modelo y colaboraciones VIP.",
  icons: {
    icon: '/icon.png',
  },
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
