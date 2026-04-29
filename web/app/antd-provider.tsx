"use client";

import { App as AntdApp, ConfigProvider, theme } from "antd";
import type { PropsWithChildren } from "react";

export default function AntdProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0b6e4f",
          colorInfo: "#0b6e4f",
          colorSuccess: "#0b6e4f",
          colorBgBase: "#f6f1e7",
          colorTextBase: "#1d1b16",
          colorTextSecondary: "#6d6558",
          borderRadius: 18,
          borderRadiusLG: 24,
          fontFamily: '"Segoe UI", "Apple SD Gothic Neo", sans-serif',
        },
        components: {
          Layout: {
            bodyBg: "transparent",
            siderBg: "transparent",
            headerBg: "transparent",
          },
          Card: {
            colorBgContainer: "rgba(255, 251, 243, 0.9)",
          },
          Input: {
            activeBorderColor: "#0b6e4f",
            hoverBorderColor: "#0b6e4f",
          },
          Tree: {
            nodeSelectedBg: "rgba(11, 110, 79, 0.12)",
            nodeHoverBg: "rgba(11, 110, 79, 0.08)",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
