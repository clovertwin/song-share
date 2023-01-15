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
        <body className="h-screen flex justify-center items-center bg-neutral-200 crt relative">
          {children}
        </body>
      </AuthContext>
    </html>
  );
}
