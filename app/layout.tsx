import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import TranslateOffsetFix from "@/components/TranslateOffsetFix";
import Footer from "@/components/Footer"; 

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

// Google Font Configuration (Plus Jakarta Sans)
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Toddyland Real Estate Sri Lanka",
  description: "Your Space. Your Kingdom. Your Freedom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* FontAwesome CDN Link */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />

        {/* Google Analytics Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-22KG6FP2P0"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-22KG6FP2P0');
            `,
          }}
        />

        {/* Google Translate Init Script Strategy fixed to beforeInteractive */}
        <Script
          id="google-translate-custom-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,ja,zh-CN,zh-TW,si',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
      </head>

      <body
        className={`${jakartaSans.variable} font-sans antialiased bg-white text-slate-900 flex flex-col min-h-screen`}
      >
        {/* Hidden Google Translate Mount Container placed before external script */}
        <div id="google_translate_element" style={{ display: "none" }}></div>

        {/* Google Translate External Library */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Page Content */}
        <main className="flex-grow pt-16">
          {children}
        </main>

        {/* Global Footer Bar */}
        <Footer /> 

        {/* Translation Layout Fix Component */}
        <TranslateOffsetFix />
      </body>
    </html>
  );
}