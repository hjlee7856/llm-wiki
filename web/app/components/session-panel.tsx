"use client";

import { Button, Card, Empty, Flex, List, Tag, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};

type SessionSummary = {
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

type SessionPanelProps = {
  sessions: SessionSummary[];
  selectedSessionId: string | null;
  deletingSessionId: string | null;
  running: boolean;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onStartFresh: () => void;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SessionPanel({
  sessions,
  selectedSessionId,
  deletingSessionId,
  running,
  onSelectSession,
  onDeleteSession,
  onStartFresh,
}: SessionPanelProps) {
  return (
    <Card className="glass-card session-panel-card" bordered={false}>
      <Flex justify="space-between" align="center" gap={12}>
        <Title level={4} style={{ margin: 0 }}>
          History
        </Title>
        <Button onClick={onStartFresh}>New chat</Button>
      </Flex>
      <Paragraph type="secondary" className="card-hint">
        각 항목은 세션의 첫 질문입니다. 클릭하면 해당 대화에서 이어집니다.
      </Paragraph>
      {sessions.length > 0 ? (
        <List
          className="session-list"
          dataSource={sessions}
          renderItem={(session) => {
            const isActive = session.sessionId === selectedSessionId;

            return (
              <List.Item className="session-list-item">
                <div
                  className={`session-button${isActive ? " is-active" : ""}`}
                >
                  <button
                    type="button"
                    className="session-select-button"
                    onClick={() => onSelectSession(session.sessionId)}
                  >
                    <Flex justify="space-between" align="center" gap={12}>
                      <Text strong className="session-title">
                        {session.title}
                      </Text>
                      {isActive ? <Tag color="green">active</Tag> : null}
                    </Flex>
                    <Text type="secondary" className="session-meta">
                      {formatTimestamp(session.updatedAt)} · {session.messages.length} items
                    </Text>
                  </button>
                  <Button
                    danger
                    type="text"
                    size="small"
                    title="Delete session"
                    aria-label="Delete session"
                    className="session-delete-button"
                    loading={deletingSessionId === session.sessionId}
                    disabled={running}
                    onClick={() => onDeleteSession(session.sessionId)}
                  >
                    <span aria-hidden="true">✕</span>
                  </Button>
                </div>
              </List.Item>
            );
          }}
        />
      ) : (
        <Empty
          description="저장된 세션이 아직 없습니다."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
}
