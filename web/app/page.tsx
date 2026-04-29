"use client";

import { useEffect, useRef, useState } from "react";
import ChatPanel from "./components/chat-panel";
import SessionPanel from "./components/session-panel";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};

type StoredSession = {
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

type StreamEvent =
  | { type: "status"; message: string }
  | { type: "session"; sessionId: string; resumed: boolean }
  | { type: "stdout"; chunk: string }
  | { type: "stderr"; chunk: string }
  | { type: "answer"; answer: string }
  | { type: "error"; message: string }
  | { type: "done"; code: number | null };

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [activityLog, setActivityLog] = useState("");
  const [running, setRunning] = useState(false);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);
  const skipNextSessionPersistRef = useRef(false);
  const storageKey = "codexGuiSessionId.v2";
  const sessionsKey = "codexGuiSessions.v1";

  function makeMessage(role: ChatMessage["role"], text: string): ChatMessage {
    return {
      role,
      text,
      createdAt: new Date().toISOString(),
    };
  }

  function appendMessage(role: ChatMessage["role"], text: string) {
    setMessages((current) => [...current, makeMessage(role, text)]);
  }

  function buildSessionTitle(
    nextMessages: ChatMessage[],
    nextSessionId: string,
  ) {
    const firstUserMessage = nextMessages.find(
      (message) => message.role === "user",
    );
    return (
      firstUserMessage?.text.slice(0, 48) ||
      `Session ${nextSessionId.slice(0, 8)}`
    );
  }

  function appendLog(chunk: string) {
    setActivityLog((current) => `${current}${chunk}`);
  }

  function isContextLimitMessage(text: string) {
    const normalized = text.toLowerCase();
    return (
      normalized.includes("context length") ||
      normalized.includes("context window") ||
      normalized.includes("maximum context") ||
      normalized.includes("too many tokens") ||
      normalized.includes("maximum number of tokens") ||
      normalized.includes("prompt is too long")
    );
  }

  function makeContextLimitNotice() {
    return "현재 대화의 컨텍스트 한도를 초과했습니다. 새 대화로 시작해 주세요.";
  }

  useEffect(() => {
    const savedSessionsRaw =
      typeof window !== "undefined"
        ? window.localStorage.getItem(sessionsKey)
        : null;
    const savedSessions = savedSessionsRaw
      ? (JSON.parse(savedSessionsRaw) as StoredSession[])
      : [];
    setSessions(savedSessions);

    const savedSessionId =
      typeof window !== "undefined"
        ? window.localStorage.getItem(storageKey)
        : null;
    if (savedSessionId) {
      const matchedSession = savedSessions.find(
        (session) => session.sessionId === savedSessionId,
      );
      setSessionId(savedSessionId);
      setSelectedSessionId(savedSessionId);
      if (matchedSession) {
        setMessages(matchedSession.messages);
      }
      appendLog(`[session] restored ${savedSessionId}\n`);
    }

    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(sessionsKey, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    if (skipNextSessionPersistRef.current) {
      skipNextSessionPersistRef.current = false;
      return;
    }

    setSessions((current) => {
      const nextUpdatedAt = new Date().toISOString();
      const existing = current.find(
        (session) => session.sessionId === sessionId,
      );
      const nextSession: StoredSession = {
        sessionId,
        title: buildSessionTitle(messages, sessionId),
        createdAt: existing?.createdAt ?? nextUpdatedAt,
        updatedAt: nextUpdatedAt,
        messages,
      };

      const remaining = current.filter(
        (session) => session.sessionId !== sessionId,
      );
      return [nextSession, ...remaining].sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime(),
      );
    });
  }, [messages, sessionId]);

  async function runCodex() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRunning(true);
    setWaitingForAnswer(true);
    setError(null);
    setActivityLog("");
    appendMessage("user", prompt);
    setPrompt("");

    try {
      const response = await fetch("/api/codex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "ask",
          prompt,
          activePath: null,
          sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
        throw new Error(text || "Failed to run Codex CLI.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answerCaptured = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const event = JSON.parse(line) as StreamEvent;

          if (event.type === "status") {
            appendLog(`[status] ${event.message}\n`);
            continue;
          }

          if (event.type === "session") {
            setSessionId(event.sessionId);
            setSelectedSessionId(event.sessionId);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(storageKey, event.sessionId);
            }
            appendLog(
              `[session] ${event.resumed ? "resumed" : "started"} ${event.sessionId}\n`,
            );
            continue;
          }

          if (event.type === "stdout") {
            appendLog(event.chunk);
            continue;
          }

          if (event.type === "stderr") {
            appendLog(event.chunk);
            continue;
          }

          if (event.type === "answer") {
            const rawAnswer =
              event.answer.trim() || "응답 본문이 비어 있습니다.";
            const finalAnswer = isContextLimitMessage(rawAnswer)
              ? makeContextLimitNotice()
              : rawAnswer;
            answerCaptured = true;
            setWaitingForAnswer(false);
            if (finalAnswer !== rawAnswer) {
              setError(makeContextLimitNotice());
            }
            appendMessage("assistant", finalAnswer);
            continue;
          }

          if (event.type === "error") {
            const nextMessage = isContextLimitMessage(event.message)
              ? makeContextLimitNotice()
              : event.message;
            setError(nextMessage);
            appendLog(`[error] ${event.message}\n`);
            continue;
          }

          if (event.type === "done") {
            appendLog(`\n[done] exit code: ${event.code ?? "unknown"}\n`);
          }
        }
      }

      if (buffer.trim()) {
        const event = JSON.parse(buffer) as StreamEvent;
        if (event.type === "answer") {
          const rawAnswer =
            event.answer.trim() || "응답 본문이 비어 있습니다.";
          const finalAnswer = isContextLimitMessage(rawAnswer)
            ? makeContextLimitNotice()
            : rawAnswer;
          answerCaptured = true;
          setWaitingForAnswer(false);
          if (finalAnswer !== rawAnswer) {
            setError(makeContextLimitNotice());
          }
          appendMessage("assistant", finalAnswer);
        }
      }

      if (!answerCaptured) {
        setWaitingForAnswer(false);
        appendMessage("assistant", "응답 본문이 비어 있습니다.");
      }
    } catch (nextError) {
      if (nextError instanceof Error && nextError.name === "AbortError") {
        setWaitingForAnswer(false);
        appendLog("\n[status] 이전 요청을 중단했습니다.\n");
      } else {
        const message =
          nextError instanceof Error
            ? nextError.message
            : "Failed to run Codex CLI.";
        setWaitingForAnswer(false);
        setError(message);
        appendLog(`[error] ${message}\n`);
      }
    } finally {
      setRunning(false);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }

  function stopCodex() {
    abortRef.current?.abort();
  }

  function resetSession() {
    setSessionId(null);
    setSelectedSessionId(null);
    setMessages([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
    appendLog(
      "[status] 세션을 초기화했습니다. 다음 질문은 새 세션으로 시작됩니다.\n",
    );
  }

  function selectSession(nextSessionId: string) {
    const nextSession = sessions.find(
      (session) => session.sessionId === nextSessionId,
    );
    if (!nextSession) {
      return;
    }

    skipNextSessionPersistRef.current = true;
    setSessionId(nextSession.sessionId);
    setSelectedSessionId(nextSession.sessionId);
    setMessages(nextSession.messages);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, nextSession.sessionId);
    }
  }

  async function deleteSession(targetSessionId: string) {
    setDeletingSessionId(targetSessionId);

    try {
      const response = await fetch("/api/codex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "ask",
          prompt: "/clear",
          activePath: null,
          sessionId: targetSessionId,
        }),
      });

      if (!response.ok) {
        appendLog(
          `[error] 세션 ${targetSessionId}에 /clear 전송 실패: ${response.status}\n`,
        );
      } else {
        appendLog(`[status] 세션 ${targetSessionId}에 /clear를 전송했습니다.\n`);
      }
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Failed to clear the selected session.";
      appendLog(`[error] ${message}\n`);
    } finally {
      setSessions((current) =>
        current.filter((session) => session.sessionId !== targetSessionId),
      );

      if (sessionId === targetSessionId) {
        setSessionId(null);
        setSelectedSessionId(null);
        setMessages([]);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(storageKey);
        }
      }

      setDeletingSessionId(null);
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-layout">
        <SessionPanel
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          deletingSessionId={deletingSessionId}
          running={running}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onStartFresh={resetSession}
        />
        <ChatPanel
          sessionId={sessionId}
          messages={messages}
          running={running}
          prompt={prompt}
          activityLog={activityLog}
          showActivity={waitingForAnswer}
          error={error}
          onPromptChange={setPrompt}
          onRun={runCodex}
          onStop={stopCodex}
        />
      </div>
    </div>
  );
}
