import type { Metadata } from 'next';
import { Public_Sans, Lexend } from 'next/font/google';
import localFont from 'next/font/local';
import { PersonaProvider } from '@/lib/persona-context';
import { ToastProvider } from '@/components/toast/Toaster';
import { Proscenium } from '@/components/shell/Proscenium';
import { AppShell } from '@/components/shell/AppShell';
import { IdentityGate } from '@/components/shell/IdentityGate';
import './globals.css';

// Self-hosted at build via next/font — zero runtime font requests (PRD §9).
const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-public-sans',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-lexend',
  display: 'swap',
});

// next/font/google has no Material Symbols export; the variable woff2
// (axes FILL/GRAD/opsz/wght) is vendored in assets/fonts and served locally.
const materialSymbols = localFont({
  src: '../assets/fonts/material-symbols-outlined.woff2',
  variable: '--font-material-symbols',
  display: 'block',
  preload: true,
});

export const metadata: Metadata = {
  title: 'My Health Coach — Concept Demo',
  description:
    'Demonstration application for the CMS Health Tech Ecosystem "Patient-Facing Apps — Diabetes & Obesity" use case. Fictional data; not an official CMS product.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${lexend.variable} ${materialSymbols.variable}`}
    >
      <body>
        <a className="skiplink" href="#main">
          Skip to main content
        </a>
        <PersonaProvider>
          <ToastProvider>
            <Proscenium />
            <AppShell>{children}</AppShell>
            <IdentityGate />
          </ToastProvider>
        </PersonaProvider>
      </body>
    </html>
  );
}
