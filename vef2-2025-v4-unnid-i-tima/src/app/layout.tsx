import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Verkefni 4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="wrapper">
          {children}
      </body>
    </html>
  );
}
