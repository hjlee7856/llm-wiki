"use client";

import {
  Alert,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";

const { TextArea } = Input;
const { Text, Title } = Typography;

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};

type ChatPanelProps = {
  sessionId: string | null;
  messages: ChatMessage[];
  running: boolean;
  prompt: string;
  activityLog: string;
  showActivity: boolean;
  error: string | null;
  onPromptChange: (value: string) => void;
  onRun: () => void;
  onStop: () => void;
};

export default function ChatPanel({
  sessionId,
  messages,
  running,
  prompt,
  activityLog,
  showActivity,
  error,
  onPromptChange,
  onRun,
  onStop,
}: ChatPanelProps) {
  const threadRef = useRef<HTMLDivElement | null>(null);
  const [copiedMessageKey, setCopiedMessageKey] = useState<string | null>(null);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) {
      return;
    }

    thread.scrollTop = thread.scrollHeight;
  }, [messages, showActivity, activityLog]);

  async function copyMessage(messageKey: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedMessageKey(messageKey);
    window.setTimeout(() => {
      setCopiedMessageKey((current) =>
        current === messageKey ? null : current,
      );
    }, 1500);
  }

  return (
    <Card className="glass-card chat-card" bordered={false}>
      <Flex justify="space-between" align="center" gap={12}>
        <Title level={4} style={{ margin: 0 }}>
          Chat
        </Title>
        <Text type="secondary">
          {sessionId ? "resume enabled" : "start fresh"}
        </Text>
      </Flex>

      <div ref={threadRef} className="chat-thread">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <article
              key={`${message.createdAt}-${index}`}
              className={`chat-bubble ${message.role === "user" ? "is-user" : "is-assistant"}`}
            >
              <Flex justify="space-between" align="center" gap={12}>
                <Text strong type="secondary">
                  {message.role === "user" ? "You" : "Codex"}
                </Text>
                {message.role === "assistant" ? (
                  <Button
                    type="text"
                    size="small"
                    className="copy-button"
                    onClick={() =>
                      void copyMessage(
                        `${message.createdAt}-${index}`,
                        message.text,
                      )
                    }
                  >
                    <span aria-hidden="true">⧉</span>
                    {copiedMessageKey === `${message.createdAt}-${index}`
                      ? "Copied"
                      : "Copy"}
                  </Button>
                ) : null}
              </Flex>
              <div className="response-text">{message.text}</div>
            </article>
          ))
        ) : (
          <Empty
            description="질문과 응답이 여기 채팅 형태로 쌓입니다."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
        {showActivity ? (
          <article className="chat-bubble activity-bubble">
            <Flex gap={8} align="center">
              <Spin size="small" />
              <Text type="secondary">Codex가 응답을 생성하는 중입니다.</Text>
            </Flex>
            {activityLog ? (
              <pre className="viewer-block activity-inline">{activityLog}</pre>
            ) : (
              <Text type="secondary">CLI 진행 로그를 수집하는 중입니다.</Text>
            )}
          </article>
        ) : null}
      </div>

      <div className="compose-shell">
        {error ? <Alert type="error" message={error} showIcon /> : null}
        <TextArea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          autoSize={{ minRows: 6, maxRows: 14 }}
          placeholder="질문 또는 변경 요청을 입력하세요."
        />
        <Space wrap size={[10, 10]} className="toolbar">
          <Button type="primary" loading={running} onClick={onRun}>
            {running ? "생각 중..." : "전송하기"}
          </Button>
          {running ? (
            <Button
              danger
              aria-label="Stop"
              title="Stop"
              className="icon-button"
              onClick={onStop}
            >
              <span aria-hidden="true">■</span>
            </Button>
          ) : null}
        </Space>
      </div>
    </Card>
  );
}
