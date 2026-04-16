import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Arenda LUX | Премиальная недвижимость",
  description: "Аренда элитных домов, апартаментов и коммерческих помещений в Казахстане.",
};

import { LanguageProvider } from "@/lib/i18n";
import ContactButtons from "@/components/ui/ContactButtons";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>
          {children}
          <ContactButtons />
        </LanguageProvider>
      </body>
    </html>
  );
}
