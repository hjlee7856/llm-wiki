"use client";

import { Button, Card, Empty, Flex, Input, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;
const { Text, Title } = Typography;

type FileViewerPanelProps = {
  loading: boolean;
  path: string | null;
  content: string | null;
  saving: boolean;
  deleting: boolean;
  onSave: (content: string) => void;
  onDelete: () => void;
};

export default function FileViewerPanel({
  loading,
  path,
  content,
  saving,
  deleting,
  onSave,
  onDelete,
}: FileViewerPanelProps) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDraft(content ?? "");
  }, [content, path]);

  const isDirty = content !== null && draft !== content;
  const lineCount = draft ? draft.split(/\r?\n/).length : 0;
  const charCount = draft.length;

  return (
    <Card className="glass-card file-viewer-card" variant="borderless">
      <div className="viewer-header">
        <Flex justify="space-between" align="center" gap={12}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Raw Editor
            </Title>
            <Text type="secondary">
              {path ? "선택한 raw 파일을 바로 편집합니다." : "파일을 열면 편집기가 활성화됩니다."}
            </Text>
          </div>
          <div className="viewer-header-meta">
            <span className={`status-pill${isDirty ? " is-dirty" : ""}`}>
              {isDirty ? "Unsaved" : "Saved"}
            </span>
            {path ? <span className="path-pill">{path}</span> : null}
          </div>
        </Flex>
      </div>
      {loading ? (
        <Flex justify="center" align="center" className="viewer-state">
          <Spin />
        </Flex>
      ) : content !== null ? (
        <div className="editor-shell">
          <div className="editor-meta-bar">
            <Text type="secondary">{lineCount} lines</Text>
            <Text type="secondary">{charCount} chars</Text>
          </div>
          <TextArea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="file-editor"
            autoSize={false}
          />
          <Space wrap size={[10, 10]} className="toolbar editor-toolbar">
            <Button
              type="primary"
              className="editor-action-button"
              loading={saving}
              disabled={!isDirty}
              onClick={() => onSave(draft)}
            >
              <span aria-hidden="true">↻</span>
              Save
            </Button>
            <Button
              danger
              className="editor-action-button"
              loading={deleting}
              onClick={onDelete}
            >
              <span aria-hidden="true">✕</span>
              Delete
            </Button>
          </Space>
        </div>
      ) : (
        <Empty
          description="파일 목록에서 문서를 선택하면 여기 표시됩니다."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
}
