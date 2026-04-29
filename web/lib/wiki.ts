import { promises as fs } from "fs";
import path from "path";

const DEFAULT_ALLOWED_EXTENSIONS = new Set([".md", ".txt", ".yaml", ".yml"]);
const DEFAULT_IGNORED_NAMES = new Set([
  ".git",
  ".next",
  "node_modules",
  ".obsidian",
  ".mempalace",
]);

export type WikiTreeNode = {
  name: string;
  path: string;
  type: "directory" | "file";
  children?: WikiTreeNode[];
};

export function getWikiRoot() {
  return path.resolve(process.cwd(), "..", "obsidian");
}

export function getRawRoot() {
  return path.join(getWikiRoot(), "raw");
}

export function resolveInsideWiki(relativePath: string) {
  const root = getWikiRoot();
  const safeRelative = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const absolute = path.resolve(root, safeRelative);

  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error("Path escapes wiki root.");
  }

  return { root, absolute, safeRelative };
}

export function resolveInsideRaw(relativePath: string) {
  const root = getRawRoot();
  const safeRelative = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const absolute = path.resolve(root, safeRelative);

  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error("Path escapes raw root.");
  }

  return { root, absolute, safeRelative };
}

export async function buildWikiTree(dir = getWikiRoot(), root = dir): Promise<WikiTreeNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nodes: WikiTreeNode[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (DEFAULT_IGNORED_NAMES.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);
    const relativePath = path.relative(root, absolutePath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      const children = await buildWikiTree(absolutePath, root);
      if (children.length > 0) {
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: "directory",
          children,
        });
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!DEFAULT_ALLOWED_EXTENSIONS.has(ext)) {
      continue;
    }

    nodes.push({
      name: entry.name,
      path: relativePath,
      type: "file",
    });
  }

  return nodes;
}

export async function readWikiFile(relativePath: string) {
  const { absolute, safeRelative } = resolveInsideWiki(relativePath);
  const ext = path.extname(absolute).toLowerCase();
  if (!DEFAULT_ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error("Unsupported file type.");
  }

  const content = await fs.readFile(absolute, "utf8");
  return {
    path: safeRelative,
    content,
  };
}

export async function buildRawTree() {
  await fs.mkdir(getRawRoot(), { recursive: true });
  return buildWikiTree(getRawRoot(), getRawRoot());
}

export async function readRawFile(relativePath: string) {
  const { absolute, safeRelative } = resolveInsideRaw(relativePath);
  const ext = path.extname(absolute).toLowerCase();
  if (!DEFAULT_ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error("Unsupported file type.");
  }

  const content = await fs.readFile(absolute, "utf8");
  return {
    path: safeRelative,
    content,
  };
}

export async function writeRawFile(relativePath: string, content: string) {
  const { absolute, safeRelative } = resolveInsideRaw(relativePath);
  const ext = path.extname(absolute).toLowerCase();
  if (!DEFAULT_ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error("Unsupported file type.");
  }

  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, content, "utf8");

  return {
    path: safeRelative,
    content,
  };
}

export async function createRawDirectory(relativePath: string) {
  const { absolute, safeRelative } = resolveInsideRaw(relativePath);
  await fs.mkdir(absolute, { recursive: true });
  return { path: safeRelative };
}

export async function createRawFile(relativePath: string, content = "") {
  const normalizedPath = path.extname(relativePath)
    ? relativePath
    : `${relativePath}.md`;
  return writeRawFile(normalizedPath, content);
}

export async function deleteRawEntry(relativePath: string) {
  const { absolute, safeRelative } = resolveInsideRaw(relativePath);
  await fs.rm(absolute, { recursive: true, force: true });
  return { path: safeRelative };
}
