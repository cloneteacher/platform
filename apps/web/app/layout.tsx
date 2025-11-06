import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { generateMetadata as genMeta } from "@/lib/utils/metadata";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://cloneteacher.com";

const baseMetadata = genMeta({
  title: "CloneTeacher - Plataforma Educativa con IA",
  description:
    "Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial. Ideal para estudiantes, profesores y administradores.",
  keywords: [
    "plataforma educativa",
    "LMS",
    "inteligencia artificial",
    "educación",
    "aprendizaje",
    "CloneTeacher",
    "cloneteacher",
    "sistema educativo",
    "gestión de aprendizaje",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(baseUrl),
  authors: [{ name: "CloneTeacher Team" }],
  creator: "CloneTeacher",
  publisher: "CloneTeacher",
  applicationName: "CloneTeacher",
  referrer: "origin-when-cross-origin",
  keywords: [
    "plataforma educativa",
    "LMS",
    "inteligencia artificial",
    "educación",
    "aprendizaje",
    "CloneTeacher",
    "cloneteacher",
    "sistema educativo",
    "gestión de aprendizaje",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  verification: {
    // Puedes agregar verification codes aquí cuando los tengas
    // google: "verification-code",
    // yandex: "verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CloneTeacher",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contacto@cloneteacher.com",
      contactType: "customer service",
    },
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
