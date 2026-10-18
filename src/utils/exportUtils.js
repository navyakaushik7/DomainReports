const COLUMN_LABELS = {
  domainName: "Domain Name",
  ministry: "Ministry",
  state: "State",
  department: "Department",
  organisation: "Organisation",
  orgCategory: "Organisation Category",
  nodalOfficer: "Nodal Officer",
  email: "Email",
  status: "Status",
  activationDate: "Activation Date",
  createdDate: "Created Date",
  lastUpdated: "Last Updated",
};

export async function exportToExcel(rows, columns, filename = "domain-report") {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");
  const headers = columns.map((key) => COLUMN_LABELS[key] || key);
  sheet.columns = headers.map((header, index) => ({ header, key: `column${index}`, width: Math.min(36, Math.max(14, header.length + 3)) }));
  sheet.addRows(rows.map((row) => columns.map((key) => row[key] ?? "")));
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF142038" } };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${filename}.xlsx`);
}

export async function exportToCSV(rows, columns, filename = "domain-report") {
  const csvCell = (value) => {
    let text = String(value ?? "");
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const headers = columns.map((key) => COLUMN_LABELS[key] || key);
  const csv = [headers, ...rows.map((row) => columns.map((key) => row[key]))]
    .map((line) => line.map(csvCell).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportToPDF(rows, columns, filename = "domain-report") {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"), import("jspdf-autotable"),
  ]);
  const doc = new jsPDF({ orientation: "landscape" });
  const headers = columns.map((c) => COLUMN_LABELS[c] || c);
  const body = rows.map((row) => columns.map((c) => String(row[c] ?? "")));

  doc.setFontSize(14);
  doc.text("Domain Reports — Report", 14, 14);
  doc.setFontSize(9);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 20);

  autoTable(doc, {
    head: [headers],
    body,
    startY: 26,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: 10, right: 10 },
  });

  doc.save(`${filename}.pdf`);
}
