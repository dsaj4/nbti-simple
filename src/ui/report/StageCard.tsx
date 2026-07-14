import {
  MagnifyingGlass,
  Scales,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { ReportViewModel } from "../../../contracts/report-view-model";

type StageCardProps = {
  report: ReportViewModel;
};

const dimensionIcons = [MagnifyingGlass, Scales, UsersThree];

export function StageCard({ report }: StageCardProps) {
  const cameoStates = report.stage.cameoStates ?? [];
  const [activeId, setActiveId] = useState(cameoStates[0]?.id ?? "");
  const activeCameo = cameoStates.find((cameo) => cameo.id === activeId);
  const activeVisual = activeCameo?.visual;
  const activeVisualVariant =
    activeVisual?.variant === "supporting" ? "supporting" : "primary";
  const capabilities = report.stage.capabilityHighlights
    ?.map((highlight) => {
      const dimension = report.dimensions.find(
        (candidate) => candidate.id === highlight.dimensionId,
      );
      return dimension ? { dimension, title: highlight.title } : undefined;
    })
    .filter((capability) => capability !== undefined) ??
    report.dimensions.slice(0, 3).map((dimension) => ({
      dimension,
      title: dimension.label,
    }));

  return (
    <section className="stage-card" aria-labelledby="report-identity">
      <div className="stage-card__frame">
        <img
          className="stage-card__curtains"
          src="/assets/curtains.png"
          alt=""
          width="996"
          height="650"
          aria-hidden="true"
        />

        <div className="stage-heading">
          <div className="stage-heading__title-row">
            <Sparkle weight="fill" aria-hidden="true" />
            <h1 id="report-identity">{report.identity.label}</h1>
            <Sparkle weight="fill" aria-hidden="true" />
          </div>
          <p className="stage-heading__english">
            {report.identity.englishLabel ?? report.identity.subtitle}
          </p>
          <p className="stage-heading__code">{report.identity.code}</p>
        </div>

        <div className="stage-card__spotlight" aria-hidden="true" />
        {activeVisual ? (
          <figure
            className={`stage-character stage-character--${activeVisualVariant}`}
            key={activeId}
          >
            <img
              src={activeVisual.src}
              alt={activeVisual.alt}
              width={activeVisual.width}
              height={activeVisual.height}
            />
          </figure>
        ) : null}

        <aside className="stage-notes" aria-label="类型能力摘要">
          {capabilities.map(({ dimension, title }, index) => {
            const Icon = dimensionIcons[index];
            return (
              <div className="stage-note" key={dimension.id}>
                <Icon weight="duotone" aria-hidden="true" />
                <div>
                  <h2>{title}</h2>
                  <p>{dimension.explanation}</p>
                </div>
              </div>
            );
          })}
        </aside>

        <div className="stage-pedestal" aria-hidden="true" />
      </div>

      <div className="cameo-strip" role="tablist" aria-label="切换报告舞台">
        {cameoStates.map((cameo, index) => {
          const isSelected = cameo.id === activeId;
          return (
            <button
              className={`cameo-ticket${isSelected ? " is-selected" : ""}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="stage-scene-description"
              id={`cameo-${cameo.id}`}
              tabIndex={isSelected ? 0 : -1}
              key={cameo.id}
              onClick={() => setActiveId(cameo.id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                const nextIndex = (index + direction + cameoStates.length) % cameoStates.length;
                setActiveId(cameoStates[nextIndex].id);
                document.getElementById(`cameo-${cameoStates[nextIndex].id}`)?.focus();
              }}
            >
              <span className="cameo-ticket__meta">
                {cameo.eyebrow ?? (index === 0 ? "本尊" : "转场")}
              </span>
              <span className="cameo-ticket__copy">
                <strong>{cameo.label}</strong>
                <small>{cameo.description}</small>
              </span>
              {cameo.visual ? (
                <img src={cameo.visual.src} alt="" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
        <div
          className="cameo-strip__scene"
          id="stage-scene-description"
          role="tabpanel"
          aria-labelledby={activeId ? `cameo-${activeId}` : undefined}
        >
          <span>现场注释</span>
          <p>{report.stage.scene}</p>
        </div>
      </div>
    </section>
  );
}
