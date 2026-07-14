import { reportData, assertReportIsComplete } from "../features/report/reportData";
import { ReportPage } from "../ui/report/ReportPage";

const report = assertReportIsComplete(reportData);

export function App() {
  return <ReportPage report={report} />;
}
