import {
  Anchor,
  ArrowsSplit,
  BookOpenText,
  Footprints,
  Globe,
  MagnifyingGlass,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import type { ReportViewModel } from "../../../contracts/report-view-model";
import { ShareButton } from "./ShareButton";

type ReportPageProps = {
  report: ReportViewModel;
  shareUrl?: string;
  onRetake: () => void;
};

const dimensionIcons: Record<
  string,
  { left: React.ElementType; right: React.ElementType }
> = {
  cognitivePath: { left: BookOpenText, right: ArrowsSplit },
  driveSource: { left: Sparkle, right: MagnifyingGlass },
  cognitiveTempo: { left: Footprints, right: Anchor },
  valueOrientation: { left: UsersThree, right: Globe },
};

export function ReportPage({ report, shareUrl, onRetake }: ReportPageProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <main className="report-page">
      <header className="report-page__header">
        <span className="brand-mark">
          <Sparkle weight="fill" aria-hidden="true" />
          NBTI 思维风格报告
        </span>
      </header>

      <section className="report-cover" aria-labelledby="report-identity">
        <div className="report-cover__frame">
          <div className="report-cover__backdrop-type" aria-hidden="true">
            {report.role.englishLabel}
          </div>

          <div className="report-cover__archive-stamp" aria-hidden="true">
            <span>FIELD NOTES</span>
            <strong>24 / 24</strong>
            <small>COMPLETED</small>
          </div>

          <div className="report-cover__curtains" aria-hidden="true">
            <div className="report-cover__curtain report-cover__curtain--left" />
            <div className="report-cover__curtain report-cover__curtain--right" />
          </div>

          <div className="report-cover__content">
            <div className="report-cover__identity">
              <p className="report-cover__eyebrow">NBTI 思维风格报告</p>
              <span className="report-cover__code">
                {report.role.englishLabel}
              </span>
              <h1
                ref={titleRef}
                id="report-identity"
                className="report-cover__title"
                tabIndex={-1}
              >
                {report.role.label}
              </h1>
              <p className="report-cover__subtitle">
                {report.role.subtitle}
              </p>
            </div>

            <p className="report-cover__headline">{report.stage.headline}</p>
            <p className="report-cover__scene">{report.stage.scene}</p>

            {report.role.assetSrc ? (
              <div className="report-cover__figure" aria-hidden="true">
                <img
                  className="report-cover__role-image"
                  src={report.role.assetSrc}
                  alt=""
                  loading="eager"
                  decoding="async"
                />
              </div>
            ) : (
              <div
                className="report-cover__figure report-cover__figure--empty"
                aria-hidden="true"
              />
            )}

            <div className="report-cover__dimensions">
              {report.dimensions.map((dimension) => {
                const icons = dimensionIcons[dimension.id] ?? {
                  left: Sparkle,
                  right: Sparkle,
                };
                const side =
                  dimension.value > 25 ? "right" : dimension.value < -25 ? "left" : null;
                const Icon = side === "right" ? icons.right : side === "left" ? icons.left : Sparkle;
                const markerStyle = {
                  left: `${((dimension.value + 100) / 200) * 100}%`,
                } as React.CSSProperties;

                return (
                  <div className="report-cover__dimension" key={dimension.id}>
                    <div className="report-cover__dimension-header">
                      <Icon weight="duotone" aria-hidden="true" />
                      <span className="report-cover__dimension-label">
                        {dimension.label}
                      </span>
                      <span className="report-cover__dimension-position">
                        {dimension.positionLabel} · {dimension.clarityLabel}
                      </span>
                    </div>
                    <div className="report-cover__dimension-ends" aria-hidden="true">
                      <span>{dimension.leftLabel}</span>
                      <span>{dimension.rightLabel}</span>
                    </div>
                    <div
                      className="report-cover__dimension-track"
                      role="img"
                      aria-label={`${dimension.label}：${dimension.positionLabel}`}
                    >
                      <span className="report-cover__dimension-marker" style={markerStyle} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="report-cover__limitation">
              {report.sampleLimitation}
            </p>
          </div>
        </div>
      </section>

      <div className="report-share">
        <ShareButton label={report.role.label} shareUrl={shareUrl} />
        <p className="report-share__privacy">
          持有结果链接的人，可以在浏览器中重建这组选择和报告。
        </p>
      </div>

      <section className="report-details" aria-labelledby="report-details-title">
        <h2 id="report-details-title" className="report-details__title">
          你通常先……
        </h2>
        <ul className="report-actions">
          {report.actions.map((action, index) => (
            <li className="report-action" key={index}>
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </li>
          ))}
        </ul>

        {report.evidence.length > 0 ? (
          <>
            <h2 className="report-details__title">答案里的线索</h2>
            <ol className="report-evidence">
              {report.evidence.map((item, index) => (
                <li className="report-evidence__item" key={index}>
                  <span className="report-evidence__title">
                    {item.questionTitle}
                  </span>
                  <p className="report-evidence__choice">你选择了：{item.choice}</p>
                  <p className="report-evidence__action">{item.action}</p>
                </li>
              ))}
            </ol>
          </>
        ) : null}

        <h2 className="report-details__title">四个维度的完整位置</h2>
        {report.hasBoundaryState ? (
          <p className="report-cover__limitation">
            边界状态：至少一个维度的偏好较轻，换一组情境时可能呈现相反一侧的处理方式。
          </p>
        ) : null}
        <div className="report-dimensions">
          {report.dimensions.map((dimension) => {
            const icons = dimensionIcons[dimension.id] ?? {
              left: Sparkle,
              right: Sparkle,
            };
            const side =
              dimension.value > 25 ? "right" : dimension.value < -25 ? "left" : null;
            const Icon = side === "right" ? icons.right : side === "left" ? icons.left : Sparkle;
            const markerStyle = {
              left: `${((dimension.value + 100) / 200) * 100}%`,
            } as React.CSSProperties;

            return (
              <article className="report-dimension" key={dimension.id}>
                <header className="report-dimension__header">
                  <Icon weight="duotone" aria-hidden="true" />
                  <h3>{dimension.label}</h3>
                  <span className="report-dimension__position">
                    {dimension.positionLabel} · {dimension.clarityLabel}
                  </span>
                </header>
                <div className="report-dimension__ends" aria-hidden="true">
                  <span>{dimension.leftLabel}</span>
                  <span>{dimension.rightLabel}</span>
                </div>
                <div
                  className="report-dimension__track"
                  role="img"
                  aria-label={`${dimension.label}：${dimension.positionLabel}`}
                >
                  <span className="report-dimension__marker" style={markerStyle} />
                </div>
                <p className="report-dimension__explanation">
                  {dimension.explanation}
                </p>
              </article>
            );
          })}
        </div>

        <div className="report-conditional">
          <h2 className="report-details__title">换一个现场也可能不同</h2>
          <p>
            这份报告只来自你在这 24 道题里的选择。换一组情境、换一组约束，你的起手方式可能会不一样。把它当作一次“在这组题里，我更常先怎么做”的观察，而不是固定标签。
          </p>
        </div>

        <div className="report-retake">
          <button
            type="button"
            className="button button--secondary"
            onClick={onRetake}
          >
            重新测试
          </button>
        </div>
      </section>

      <footer className="report-safety">
        <span className="safety-pill">
          <Sparkle weight="fill" aria-hidden="true" />
          {report.safetyNote}
        </span>
      </footer>
    </main>
  );
}
