import { CrownSimple, Sparkle } from "@phosphor-icons/react";
import type { ReportViewModel } from "../../../contracts/report-view-model";
import { ShareButton } from "./ShareButton";

type InsightPanelProps = {
  report: ReportViewModel;
};

export function InsightPanel({ report }: InsightPanelProps) {
  const rarity = report.rarity;

  return (
    <aside className="insight-panel" aria-labelledby="rarity-title">
      <header className="rarity-heading">
        <span className="rarity-heading__icon">
          <CrownSimple weight="fill" aria-hidden="true" />
        </span>
        <h2 id="rarity-title">稀有度</h2>
      </header>

      <div className="rarity-value" aria-label={`${rarity?.label ?? "未分级"}，占比 ${rarity?.percentage ?? 0}%`}>
        <strong>{rarity?.label ?? "—"}</strong>
        <span aria-hidden="true">/</span>
        <b>{rarity?.percentage ?? 0}%</b>
      </div>

      <div className="ornament-rule" aria-hidden="true">
        <i />
        <Sparkle weight="fill" />
        <i />
      </div>

      <section className="type-reading">
        <h3>
          <Sparkle weight="fill" aria-hidden="true" />
          类型解读
        </h3>
        <p>{report.stage.headline}</p>
        <p>{report.stage.scene}</p>
      </section>

      <section className="dimension-list" aria-label="思维维度">
        {report.dimensions.map((dimension) => (
          <article className="dimension" key={dimension.id}>
            <header>
              <span className="dimension__initial" aria-hidden="true">
                {dimension.shortCode ?? dimension.label.slice(0, 1)}
              </span>
              <h3>{dimension.label}</h3>
              <strong>{dimension.value}</strong>
            </header>
            <div
              className="dimension__track"
              role="meter"
              aria-label={`${dimension.label} ${dimension.value} 分`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={dimension.value}
            >
              <span style={{ "--score": `${dimension.value}%` } as React.CSSProperties} />
            </div>
            <p>{dimension.explanation}</p>
          </article>
        ))}
      </section>

      <ShareButton label={report.identity.label} />

      <footer className="safety-note">
        <span>阅读边界</span>
        <p>{report.safetyNote}</p>
      </footer>
    </aside>
  );
}
