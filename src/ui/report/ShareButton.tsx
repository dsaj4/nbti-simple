import { Check, Copy, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";

type ShareState = "idle" | "shared" | "copied" | "manual" | "failed";

type ShareButtonProps = {
  label: string;
};

function copyWithSelection(value: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  try {
    return typeof document.execCommand === "function" && document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function ShareButton({ label }: ShareButtonProps) {
  const [state, setState] = useState<ShareState>("idle");
  const canNativeShare = "share" in navigator && typeof navigator.share === "function";

  async function copyReportLink() {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setState("copied");
        return;
      } catch {}
    }

    if (!copyWithSelection(window.location.href)) {
      setState("manual");
      return;
    }

    setState("copied");
  }

  async function shareReport() {
    const shareData = {
      title: `NBTI · ${label}`,
      text: `我的 NBTI 思维风格是「${label}」`,
      url: window.location.href,
    };

    try {
      if (canNativeShare) {
        try {
          await navigator.share(shareData);
          setState("shared");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }

      await copyReportLink();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState("failed");
    }
  }

  const feedback =
    state === "shared"
      ? "已打开分享面板"
      : state === "copied"
        ? "链接已复制"
        : state === "failed"
          ? "分享失败，请复制浏览器地址"
          : state === "manual"
            ? "浏览器限制了自动复制，请复制下方链接"
            : "";

  return (
    <div className="share-action">
      <button type="button" onClick={shareReport}>
        {state === "copied" || state === "shared" ? (
          <Check weight="bold" aria-hidden="true" />
        ) : canNativeShare ? (
          <ShareNetwork weight="bold" aria-hidden="true" />
        ) : (
          <Copy weight="bold" aria-hidden="true" />
        )}
        <span>{state === "copied" ? "已复制" : state === "shared" ? "已分享" : "分享"}</span>
      </button>
      <span className="share-action__feedback" role="status" aria-live="polite">
        {feedback}
      </span>
      {state === "manual" ? (
        <input
          className="share-action__manual-link"
          aria-label="报告链接"
          readOnly
          value={window.location.href}
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}
