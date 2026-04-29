import { spawn } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  createRawDirectory,
  createRawFile,
  deleteRawEntry,
  readRawFile,
  readWikiFile,
  writeRawFile,
} from "@/lib/wiki";

const KORDOC_SUPPORTED_EXTENSIONS = new Set([
  ".hwp",
  ".hwpx",
  ".pdf",
  ".xlsx",
  ".docx",
]);

const DIRECT_TEXT_EXTENSIONS = new Set([".md", ".txt", ".yaml", ".yml"]);

function runKordoc(inputPath: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      "cmd.exe",
      ["/d", "/s", "/c", "npx", "-y", "kordoc", "--silent", "-o", outputPath, inputPath],
      {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stderr = "";

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr.trim() || "Kordoc conversion failed."));
    });
  });
}

async function convertUploadedFileToMarkdown(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (DIRECT_TEXT_EXTENSIONS.has(extension)) {
    return {
      content: await file.text(),
      outputName: extension === ".md" ? file.name : `${path.parse(file.name).name}.md`,
    };
  }

  if (!KORDOC_SUPPORTED_EXTENSIONS.has(extension)) {
    throw new Error("Unsupported upload type.");
  }

  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "raw-upload-"));
  const inputPath = path.join(tempDirectory, file.name);
  const outputName = `${path.parse(file.name).name}.md`;
  const outputPath = path.join(tempDirectory, outputName);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);
    await runKordoc(inputPath, outputPath);

    return {
      content: await fs.readFile(outputPath, "utf8"),
      outputName,
    };
  } finally {
    await fs.rm(tempDirectory, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function GET(request: NextRequest) {
  const relativePath = request.nextUrl.searchParams.get("path");
  const scope = request.nextUrl.searchParams.get("scope");

  if (!relativePath) {
    return NextResponse.json({ error: "Missing file path." }, { status: 400 });
  }

  try {
    const file =
      scope === "raw"
        ? await readRawFile(relativePath)
        : await readWikiFile(relativePath);
    return NextResponse.json(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const directory = String(formData.get("directory") || "");

      if (!(file instanceof File)) {
        throw new Error("Missing upload file.");
      }

      const converted = await convertUploadedFileToMarkdown(file);
      const targetPath = [directory, converted.outputName]
        .filter(Boolean)
        .join("/")
        .replace(/\\/g, "/");
      const created = await createRawFile(targetPath, converted.content);
      return NextResponse.json(created, { status: 201 });
    }

    const body = (await request.json()) as {
      kind?: "file" | "directory";
      path?: string;
      content?: string;
    };

    if (!body.path || !body.kind) {
      throw new Error("Missing create payload.");
    }

    if (body.kind === "directory") {
      const created = await createRawDirectory(body.path);
      return NextResponse.json(created, { status: 201 });
    }

    const created = await createRawFile(body.path, body.content || "");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      path?: string;
      content?: string;
    };

    if (!body.path || typeof body.content !== "string") {
      throw new Error("Missing update payload.");
    }

    const file = await writeRawFile(body.path, body.content);
    return NextResponse.json(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      path?: string;
    };

    if (!body.path) {
      throw new Error("Missing delete path.");
    }

    const result = await deleteRawEntry(body.path);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete entry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
