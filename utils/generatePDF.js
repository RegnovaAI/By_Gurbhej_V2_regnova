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
//   doc.line(30, 30, 196, 30);

//   // Risk Summary
//   const risks = riskReport?.risks || [];
//   const missingClauses = riskReport?.missing_clauses || [];
//   const redundantClauses = riskReport?.redundant_clauses || [];
  
//   const counts = {
//     High: risks.filter((r) => r.risk_level === "High").length,
//     Medium: risks.filter((r) => r.risk_level === "Medium").length,
//     Low: risks.filter((r) => r.risk_level === "Low").length,
//   };

//   doc.setFontSize(12);
//   doc.setTextColor(40);
//   doc.text("Risk Summary:", 14, 38);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   doc.setTextColor(200, 0, 0);
//   doc.text(`High: ${counts.High}`, 14, 46);
//   doc.setTextColor(255, 140, 0);
//   doc.text(`Medium: ${counts.Medium}`, 75, 46); // Increased spacing for 2-digit numbers
//   doc.setTextColor(0, 150, 0);
//   doc.text(`Low: ${counts.Low}`, 145, 46); // Increased spacing for 2-digit numbers

//   let currentY = 54;

//   // Main Risk Table - Only show if there are risks
//   if (risks.length > 0) {
//     const tableData = risks.map((item, i) => [
//       i + 1,
//       item.issue || '',
//       item.risk_level || '',
//       item.explanation || '',
//       item.suggestion || '',
//     ]);

//     autoTable(doc, {
//       startY: currentY,
//       head: [["#", "Issue", "Risk Level", "Explanation", "Suggestion"]],
//       body: tableData,
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
//         0: { cellWidth: 15 },
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
//     currentY = doc.lastAutoTable.finalY + 10;
//   } else {
//     // Add a message when no risks are found
//     doc.setTextColor(100);
//     doc.setFontSize(11);
//     doc.text("No risk issues found.", 14, currentY);
//     currentY += 15;
//   }

//   // Missing Clauses Table - Only show if there are missing clauses
//   if (missingClauses.length > 0) {
//     const missingTableData = missingClauses.map((item, i) => [
//       i + 1,
//       item.missing || '',
//       item.risk_level || '',
//       item.explanation || '',
//       item.suggestion || '',
//     ]);
    
//     autoTable(doc, {
//       startY: currentY,
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
//         0: { cellWidth: 15 },
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
//     currentY = doc.lastAutoTable.finalY + 10;
//   }

//   // Redundant Clauses Table - Only show if there are redundant clauses
//   if (redundantClauses.length > 0) {
//     const redundantTableData = redundantClauses.map((item, i) => [
//       i + 1,
//       item.redundant || '',
//       item.risk_level || '',
//       item.explanation || '',
//       item.suggestion || '',
//     ]);
    
//     autoTable(doc, {
//       startY: currentY,
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
//         0: { cellWidth: 8 },
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




// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export async function generatePDFReport(filename, riskReport) {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const logoSize = { width: 45, height: 18 }; // Increased size for better visibility
//   const logoUrl = "/regnovaai-logo.png"; // Update to correct logo path

//   // Load logo image
//   const loadLogo = () =>
//     new Promise((resolve) => {
//       const img = new Image();
//       img.src = logoUrl;
//       img.onload = () => resolve(img);
//     });
//   const logoImage = await loadLogo();

//   let startY = 20;

//   const getClauseText = (item) =>
//     item.issue || item.missing || item.redundant || "—";

//   // === HEADER ===
//   const renderHeader = (title) => {
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20); // Slightly larger font for title
//     doc.text(title, 14, startY + 5); // Adjusted Y position
//     doc.addImage(
//       logoImage,
//       "PNG",
//       pageWidth - logoSize.width - 14,
//       startY - 5, // Adjusted Y position
//       logoSize.width,
//       logoSize.height
//     );
//     startY += 20; // Increased spacing after header
//   };

//   // === FILE METADATA ===
//   const renderMetadata = () => {
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(11);
//     doc.text(`File Audited: ${filename}`, 14, startY);
//     startY += 8;
//     doc.line(14, startY, pageWidth - 14, startY);
//     startY += 6;
//   };

//   // === SUMMARY ===
//   const renderSummary = () => {
//     const counts = {
//       High: riskReport.risks.filter((r) => r.risk_level === "High").length,
//       Medium: riskReport.risks.filter((r) => r.risk_level === "Medium").length,
//       Low: riskReport.risks.filter((r) => r.risk_level === "Low").length,
//     };

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(12);
//     doc.setTextColor(40);
//     doc.text("Risk Summary:", 14, startY);

//     startY += 8;
//     doc.setFontSize(11);
//     doc.setTextColor(200, 0, 0);
//     doc.text(`High: ${counts.High}`, 14, startY);
//     doc.setTextColor(255, 140, 0);
//     doc.text(`Medium: ${counts.Medium}`, 60, startY);
//     doc.setTextColor(0, 150, 0);
//     doc.text(`Low: ${counts.Low}`, 120, startY);
//     startY += 10;
//   };

//   // === TABLE SECTION ===
//   const renderTableSection = (title, data, headers) => {
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(13);
//     doc.setTextColor(40);
//     doc.text(title, 14, startY);
//     doc.line(14, startY + 1.5, pageWidth - 14, startY + 1.5);
//     startY += 8; // Increased spacing

//     autoTable(doc, {
//       startY: startY,
//       head: [headers],
//       body: data.map((item, i) => [
//         i + 1,
//         getClauseText(item),
//         item.risk_level,
//         item.explanation,
//         item.suggestion,
//       ]),
//       styles: {
//         fontSize: 9,
//         overflow: "linebreak",
//         cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
//         valign: "middle",
//       },
//       headStyles: {
//         fillColor: [22, 78, 99],
//         textColor: 255,
//         valign: "middle",
//         halign: "center",
//       },
//       columnStyles: {
//         0: { cellWidth: 12 },  // Slightly wider for numbers
//         1: { cellWidth: 38 },  // Adjusted for better spacing
//         2: { cellWidth: 22 },  // Slightly wider for risk level
//         3: { cellWidth: 53 },  // Adjusted explanation width
//         4: { cellWidth: 53 },  // Adjusted suggestion width
//       },
//       margin: { left: 14, right: 14 }, // Aligned with page margins
//       didParseCell: function (data) {
//         const risk = data.row.raw[2];
//         if (data.section === "body") {
//           if (risk === "High") data.cell.styles.fillColor = [255, 230, 230];
//           else if (risk === "Medium") data.cell.styles.fillColor = [255, 250, 205];
//           else if (risk === "Low") data.cell.styles.fillColor = [220, 255, 220];
//         }
//       },
//     });

//     startY = doc.lastAutoTable.finalY + 12;
//   };

//   // === RENDERING ===
//   renderHeader("RegnovaAI Compliance Risk Report");
//   renderMetadata();

//   // Render table first
//   renderTableSection("Issues", riskReport.risks, [
//     "#",
//     "Issue",
//     "Risk Level",
//     "Explanation",
//     "Suggestion",
//   ]);

//   // Force new page for summary
//   doc.addPage();
//   startY = 20; // Reset startY for new page
//   renderSummary();

//   if (riskReport.missing_clauses?.length > 0) {
//     renderTableSection("Missing Clauses", riskReport.missing_clauses, [
//       "#",
//       "Missing Clause",
//       "Risk Level",
//       "Explanation",
//       "Suggestion",
//     ]);
//   }

//   if (riskReport.redundant_clauses?.length > 0) {
//     renderTableSection("Redundant Clauses", riskReport.redundant_clauses, [
//       "#",
//       "Redundant Clause",
//       "Risk Level",
//       "Explanation",
//       "Suggestion",
//     ]);
//   }

//   // === FOOTER (Logo & Page Number) ===
//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) {
//     doc.setPage(i);
//     doc.setFontSize(9);
//     doc.setTextColor(100);
//     doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
    
//     // Remove logo from footer loop - it will only appear in the header of first page
//   }

//   doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
// }




import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generatePDFReport(filename, riskReport) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logoSize = { width: 40, height: 40 }; // Adjusted for 1:1 aspect ratio
  const logoUrl = "/regnovaai-logo.png"; // Update to correct logo path

  // Load logo image
  const loadLogo = () =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        // Calculate aspect ratio based on actual image dimensions
        const aspectRatio = img.width / img.height;
        logoSize.height = logoSize.width / aspectRatio;
        resolve(img);
      };
    });
  const logoImage = await loadLogo();

  let startY = 20;

  const getClauseText = (item) =>
    item.issue || item.missing || item.redundant || "—";

  // === HEADER ===
  const renderHeader = (title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(title, 14, startY + 5);
    doc.addImage(
      logoImage,
      "PNG",
      pageWidth - logoSize.width - 14,
      startY - 5,
      logoSize.width,
      logoSize.height
    );
    startY += 25; // Increased spacing after header
  };

  // === SUMMARY TITLE ===
  const renderSummaryTitle = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40);
    doc.text("Risk Summary:", 14, startY);
    startY += 15;
  };

  // === METADATA ===
  const renderMetadata = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`File Audited: ${filename}`, 14, startY);
    startY += 10; // Reduced from 15 to 10
    startY += 5; // Reduced from 15 to 5
  };

  // === SUMMARY COUNTS ===
  const renderSummaryCounts = () => {
    const counts = {
      High: riskReport.risks.filter((r) => r.risk_level === "High").length,
      Medium: riskReport.risks.filter((r) => r.risk_level === "Medium").length,
      Low: riskReport.risks.filter((r) => r.risk_level === "Low").length,
    };

    doc.setFontSize(12);
    // High count
    doc.setTextColor(200, 0, 0);
    doc.text(`High: ${counts.High}`, 14, startY);
    
    // Medium count
    doc.setTextColor(255, 140, 0);
    doc.text(`Medium: ${counts.Medium}`, 80, startY);
    
    // Low count
    doc.setTextColor(0, 150, 0);
    doc.text(`Low: ${counts.Low}`, 160, startY);
    
    startY += 15;
  };

  // === TABLE SECTION ===
  const renderTableSection = (title, data, headers) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40);
    doc.text(title, 14, startY);
    startY += 15;

    // If this is the Identified Risk Issues section, show counts here
    if (title === "Identified Risk Issues") {
      doc.setFontSize(12);
      // High count
      doc.setTextColor(200, 0, 0);
      doc.text(`High: ${riskReport.risks.filter((r) => r.risk_level === "High").length}`, 14, startY);
      
      // Medium count
      doc.setTextColor(255, 140, 0);
      doc.text(`Medium: ${riskReport.risks.filter((r) => r.risk_level === "Medium").length}`, 80, startY);
      
      // Low count
      doc.setTextColor(0, 150, 0);
      doc.text(`Low: ${riskReport.risks.filter((r) => r.risk_level === "Low").length}`, 160, startY);
      
      startY += 15;
    }

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
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
        valign: "middle",
      },
      headStyles: {
        fillColor: [22, 78, 99],
        textColor: 255,
        valign: "middle",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 38 },
        2: { cellWidth: 22, halign: 'center' },
        3: { cellWidth: 53 },
        4: { cellWidth: 53 },
      },
      margin: { left: 14, right: 14 },
      didParseCell: function (data) {
        const risk = data.row.raw[2];
        if (data.section === "body") {
          if (risk === "High") data.cell.styles.fillColor = [255, 240, 240];
          else if (risk === "Medium") data.cell.styles.fillColor = [255, 252, 235];
          else if (risk === "Low") data.cell.styles.fillColor = [240, 255, 240];
        }
      },
    });

    startY = doc.lastAutoTable.finalY + 12;
  };

  // === RENDERING ===
  renderHeader("RegnovaAI Compliance Risk Report");
  renderMetadata();
  renderSummaryTitle();
  renderTableSection("Identified Risk Issues", riskReport.risks, [
    "#",
    "Issue",
    "Risk Level",
    "Explanation",
    "Suggestion",
  ]);

  if (riskReport.missing_clauses?.length > 0) {
    renderTableSection("Missing Clauses", riskReport.missing_clauses, [
      "#",
      "Missing Clause",
      "Risk Level",
      "Explanation",
      "Suggestion",
    ]);
  }

  if (riskReport.redundant_clauses?.length > 0) {
    renderTableSection("Redundant Clauses", riskReport.redundant_clauses, [
      "#",
      "Redundant Clause",
      "Risk Level",
      "Explanation",
      "Suggestion",
    ]);
  }

  // === FOOTER (Logo & Page Number) ===
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
    
    // Remove logo from footer loop - it will only appear in the header of first page
  }

  doc.save(`${filename.replace(/\.[^/.]+$/, "")}-Audit-Report.pdf`);
}