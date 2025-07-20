// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export function generatePDFReport(filename, riskReport, returnBlob = false) {
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
//     High: riskReport.risks.filter((r) => r.risk_level === "High").length,
//     Medium: riskReport.risks.filter((r) => r.risk_level === "Medium").length,
//     Low: riskReport.risks.filter((r) => r.risk_level === "Low").length,
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

//   // Main Risk Table
//   const tableData = riskReport.risks.map((item, i) => [
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
//     margin: { left: 12, right: 10 },
//     didParseCell: function (data) {
//       if (data.section === "body") {
//         const risk = data.row.raw[2];
//         if (risk === "High") {
//           data.cell.styles.fillColor = [255, 230, 230];
//         } else if (risk === "Medium") {
//           data.cell.styles.fillColor = [255, 250, 205];
//         } else if (risk === "Low") {
//           data.cell.styles.fillColor = [220, 255, 220];
//         }
//       }
//     },
//   });

//   // Missing Clauses Table
//   if (riskReport.missing_clauses && riskReport.missing_clauses.length > 0) {
//     const missingTableData = riskReport.missing_clauses.map((item, i) => [
//       i + 1,
//       item.missing,
//       item.risk_level,
//       item.explanation,
//       item.suggestion,
//     ]);
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [["#", "Missing Clause", "Risk Level", "Explanation", "Suggestion"]],
//       body: missingTableData,
//       styles: {
//         fontSize: 9,
//         overflow: "linebreak",
//         cellPadding: 3,
//         valign: "top",
//       },
//       headStyles: {
//         fillColor: [22, 78, 99],
//         textColor: 255,
//       },
//       columnStyles: {
//         0: { cellWidth: 20 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 20 },
//         3: { cellWidth: 60 },
//         4: { cellWidth: 60 },
//       },
//       margin: { left: 12, right: 10 },
//       didParseCell: function (data) {
//         if (data.section === "body") {
//           const risk = data.row.raw[2];
//           if (risk === "High") {
//             data.cell.styles.fillColor = [255, 230, 230];
//           } else if (risk === "Medium") {
//             data.cell.styles.fillColor = [255, 250, 205];
//           } else if (risk === "Low") {
//             data.cell.styles.fillColor = [220, 255, 220];
//           }
//         }
//       },
//     });
//   }

//   // Redundant Clauses Table
//   if (riskReport.redundant_clauses && riskReport.redundant_clauses.length > 0) {
//     const redundantTableData = riskReport.redundant_clauses.map((item, i) => [
//       i + 1,
//       item.redundant,
//       item.risk_level,
//       item.explanation,
//       item.suggestion,
//     ]);
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [["#", "Redundant Clause", "Risk Level", "Explanation", "Suggestion"]],
//       body: redundantTableData,
//       styles: {
//         fontSize: 9,
//         overflow: "linebreak",
//         cellPadding: 3,
//         valign: "top",
//       },
//       headStyles: {
//         fillColor: [22, 78, 99],
//         textColor: 255,
//       },
//       columnStyles: {
//         0: { cellWidth: 20 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 20 },
//         3: { cellWidth: 60 },
//         4: { cellWidth: 60 },
//       },
//       margin: { left: 12, right: 10 },
//       didParseCell: function (data) {
//         if (data.section === "body") {
//           const risk = data.row.raw[2];
//           if (risk === "High") {
//             data.cell.styles.fillColor = [255, 230, 230];
//           } else if (risk === "Medium") {
//             data.cell.styles.fillColor = [255, 250, 205];
//           } else if (risk === "Low") {
//             data.cell.styles.fillColor = [220, 255, 220];
//           }
//         }
//       },
//     });
//   }

//   if (returnBlob) {
//     // Only return the Blob, do NOT trigger download
//     return doc.output("blob");
//   } else {
//     // Trigger download
//     doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
//   }
// }














import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ⬅️ Provide your base64 or image path
const logoPath = ""C:/Users/Public/Projects/RegnovaAI/RegnovaAI_MVP/frontend_V41/public/regnovaai-logo.png""; // can be URL or base64

export function generatePDFReport(filename, riskReport, returnBlob = false) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ==== Optional: Preload logo (async optional version available if needed) ====
  const logoSize = { width: 30, height: 12 };

  // ======= Title Page Header =======
  doc.addImage(logoPath, "PNG", pageWidth - logoSize.width - 14, 10, logoSize.width, logoSize.height);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("RegnovaAI Compliance Risk Report", 14, 20);

  // ======= File Info =======
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`File Audited: ${filename}`, 14, 28);
  doc.line(14, 30, 196, 30);

  // ======= Risk Summary =======
  const counts = {
    High: riskReport.risks.filter((r) => r.risk_level === "High").length,
    Medium: riskReport.risks.filter((r) => r.risk_level === "Medium").length,
    Low: riskReport.risks.filter((r) => r.risk_level === "Low").length,
  };

  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("Risk Summary:", 14, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(200, 0, 0);
  doc.text(`High: ${counts.High}`, 14, 50);
  doc.setTextColor(255, 140, 0);
  doc.text(`Medium: ${counts.Medium}`, 50, 50);
  doc.setTextColor(0, 150, 0);
  doc.text(`Low: ${counts.Low}`, 110, 50);

  const getClauseText = (item) =>
    item.issue || item.missing || item.redundant || "—";

  let startY = 58;

  // ==== Section Renderer Function ====
  const renderSection = (title, data, headers) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40);
    doc.text(title, 14, startY);
    doc.line(14, startY + 1.5, 196, startY + 1.5);
    startY += 3;

    autoTable(doc, {
      startY: startY,
      head: [headers],
      body: data.map((item, i) => [
        i + 1,
        getClauseText(item),
        item.risk_level,
        item.explanation,
        item.suggestion,
      ]),
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
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 55 },
        4: { cellWidth: 55 },
      },
      margin: { left: 20, right: 20 },
      didParseCell: function (data) {
        const risk = data.row.raw[2];
        if (data.section === "body") {
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

    startY = doc.lastAutoTable.finalY + 12;
  };

  // ==== Risk Issues Table ====
  renderSection("Identified Risk Issues", riskReport.risks, [
    "#",
    "Issue",
    "Risk Level",
    "Explanation",
    "Suggestion",
  ]);

  // ==== Missing Clauses Table ====
  if (riskReport.missing_clauses?.length > 0) {
    renderSection("Missing Clauses", riskReport.missing_clauses, [
      "#",
      "Missing Clause",
      "Risk Level",
      "Explanation",
      "Suggestion",
    ]);
  }

  // ==== Redundant Clauses Table ====
  if (riskReport.redundant_clauses?.length > 0) {
    renderSection("Redundant Clauses", riskReport.redundant_clauses, [
      "#",
      "Redundant Clause",
      "Risk Level",
      "Explanation",
      "Suggestion",
    ]);
  }

  // ======= Footer: Page Numbers and Logos on All Pages =======
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Footer page number
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);

    // Header logo on every page
    doc.addImage(logoPath, "PNG", pageWidth - logoSize.width - 14, 10, logoSize.width, logoSize.height);
  }

  // ======= Output PDF =======
  if (returnBlob) {
    return doc.output("blob");
  } else {
    doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
  }
}



