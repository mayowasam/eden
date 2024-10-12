import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from "antd";
import Providers from "./_utils/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eden Lounge",
  description: "Eden Lounge Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Providers>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#4DAE37",
                    colorLink: "#4DAE37",
                    fontFamily: "var(--font-cabinet)",
                  },
                  components: {
                    Segmented: {
                      fontWeightStrong: 900
                    },
                    Carousel: {
                      arrowSize: 24
                    }
                  },
                }}

              >
                {children}
              </ConfigProvider>
            </AntdRegistry>
          </Providers>
      </body>
    </html>
  );
}
