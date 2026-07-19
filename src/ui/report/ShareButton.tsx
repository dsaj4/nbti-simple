import { Check, Copy, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";

type ShareState = "idle" | "shared" | "copied" | "manual" | "failed";

type ShareButtonProps = {
  label: string;
  shareUrl?: string;
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

export function ShareButton({ label, shareUrl }: ShareButtonProps) {
  const [state, setState] = useState<ShareState>("idle");
  const canNativeShare = "share" in navigator && typeof navigator.share === "function";
  const url = shareUrl ?? (typeof window !== "undefined" ? window.location.href : "");

  async function copyReportLink() {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setState("copied");
        return;
      } catch {}
    }

    if (!copyWithSelection(url)) {
      setState("manual");
      return;
    }

    setState("copied");
  }

  async function shareReport() {
    const shareData = {
      title: `NBTI · ${label}`,
      text: `我的 NBTI 是「${label}」：面对复杂现场，我通常先${getShareSnippet(label)}。`,
      url,
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
        <span>{state === "copied" ? "已复制" : state === "shared" ? "已分享" : "分享我的结果"}</span>
      </button>
      <span className="share-action__feedback" role="status" aria-live="polite">
        {feedback}
      </span>
      {state === "manual" ? (
        <input
          className="share-action__manual-link"
          aria-label="报告链接"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}

function getShareSnippet(label: string): string {
  switch (label) {
    case "拆题者":
      return "把问题拆成可分别处理的部分";
    case "连线者":
      return "寻找信息之间的连接";
    case "校准者":
      return "确认判断有没有可靠依据";
    case "读场者":
      return "理解现场的处境和关系";
    case "定锚者":
      return "建立一个可执行的落点";
    case "探路者":
      return "走一小步换取新信息";
    case "望塔者":
      return "拉远看系统和长期后果";
    case "在场者":
      return "看见眼前具体的人";
    default:
      return "切换不同的起手方式";
  }
}
