"use client";

import { Card, Flex, Space, Tag, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

type HeroSectionProps = {
  sessionId: string | null;
};

export default function HeroSection({ sessionId }: HeroSectionProps) {
  return (
    <Card className="glass-card hero-card" bordered={false}>
      <div className="hero-split">
        <div>
          <Space size={[8, 8]} wrap>
            <Tag color="green">Codex CLI backed</Tag>
            <Tag color={sessionId ? "cyan" : "default"}>
              {sessionId ? "persistent session" : "new session"}
            </Tag>
          </Space>
          <Title level={1}>LLM Wiki GUI</Title>
          <Paragraph className="hero-copy">
            브라우저에서 로컬 위키 전체를 기본 컨텍스트로 질의하고,
            <code> codex exec </code> 진행 로그와 최근 응답을 함께 확인합니다.
          </Paragraph>
        </div>

        <Card className="context-card" bordered={false}>
          <Flex justify="space-between" align="center" gap={12}>
            <Title level={4} style={{ margin: 0 }}>
              Context
            </Title>
            <Text type="secondary">{sessionId ? "resume enabled" : "start fresh"}</Text>
          </Flex>
          <Paragraph type="secondary" className="card-hint">
            질문은 저장소 전체를 대상으로 처리합니다. 파일을 열면 우측에서 내용을
            확인하고, 현재 열린 파일 경로만 힌트로 함께 전달합니다.
          </Paragraph>
          <Paragraph type="secondary" className="card-hint">
            {sessionId
              ? `현재 세션: ${sessionId}`
              : "현재 저장된 Codex 세션이 없습니다. 첫 질문이 새 세션을 시작합니다."}
          </Paragraph>
        </Card>
      </div>
    </Card>
  );
}
