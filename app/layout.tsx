import AuthContext from "./AuthContext";
import { Inter } from "@next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export interface RootLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

/**
 * To use "crt" effect add this to the body tag
 * className="crt relative"
 */

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <AuthContext>
        <body>{children}</body>
      </AuthContext>
    </html>
  );
}
