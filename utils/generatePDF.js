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
    High: riskReport.risks.filter((r) => r.risk_level === "High").length,
    Medium: riskReport.risks.filter((r) => r.risk_level === "Medium").length,
    Low: riskReport.risks.filter((r) => r.risk_level === "Low").length,
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

  // Main Risk Table
  const tableData = riskReport.risks.map((item, i) => [
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
    margin: { left: 12, right: 10 },
    didParseCell: function (data) {
      if (data.section === "body") {
        const risk = data.row.raw[2];
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

  // Missing Clauses Table
  if (riskReport.missing_clauses && riskReport.missing_clauses.length > 0) {
    const missingTableData = riskReport.missing_clauses.map((item, i) => [
      i + 1,
      item.missing,
      item.risk_level,
      item.explanation,
      item.suggestion,
    ]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "Missing Clause", "Risk Level", "Explanation", "Suggestion"]],
      body: missingTableData,
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
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 60 },
        4: { cellWidth: 60 },
      },
      margin: { left: 12, right: 10 },
      didParseCell: function (data) {
        if (data.section === "body") {
          const risk = data.row.raw[2];
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
  }

  // Redundant Clauses Table
  if (riskReport.redundant_clauses && riskReport.redundant_clauses.length > 0) {
    const redundantTableData = riskReport.redundant_clauses.map((item, i) => [
      i + 1,
      item.redundant,
      item.risk_level,
      item.explanation,
      item.suggestion,
    ]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "Redundant Clause", "Risk Level", "Explanation", "Suggestion"]],
      body: redundantTableData,
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
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 60 },
        4: { cellWidth: 60 },
      },
      margin: { left: 12, right: 10 },
      didParseCell: function (data) {
        if (data.section === "body") {
          const risk = data.row.raw[2];
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
  }

  if (returnBlob) {
    // Only return the Blob, do NOT trigger download
    return doc.output("blob");
  } else {
    // Trigger download
    doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
  }
}