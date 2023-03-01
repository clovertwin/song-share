import AuthContext from "./AuthContext";
import RecoilWrapper from "./RecoilWrapper";
import { Inter } from "@next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export interface RootLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.className} h-full w-full`}>
      <AuthContext>
        <RecoilWrapper>
          <body>{children}</body>
        </RecoilWrapper>
      </AuthContext>
    </html>
  );
}
