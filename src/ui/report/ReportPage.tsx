import type { ReportViewModel } from "../../../contracts/report-view-model";
import { InsightPanel } from "./InsightPanel";
import { ReportMark } from "./ReportMark";
import { StageCard } from "./StageCard";

type ReportPageProps = {
  report: ReportViewModel;
};

export function ReportPage({ report }: ReportPageProps) {
  return (
    <main className="report-page">
      <ReportMark />
      <div className="report-layout">
        <StageCard report={report} />
        <InsightPanel report={report} />
      </div>
    </main>
  );
}
