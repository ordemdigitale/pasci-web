import type { Metadata } from "next";
import { Karla, Poppins } from "next/font/google";
import "../globals.css";
import AdminLayoutShell from "./AdminLayoutShell";

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
  title: "PDOC - Espace Administrateur",
  description: "Espace Administrateur de la Plateforme Digitale des OSC membres du CRASC (PDOC)"
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${karla.variable} ${poppins.variable} antialiased`}>
      <body>
        <AdminLayoutShell>
          {children}
        </AdminLayoutShell>
      </body>
    </html>
  )
}
