import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import { spawn } from "child_process";
import { NextRequest } from "next/server";
import { getWikiRoot } from "@/lib/wiki";

type CodexRequest = {
  prompt?: string;
  activePath?: string | null;
  sessionId?: string | null;
  mode?: "ask" | "bootstrap";
};

type StreamEvent =
  | { type: "status"; message: string }
  | { type: "session"; sessionId: string; resumed: boolean }
  | { type: "stdout"; chunk: string }
  | { type: "stderr"; chunk: string }
  | { type: "answer"; answer: string }
  | { type: "error"; message: string }
  | { type: "done"; code: number | null };

function getCodexBinary() {
  return process.env.CODEX_BIN || "C:\\nvm4w\\nodejs\\codex.cmd";
}

async function readOptionalUtf8(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function buildPrompt({ prompt, activePath }: Required<CodexRequest>) {
  const activeFileLine = activePath ? `Active file: ${activePath}` : null;

  return [
    "User request:",
    prompt,
    "",
    "Answer the user request directly.",
    "Do not acknowledge the repository rules or ask for another instruction.",
    "Use the local repository as context.",
    "Follow AGENTS.md rules silently.",
    "If this is a wiki-content question, read wiki/index.md first and then relevant files.",
    ...(activeFileLine ? [activeFileLine] : []),
  ].join("\n");
}

function buildBootstrapPrompt() {
  return "Reply with exactly: READY";
}

function buildResumePrompt({ prompt, activePath }: Required<CodexRequest>) {
  const activeFileLine = activePath ? `Active file: ${activePath}` : null;

  return [
    "User request:",
    prompt,
    "",
    "Answer the user request directly.",
    "Do not reply with acknowledgement, status-only text, or a request for another instruction.",
    "Use the local repository as context.",
    "Follow AGENTS.md rules silently.",
    "If this is a wiki-content question, read wiki/index.md first and then relevant files.",
    ...(activeFileLine ? [activeFileLine] : []),
  ].join("\n");
}

function encodeEvent(event: StreamEvent) {
  return `${JSON.stringify(event)}\n`;
}

function extractSessionId(text: string) {
  const match = text.match(/session id:\s*([0-9a-fA-F-]{36})/);
  return match?.[1] ?? null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CodexRequest;
  const mode = body.mode === "bootstrap" ? "bootstrap" : "ask";
  const prompt = body.prompt?.trim();

  if (mode === "ask" && !prompt) {
    return new Response(encodeEvent({ type: "error", message: "Prompt is required." }), {
      status: 400,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
      },
    });
  }

  const activePath = typeof body.activePath === "string" ? body.activePath : null;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  const wikiRoot = getWikiRoot();
  const tempOutputPath = path.join(os.tmpdir(), `codex-gui-${randomUUID()}.txt`);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const promptText = sessionId
        ? buildResumePrompt({
            prompt: prompt ?? "",
            activePath,
            sessionId,
            mode,
          })
        : mode === "bootstrap"
          ? buildBootstrapPrompt()
          : buildPrompt({
              prompt: prompt ?? "",
              activePath,
              sessionId,
              mode,
            });
      const cliArgs = sessionId
        ? [
            "exec",
            "resume",
            "--skip-git-repo-check",
            "--output-last-message",
            tempOutputPath,
            sessionId,
            "-",
          ]
        : [
            "exec",
            "--skip-git-repo-check",
            "--cd",
            wikiRoot,
            "--output-last-message",
            tempOutputPath,
            "-",
          ];

      const child = spawn("cmd.exe", ["/d", "/s", "/c", getCodexBinary(), ...cliArgs], {
        cwd: wikiRoot,
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdoutText = "";
      let stderrText = "";
      let closed = false;
      let seenSessionId: string | null = sessionId;

      const push = (event: StreamEvent) => {
        if (closed) {
          return;
        }
        controller.enqueue(encoder.encode(encodeEvent(event)));
      };

      push({
        type: "status",
        message: sessionId ? "기존 Codex 세션을 재개했습니다." : "Codex CLI를 새로 시작했습니다.",
      });

      const detectSession = (chunk: string) => {
        if (seenSessionId) {
          return;
        }
        const nextSessionId = extractSessionId(chunk);
        if (!nextSessionId) {
          return;
        }
        seenSessionId = nextSessionId;
        push({ type: "session", sessionId: nextSessionId, resumed: Boolean(sessionId) });
      };

      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk: string) => {
        stdoutText += chunk;
        detectSession(chunk);
        push({ type: "stdout", chunk });
      });

      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk: string) => {
        stderrText += chunk;
        detectSession(chunk);
        push({ type: "stderr", chunk });
      });

      child.stdin.write(promptText, "utf8");
      child.stdin.end();

      child.on("error", async (error) => {
        push({
          type: "error",
          message: error.message || "Failed to start Codex CLI.",
        });
        closed = true;
        controller.close();
        await fs.unlink(tempOutputPath).catch(() => undefined);
      });

      child.on("close", async (code) => {
        if (!seenSessionId) {
          const nextSessionId = extractSessionId(`${stdoutText}\n${stderrText}`);
          if (nextSessionId) {
            seenSessionId = nextSessionId;
            push({ type: "session", sessionId: nextSessionId, resumed: Boolean(sessionId) });
          }
        }

        const fileAnswer = (await readOptionalUtf8(tempOutputPath)).trim();
        const fallbackAnswer =
          fileAnswer ||
          stdoutText.trim() ||
          stderrText.trim() ||
          "Codex CLI finished without a final message.";

        push({ type: "answer", answer: fallbackAnswer });
        push({ type: "done", code });
        closed = true;
        controller.close();
        await fs.unlink(tempOutputPath).catch(() => undefined);
      });
    },
    cancel() {
      return fs.unlink(tempOutputPath).catch(() => undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
