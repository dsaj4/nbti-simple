import { Clock, CloudArrowUp, Sparkle, UserCircle } from "@phosphor-icons/react";

export type HomePageProps = {
  onStart: () => void;
  onResume?: () => void;
  onRestart?: () => void;
  hasDraft?: boolean;
};

export function HomePage({
  onStart,
  onResume,
  onRestart,
  hasDraft = false,
}: HomePageProps) {
  return (
    <main className="home-page">
      <header className="home-page__header">
        <span className="brand-mark">
          <Sparkle weight="fill" aria-hidden="true" />
          NBTI
        </span>
        <span className="home-page__issue" aria-hidden="true">
          MIND ATLAS · VOL. 01
        </span>
      </header>

      <section className="home-page__stage" aria-labelledby="home-title">
        <div className="home-page__curtains" aria-hidden="true">
          <div className="home-page__curtain home-page__curtain--left" />
          <div className="home-page__curtain home-page__curtain--right" />
        </div>

        <div className="home-page__archive" aria-hidden="true">
          <span className="home-page__archive-globe" />
          <span className="home-page__archive-rule" />
          <span className="home-page__archive-index">
            NBTI / FIELD RECORD
            <br />
            ARCHIVE 01—12
          </span>
          <strong className="home-page__archive-word">MIND</strong>
          <span className="home-page__archive-coordinate">
            12 SITUATIONS · 04 AXES
          </span>
        </div>

        <span className="home-page__archive-stamp" aria-hidden="true">
          <b>NBTI</b>
          <small>FIELD NOTE</small>
        </span>

        <div className="home-page__content">
          <span className="home-page__kicker" aria-hidden="true">
            思维现场 · FIELD NOTES
          </span>

          <h1 id="home-title" className="home-page__title">
            在复杂现场里，
            <br />
            你通常先抓住什么？
          </h1>

          <p className="home-page__lead">
            完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。
          </p>

          <div className="home-page__meta">
            <span className="home-page__meta-item">
              <Clock weight="duotone" aria-hidden="true" />
              约 5 分钟
            </span>
            <span className="home-page__meta-dot" aria-hidden="true" />
            <span className="home-page__meta-item">
              <UserCircle weight="duotone" aria-hidden="true" />
              无需登录
            </span>
            <span className="home-page__meta-dot" aria-hidden="true" />
            <span className="home-page__meta-item">
              <CloudArrowUp weight="duotone" aria-hidden="true" />
              不上传答案
            </span>
          </div>

          <div className="home-page__actions">
            {hasDraft ? (
              <>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={onResume}
                >
                  继续测试
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={onRestart}
                >
                  重新开始
                </button>
              </>
            ) : (
              <button
                type="button"
                className="button button--primary"
                onClick={onStart}
              >
                开始测试
              </button>
            )}
          </div>
        </div>

        <div className="home-page__registry" aria-hidden="true">
          <span>NO. 001</span>
          <i />
          <span>MIND ATLAS</span>
          <i />
          <span>NBTI · 2026</span>
        </div>
      </section>

      <footer className="home-page__footer">
        <span className="safety-pill">
          <Sparkle weight="fill" aria-hidden="true" />
          不是心理诊断，也不评定人格或能力。
        </span>
      </footer>
    </main>
  );
}
