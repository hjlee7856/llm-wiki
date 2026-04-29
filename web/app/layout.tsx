import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdProvider from "./antd-provider";
import AppHeader from "./components/app-header";

export const metadata: Metadata = {
  title: "LLM Wiki GUI",
  description: "Next.js GUI for browsing the local wiki and querying it through Codex CLI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AntdProvider>
            <div className="root-shell">
              <AppHeader />
              <main className="page-shell">{children}</main>
            </div>
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
