import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Velora | Premium Fashion",
  description: "Curated collections of premium fashion and lifestyle pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased bg-[#FAF8F5]`}>
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
