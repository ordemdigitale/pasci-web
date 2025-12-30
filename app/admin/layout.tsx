import React from 'react'
import { Karla, Poppins } from "next/font/google";
import "../globals.css";

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

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${karla.variable} ${poppins.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  )
}
