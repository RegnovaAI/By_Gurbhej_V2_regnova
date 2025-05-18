// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export function generatePDFReport(filename, riskReport) {
//   const doc = new jsPDF({
//     orientation: 'portrait',
//     unit: 'mm',
//     format: 'a4',
//   });

//   doc.setFontSize(18);
//   doc.text("🛡️ Compliance Risk Report", 105, 20, { align: 'center' });

//   const rows = riskReport.map((risk) => [
//     risk.issue,
//     risk.risk_level,
//     risk.explanation,
//     risk.suggestion,
//   ]);

//   autoTable(doc, {
//     startY: 30,
//     head: [["Issue", "Risk Level", "Explanation", "Suggestion"]],
//     body: rows,
//     margin: { left: 15, right: 15 }, // equal margins
//     styles: {
//       fontSize: 8,
//       cellPadding: 3,
//       overflow: 'linebreak',
//     },
//     headStyles: {
//       fillColor: [41, 128, 185],
//       textColor: 255,
//       fontSize: 9,
//       halign: 'center',
//     },
//     columnStyles: {
//       0: { cellWidth: 40 },
//       1: { cellWidth: 20, halign: 'center' },
//       2: { cellWidth: 60 },
//       3: { cellWidth: 55 },
//     },
//     didParseCell: (data) => {
//       if (data.section === 'body') {
//         const riskLevel = data.row.raw[1];
//         if (riskLevel === 'High') {
//           data.cell.styles.fillColor = [255, 204, 204]; // light red
//         } else if (riskLevel === 'Medium') {
//           data.cell.styles.fillColor = [255, 255, 204]; // light yellow
//         } else if (riskLevel === 'Low') {
//           data.cell.styles.fillColor = [204, 255, 204]; // light green
//         }
//       }
//     },
//   });

//   doc.save(`${filename.replace(/\.[^/.]+$/, "")}-RiskReport.pdf`);
// }

// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export function generatePDFReport(filename, riskReport) {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("RegulaAI Risk Audit Report", 14, 20);

//   doc.setFontSize(12);
//   doc.text(`File Audited: ${filename}`, 14, 30);
//   doc.setLineWidth(0.1);
//   doc.line(14, 32, 196, 32);

//   const tableData = riskReport.map((item, index) => [
//     index + 1,
//     item.issue,
//     item.risk_level,
//     item.explanation,
//     item.suggestion
//   ]);

//   doc.autoTable({
//     startY: 40,
//     head: [["#", "Issue", "Risk Level", "Explanation", "Suggestion"]],
//     body: tableData,
//     styles: {
//       fontSize: 9,
//       cellPadding: 2,
//       overflow: 'linebreak'
//     },
//     headStyles: {
//       fillColor: [22, 78, 99],
//       textColor: 255,
//       fontStyle: 'bold'
//     },
//     columnStyles: {
//       0: {cellWidth: 10},
//       1: {cellWidth: 35},
//       2: {cellWidth: 25},
//       3: {cellWidth: 60},
//       4: {cellWidth: 60}
//     }
//   });

//   doc.save(`${filename}-RegulaAI-Audit.pdf`);
// }

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export function generatePDFReport(filename, riskReport) {
//   const doc = new jsPDF();

//   // Header
//   doc.setFontSize(20);
//   doc.text("📋 RegulaAI Compliance Risk Report", 14, 20);
//   doc.setFontSize(12);
//   doc.text(`File Audited: ${filename}`, 14, 30);
//   doc.line(14, 32, 196, 32); // divider

//   // 1️⃣ Summary Count
//   const counts = {
//     High: riskReport.filter(r => r.risk_level === "High").length,
//     Medium: riskReport.filter(r => r.risk_level === "Medium").length,
//     Low: riskReport.filter(r => r.risk_level === "Low").length
//   };

//   doc.setFontSize(12);
//   doc.setTextColor(40);
//   doc.text("Risk Summary:", 14, 40);
//   doc.setTextColor(200, 0, 0);
//   doc.text(`🟥 High: ${counts.High}`, 14, 48);
//   doc.setTextColor(255, 140, 0);
//   doc.text(`🟧 Medium: ${counts.Medium}`, 50, 48);
//   doc.setTextColor(0, 150, 0);
//   doc.text(`🟩 Low: ${counts.Low}`, 110, 48);

//   // 2️⃣ Risk Table
//   const tableData = riskReport.map((item, i) => [
//     i + 1,
//     item.issue,
//     item.risk_level,
//     item.explanation,
//     item.suggestion,
//   ]);

//   autoTable(doc, {
//     startY: 58,
//     head: [["#", "Issue", "Risk Level", "Explanation", "Suggestion"]],
//     body: tableData,
//     styles: {
//       fontSize: 9,
//       overflow: "linebreak",
//       cellPadding: 3,
//       valign: "top",
//     },
//     headStyles: {
//       fillColor: [22, 78, 99],
//       textColor: 255,
//     },
//     columnStyles: {
//       0: { cellWidth: 8 },
//       1: { cellWidth: 40 },
//       2: { cellWidth: 20 },
//       3: { cellWidth: 60 },
//       4: { cellWidth: 60 },
//     },
//     theme: "striped"
//   });

//   // Save PDF
//   doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
// }

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export function generatePDFReport(filename, riskReport) {
//   const doc = new jsPDF();

//   // Title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.text("RegnovaAI Compliance Risk Report", 14, 20);

//   // File Info
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);
//   doc.text(`File Audited: ${filename}`, 14, 28);
//   doc.line(14, 30, 196, 30);

//   // Risk Summary
//   const counts = {
//     High: riskReport.filter(r => r.risk_level === "High").length,
//     Medium: riskReport.filter(r => r.risk_level === "Medium").length,
//     Low: riskReport.filter(r => r.risk_level === "Low").length
//   };

//   doc.setFontSize(12);
//   doc.setTextColor(40);
//   doc.text("Risk Summary:", 14, 38);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   doc.setTextColor(200, 0, 0);
//   doc.text(`High: ${counts.High}`, 14, 46);
//   doc.setTextColor(255, 140, 0);
//   doc.text(`Medium: ${counts.Medium}`, 50, 46);
//   doc.setTextColor(0, 150, 0);
//   doc.text(`Low: ${counts.Low}`, 110, 46);

//   // Table
//   const tableData = riskReport.map((item, i) => [
//     i + 1,
//     item.issue,
//     item.risk_level,
//     item.explanation,
//     item.suggestion,
//   ]);

//   autoTable(doc, {
//     startY: 54,
//     head: [["#", "Issue", "Risk Level", "Explanation", "Suggestion"]],
//     body: tableData,
//     styles: {
//       fontSize: 9,
//       overflow: "linebreak",
//       cellPadding: 3,
//       valign: "top",
//     },
//     headStyles: {
//       fillColor: [22, 78, 99],
//       textColor: 255,
//     },
//     columnStyles: {
//       0: { cellWidth: 8 },
//       1: { cellWidth: 40 },
//       2: { cellWidth: 20 },
//       3: { cellWidth: 60 },
//       4: { cellWidth: 60 },
//     },
//     theme: "striped"
//   });

//   doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
// }

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDFReport(filename, riskReport, returnBlob = false) {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("RegnovaAI Compliance Risk Report", 14, 20);

  // File Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`File Audited: ${filename}`, 14, 28);
  doc.line(14, 30, 196, 30);

  // Risk Summary
  const counts = {
    High: riskReport.filter((r) => r.risk_level === "High").length,
    Medium: riskReport.filter((r) => r.risk_level === "Medium").length,
    Low: riskReport.filter((r) => r.risk_level === "Low").length,
  };

  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("Risk Summary:", 14, 38);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(200, 0, 0);
  doc.text(`High: ${counts.High}`, 14, 46);
  doc.setTextColor(255, 140, 0);
  doc.text(`Medium: ${counts.Medium}`, 50, 46);
  doc.setTextColor(0, 150, 0);
  doc.text(`Low: ${counts.Low}`, 110, 46);

  // Table
  const tableData = riskReport.map((item, i) => [
    i + 1,
    item.issue,
    item.risk_level,
    item.explanation,
    item.suggestion,
  ]);

  autoTable(doc, {
    startY: 54,
    head: [["#", "Issue", "Risk Level", "Explanation", "Suggestion"]],
    body: tableData,
    styles: {
      fontSize: 9,
      overflow: "linebreak",
      cellPadding: 3,
      valign: "top",
    },
    headStyles: {
      fillColor: [22, 78, 99],
      textColor: 255,
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 60 },
      4: { cellWidth: 60 },
    },
    margin: { left: 12, right: 10 }, // consistent with header margin
    didParseCell: function (data) {
      if (data.section === "body") {
        const risk = data.row.raw[2]; // "Risk Level" column
        if (risk === "High") {
          data.cell.styles.fillColor = [255, 230, 230];
        } else if (risk === "Medium") {
          data.cell.styles.fillColor = [255, 250, 205];
        } else if (risk === "Low") {
          data.cell.styles.fillColor = [220, 255, 220];
        }
      }
    },
  });
  if (returnBlob) {
    // Only return the Blob, do NOT trigger download
    return doc.output("blob");
  } else {
    // Trigger download
    doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
  }
}
