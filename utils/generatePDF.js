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
  doc.line(30, 30, 196, 30);

  // Risk Summary
  const risks = riskReport?.risks || [];
  const missingClauses = riskReport?.missing_clauses || [];
  const redundantClauses = riskReport?.redundant_clauses || [];
  
  const counts = {
    High: risks.filter((r) => r.risk_level === "High").length,
    Medium: risks.filter((r) => r.risk_level === "Medium").length,
    Low: risks.filter((r) => r.risk_level === "Low").length,
  };

  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("Risk Summary:", 14, 38);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(200, 0, 0);
  doc.text(`High: ${counts.High}`, 14, 46);
  doc.setTextColor(255, 140, 0);
  doc.text(`Medium: ${counts.Medium}`, 75, 46); // Increased spacing for 2-digit numbers
  doc.setTextColor(0, 150, 0);
  doc.text(`Low: ${counts.Low}`, 145, 46); // Increased spacing for 2-digit numbers

  let currentY = 54;

  // Main Risk Table - Only show if there are risks
  if (risks.length > 0) {
    const tableData = risks.map((item, i) => [
      i + 1,
      item.issue || '',
      item.risk_level || '',
      item.explanation || '',
      item.suggestion || '',
    ]);

    autoTable(doc, {
      startY: currentY,
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
        0: { cellWidth: 15 },
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
    currentY = doc.lastAutoTable.finalY + 10;
  } else {
    // Add a message when no risks are found
    doc.setTextColor(100);
    doc.setFontSize(11);
    doc.text("No risk issues found.", 14, currentY);
    currentY += 15;
  }

  // Missing Clauses Table - Only show if there are missing clauses
  if (missingClauses.length > 0) {
    const missingTableData = missingClauses.map((item, i) => [
      i + 1,
      item.missing || '',
      item.risk_level || '',
      item.explanation || '',
      item.suggestion || '',
    ]);
    
    autoTable(doc, {
      startY: currentY,
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
        0: { cellWidth: 15 },
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
    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Redundant Clauses Table - Only show if there are redundant clauses
  if (redundantClauses.length > 0) {
    const redundantTableData = redundantClauses.map((item, i) => [
      i + 1,
      item.redundant || '',
      item.risk_level || '',
      item.explanation || '',
      item.suggestion || '',
    ]);
    
    autoTable(doc, {
      startY: currentY,
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
  }

  if (returnBlob) {
    // Only return the Blob, do NOT trigger download
    return doc.output("blob");
  } else {
    // Trigger download
    doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
  }
}
