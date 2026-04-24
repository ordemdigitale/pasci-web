import type { Metadata } from "next";
import { Karla, Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import SubMenu from "@/components/layout/SubMenu";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import PageTracker from "@/components/analytics/PageTracker";
import TextReader from "@/components/accessibility/TextReader";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Plateforme Digitale des OSC membres du CRASC ( PDOC )",
  description: "Plateforme Digitale des OSC membres du CRASC ( PDOC )",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${karla.variable} ${poppins.variable} antialiased`}>
      <body suppressHydrationWarning>
        <Navbar />
        <SubMenu />
        {children}
        <Footer />
        <TextReader />
        <PageTracker />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
