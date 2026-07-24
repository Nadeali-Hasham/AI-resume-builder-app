import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Capture #resume-pdf-root (or #print-area) as A4 PDF with page margins
 * (no browser date/title/URL headers).
 */
export async function downloadResumePdf({
  elementId = "resume-pdf-root",
  fileName = "resume.pdf",
  marginMm = 12,
} = {}) {
  const el =
    document.getElementById(elementId) ||
    document.getElementById("print-area");
  if (!el) {
    throw new Error("Resume preview element not found");
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = Math.max(0, Number(marginMm) || 0);
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= contentHeight;

  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= contentHeight;
  }

  const safeName =
    String(fileName || "resume")
      .replace(/[^\w\s.-]/g, "")
      .trim() || "resume";
  pdf.save(safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`);
}
