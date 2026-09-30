import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hacker House Live Board & Horn OK Please',
  description: 'Warm editorial minimalism collective dashboard and voice-controlled arcade.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink font-sans selection:bg-ink selection:text-cream">
        {children}
      </body>
    </html>
  );
}
