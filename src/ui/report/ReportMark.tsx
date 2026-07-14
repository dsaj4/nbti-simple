import { Sparkle } from "@phosphor-icons/react";

export function ReportMark() {
  return (
    <header className="report-mark" aria-label="NBTI 结果报告">
      <Sparkle weight="fill" aria-hidden="true" />
      <div className="report-mark__wording">
        <span>NBTI Result Report</span>
        <span className="report-mark__rule" aria-hidden="true">
          <i />
          <Sparkle weight="fill" />
        </span>
      </div>
    </header>
  );
}
