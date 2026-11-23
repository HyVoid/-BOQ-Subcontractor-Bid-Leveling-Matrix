import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BOQ Bid Leveling Matrix — Theseus Workshop',
  description:
    'Construction subcontractor BOQ bid leveling, omission plug-rate normalization, and unbalanced pricing clarification matrix by Theseus Workshop.',
  openGraph: {
    title: 'BOQ Bid Leveling Matrix — Theseus Workshop',
    description:
      'Construction subcontractor BOQ bid leveling, omission plug-rate normalization, and unbalanced pricing clarification matrix.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOQ Bid Leveling Matrix — Theseus Workshop',
    description:
      'Construction subcontractor BOQ bid leveling, omission plug-rate normalization, and unbalanced pricing clarification matrix.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
