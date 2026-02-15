import DashboardLayout from "../layouts/DashboardLayout";
import PDFViewer from "../ui/PDFViewer";

const Pdfviewer = () => {
  return (
    <DashboardLayout>
      <PDFViewer src="/assets/bns-2023.pdf" title="BNS 2023" width="80%" height="80%" />
    </DashboardLayout>
  );
};
export default Pdfviewer;