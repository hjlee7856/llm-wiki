"use client";

import { Button, Card, Empty, Flex, Space, Spin, Tag, Tree, Typography } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";

const { Paragraph, Title } = Typography;

type WikiSidebarProps = {
  treeData: DataNode[];
  loadingTree: boolean;
  rootCount: number;
  activePath: string | null;
  onSelect: TreeProps["onSelect"];
  onCreateFile?: () => void;
  onCreateDirectory?: () => void;
  onUploadFile?: () => void;
};

export default function WikiSidebar({
  treeData,
  loadingTree,
  rootCount,
  activePath,
  onSelect,
  onCreateFile,
  onCreateDirectory,
  onUploadFile,
}: WikiSidebarProps) {
  return (
    <Card className="glass-card sidebar-card" bordered={false}>
      <div className="sidebar-header">
        <Flex justify="space-between" align="center" gap={12}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Raw Files
            </Title>
            <Paragraph type="secondary" className="card-hint sidebar-copy">
              문서를 올리면 Markdown으로 변환해 `raw`에 저장합니다.
            </Paragraph>
          </div>
          <Tag bordered={false} color="green" className="sidebar-tag">
            {loadingTree ? "loading" : `${rootCount} roots`}
          </Tag>
        </Flex>
      </div>
      <div className="sidebar-actions">
        <Button size="small" className="sidebar-action-button" onClick={onCreateFile}>
          <span aria-hidden="true">＋</span>
          New file
        </Button>
        <Button size="small" className="sidebar-action-button" onClick={onCreateDirectory}>
          <span aria-hidden="true">⊞</span>
          New folder
        </Button>
        <Button size="small" className="sidebar-action-button is-primary" onClick={onUploadFile}>
          <span aria-hidden="true">↑</span>
          Upload file
        </Button>
      </div>
      {loadingTree ? (
        <Flex justify="center" align="center" className="tree-shell">
          <Spin size="small" />
        </Flex>
      ) : treeData.length > 0 ? (
        <div className="raw-tree-shell">
          <Tree
            blockNode
            defaultExpandAll
            treeData={treeData}
            selectedKeys={activePath ? [activePath] : []}
            onSelect={onSelect}
            className="wiki-tree"
          />
        </div>
      ) : (
        <Empty description="표시할 파일이 없습니다." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
}
