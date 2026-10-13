import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteFrame } from "@/components/site-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEPPI | Extensão IFCE Cedro",
  description: "Cursos e oportunidades de extensão do IFCE Campus Cedro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${interTight.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
