"use client";

import type { WikiTreeNode } from "@/lib/wiki";
import { Alert } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import FileViewerPanel from "../components/file-viewer-panel";
import WikiSidebar from "../components/wiki-sidebar";

type FileState = {
  path: string;
  content: string;
};

function toTreeData(nodes: WikiTreeNode[]): DataNode[] {
  return nodes.map((node) => ({
    key: node.path,
    title: node.name,
    isLeaf: node.type === "file",
    selectable: node.type === "file",
    children: node.children ? toTreeData(node.children) : undefined,
  }));
}

export default function FilesPage() {
  const [tree, setTree] = useState<WikiTreeNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [savingFile, setSavingFile] = useState(false);
  const [deletingFile, setDeletingFile] = useState(false);
  const [activeFile, setActiveFile] = useState<FileState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  async function refreshTree() {
    setLoadingTree(true);
    setError(null);

    try {
      const response = await fetch("/api/wiki/tree?scope=raw");
      const data = (await response.json()) as {
        tree?: WikiTreeNode[];
        error?: string;
      };

      if (!response.ok || !data.tree) {
        throw new Error(data.error || "Failed to load raw tree.");
      }

      setTree(data.tree);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to load raw tree.",
      );
    } finally {
      setLoadingTree(false);
    }
  }

  function getDefaultDirectory() {
    if (!activeFile?.path) {
      return "";
    }

    const segments = activeFile.path.split("/");
    segments.pop();
    return segments.join("/");
  }

  useEffect(() => {
    void refreshTree();
  }, []);

  async function openFile(path: string) {
    setLoadingFile(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/wiki/file?scope=raw&path=${encodeURIComponent(path)}`,
      );
      const data = (await response.json()) as FileState & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to read file.");
      }

      setActiveFile({ path: data.path, content: data.content });
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Failed to read file.",
      );
    } finally {
      setLoadingFile(false);
    }
  }

  async function saveFile(content: string) {
    if (!activeFile) {
      return;
    }

    setSavingFile(true);
    setError(null);

    try {
      const response = await fetch("/api/wiki/file", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: activeFile.path,
          content,
        }),
      });
      const data = (await response.json()) as FileState & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save file.");
      }

      setActiveFile({ path: data.path, content: data.content });
      await refreshTree();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Failed to save file.",
      );
    } finally {
      setSavingFile(false);
    }
  }

  async function deleteFile() {
    if (!activeFile) {
      return;
    }

    const confirmed = window.confirm(`${activeFile.path} 파일을 삭제할까요?`);
    if (!confirmed) {
      return;
    }

    setDeletingFile(true);
    setError(null);

    try {
      const response = await fetch("/api/wiki/file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: activeFile.path,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete file.");
      }

      setActiveFile(null);
      await refreshTree();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to delete file.",
      );
    } finally {
      setDeletingFile(false);
    }
  }

  async function createFile() {
    const baseDir = getDefaultDirectory();
    const input = window.prompt(
      "raw 기준 새 파일 경로를 입력하세요. 확장자가 없으면 .md가 붙습니다.",
      baseDir ? `${baseDir}/new-note.md` : "new-note.md",
    );

    if (!input) {
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/wiki/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "file",
          path: input,
          content: "",
        }),
      });
      const data = (await response.json()) as FileState & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to create file.");
      }

      await refreshTree();
      setActiveFile({ path: data.path, content: data.content });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to create file.",
      );
    }
  }

  async function createDirectory() {
    const baseDir = getDefaultDirectory();
    const input = window.prompt(
      "raw 기준 새 폴더 경로를 입력하세요.",
      baseDir ? `${baseDir}/new-folder` : "new-folder",
    );

    if (!input) {
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/wiki/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "directory",
          path: input,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to create folder.");
      }

      await refreshTree();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to create folder.",
      );
    }
  }

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("directory", getDefaultDirectory());

      const response = await fetch("/api/wiki/file", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as FileState & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file.");
      }

      await refreshTree();
      setActiveFile({ path: data.path, content: data.content });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to upload file.",
      );
    } finally {
      event.target.value = "";
    }
  }

  const handleTreeSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    if (!info.node.isLeaf) {
      return;
    }

    const selectedPath = selectedKeys[0];
    if (typeof selectedPath === "string") {
      void openFile(selectedPath);
    }
  };

  return (
    <div className="files-page">
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <div className="workspace-grid">
        <WikiSidebar
          treeData={toTreeData(tree)}
          loadingTree={loadingTree}
          rootCount={tree.length}
          activePath={activeFile?.path ?? null}
          onSelect={handleTreeSelect}
          onCreateFile={() => void createFile()}
          onCreateDirectory={() => void createDirectory()}
          onUploadFile={() => uploadInputRef.current?.click()}
        />
        <FileViewerPanel
          loading={loadingFile}
          path={activeFile?.path ?? null}
          content={activeFile?.content ?? null}
          saving={savingFile}
          deleting={deletingFile}
          onSave={(content) => void saveFile(content)}
          onDelete={() => void deleteFile()}
        />
      </div>
      <input
        ref={uploadInputRef}
        type="file"
        accept=".md,.txt,.yml,.yaml,.pdf,.docx,.xlsx,.hwp,.hwpx,text/markdown,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden-file-input"
        onChange={(event) => void uploadFile(event)}
      />
    </div>
  );
}
