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
  organization: { left: ArrowsSplit, right: BookOpenText },
  calibration: { left: MagnifyingGlass, right: BookOpenText },
  momentum: { left: Anchor, right: Footprints },
  scope: { left: Globe, right: UsersThree },
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
          <div className="report-cover__curtains" aria-hidden="true">
            <div className="report-cover__curtain report-cover__curtain--left" />
            <div className="report-cover__curtain report-cover__curtain--right" />
          </div>

          <div className="report-cover__content">
            <div className="report-cover__identity">
              <p className="report-cover__eyebrow">NBTI 思维风格报告</p>
              {report.identity.englishLabel ? (
                <span className="report-cover__code">
                  {report.identity.englishLabel}
                </span>
              ) : null}
              <h1
                ref={titleRef}
                id="report-identity"
                className="report-cover__title"
                tabIndex={-1}
              >
                {report.identity.label}
              </h1>
              <p className="report-cover__subtitle">
                {report.identity.subtitle}
              </p>
            </div>

            <p className="report-cover__headline">{report.stage.headline}</p>

            <div className="report-cover__figure" aria-hidden="true">
              <IdentityFigure identityCode={report.identity.code} />
            </div>

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
                        {dimension.positionLabel}
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
        <ShareButton label={report.identity.label} shareUrl={shareUrl} />
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
                    {dimension.positionLabel}
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
            这份报告只来自你在这 12 道题里的选择。换一组情境、换一组约束，你的起手方式可能会不一样。把它当作一次“在这组题里，我更常先怎么做”的观察，而不是固定标签。
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

function IdentityFigure({ identityCode }: { identityCode: string }) {
  const config = figureConfig[identityCode] ?? figureConfig["MULTI-PATH"];
  return (
    <svg
      viewBox="0 0 200 200"
      className="report-cover__svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="spotlight" cx="50%" cy="35%" r="50%">
          <stop offset="0%" stopColor="rgb(255 253 245 / 95%)" />
          <stop offset="60%" stopColor="rgb(247 237 222 / 40%)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="170" rx="70" ry="14" fill="rgb(46 35 25 / 10%)" />
      <ellipse cx="100" cy="80" rx="75" ry="75" fill="url(#spotlight)" />
      {config.shape}
    </svg>
  );
}

const figureConfig: Record<string, { shape: React.ReactNode }> = {
  DECONSTRUCTOR: {
    shape: (
      <g fill="none" stroke="#ba3026" strokeWidth="3" strokeLinecap="round">
        <rect x="70" y="70" width="60" height="60" rx="4" />
        <line x1="100" y1="70" x2="100" y2="130" />
        <line x1="70" y1="100" x2="130" y2="100" />
      </g>
    ),
  },
  CONNECTOR: {
    shape: (
      <g fill="none" stroke="#169d96" strokeWidth="3" strokeLinecap="round">
        <circle cx="70" cy="100" r="14" />
        <circle cx="130" cy="70" r="14" />
        <circle cx="130" cy="130" r="14" />
        <path d="M84 100 L116 78" />
        <path d="M84 100 L116 122" />
      </g>
    ),
  },
  CALIBRATOR: {
    shape: (
      <g fill="none" stroke="#a77c3d" strokeWidth="3" strokeLinecap="round">
        <circle cx="100" cy="100" r="32" />
        <line x1="100" y1="100" x2="100" y2="78" />
        <line x1="100" y1="100" x2="118" y2="110" />
        <circle cx="100" cy="100" r="5" fill="#a77c3d" />
      </g>
    ),
  },
  "CONTEXT-READER": {
    shape: (
      <g fill="none" stroke="#169d96" strokeWidth="3" strokeLinecap="round">
        <path d="M70 130 Q100 70 130 130" />
        <circle cx="100" cy="100" r="18" />
        <circle cx="85" cy="95" r="4" fill="#169d96" />
        <circle cx="115" cy="95" r="4" fill="#169d96" />
        <path d="M92 110 Q100 116 108 110" />
      </g>
    ),
  },
  ANCHOR: {
    shape: (
      <g fill="none" stroke="#ba3026" strokeWidth="3" strokeLinecap="round">
        <circle cx="100" cy="78" r="8" fill="#ba3026" />
        <line x1="100" y1="86" x2="100" y2="125" />
        <path d="M85 105 Q100 105 115 105" />
        <path d="M90 120 Q100 132 110 120" />
      </g>
    ),
  },
  EXPLORER: {
    shape: (
      <g fill="none" stroke="#a77c3d" strokeWidth="3" strokeLinecap="round">
        <path d="M70 130 L85 100 L100 115 L115 85 L130 110" />
        <circle cx="70" cy="130" r="4" fill="#a77c3d" />
        <circle cx="85" cy="100" r="4" fill="#a77c3d" />
        <circle cx="100" cy="115" r="4" fill="#a77c3d" />
        <circle cx="115" cy="85" r="4" fill="#a77c3d" />
        <circle cx="130" cy="110" r="4" fill="#a77c3d" />
      </g>
    ),
  },
  OVERLOOKER: {
    shape: (
      <g fill="none" stroke="#169d96" strokeWidth="3" strokeLinecap="round">
        <circle cx="100" cy="100" r="38" />
        <circle cx="100" cy="100" r="24" />
        <line x1="100" y1="62" x2="100" y2="138" />
        <line x1="62" y1="100" x2="138" y2="100" />
      </g>
    ),
  },
  PRESENT: {
    shape: (
      <g fill="none" stroke="#ba3026" strokeWidth="3" strokeLinecap="round">
        <circle cx="85" cy="95" r="16" />
        <circle cx="115" cy="95" r="16" />
        <path d="M85 120 Q100 135 115 120" />
      </g>
    ),
  },
  "MULTI-PATH": {
    shape: (
      <g fill="none" stroke="#6f6559" strokeWidth="3" strokeLinecap="round">
        <circle cx="100" cy="100" r="28" strokeDasharray="8 6" />
        <line x1="100" y1="72" x2="100" y2="128" />
        <line x1="72" y1="100" x2="128" y2="100" />
        <circle cx="100" cy="100" r="6" fill="#6f6559" />
      </g>
    ),
  },
};
