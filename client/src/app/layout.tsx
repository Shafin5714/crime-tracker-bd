import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "../providers/StoreProvider";
import QueryProvider from "../providers/QueryProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crime Tracker BD",
  description: "Visualize and report crimes in Bangladesh",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
