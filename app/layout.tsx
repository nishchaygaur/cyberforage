import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#040812",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cyberforage.space"),
  title: "Cyberforage — Explore. Build. Defend.",
  description:
    "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
  keywords: [
    "Cybersecurity",
    "Security Research",
    "AI",
    "Intelligent Automation",
    "Defensive Engineering",
    "SOC",
    "Threat Intelligence",
    "DFIR",
    "Open Source Security",
  ],
  authors: [{ name: "Cyberforage" }],
  creator: "Cyberforage",
  alternates: {
    canonical: "https://cyberforage.space",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cyberforage.space",
    siteName: "Cyberforage",
    title: "Cyberforage — Explore. Build. Defend.",
    description:
      "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cyberforage — Explore. Build. Defend.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyberforage — Explore. Build. Defend.",
    description:
      "Cyberforage is a technology ecosystem exploring cybersecurity, security research, AI, intelligent automation and defensive engineering.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname;
                  if (path && path.indexOf('/admin') === 0) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    return;
                  }
                  var key = 'cyberforage-theme';
                  var saved = localStorage.getItem(key);
                  var theme = saved || 'system';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                  if (resolved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased selection:bg-[#00F0C0]/20 selection:text-[#00F0C0] transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
