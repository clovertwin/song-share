import AuthContext from "./AuthContext";
import { Inter } from "@next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <AuthContext>
        <body>{children}</body>
      </AuthContext>
    </html>
  );
}
